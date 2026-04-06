package com.zenith.webapp.ticket.service.impl;

import com.zenith.webapp.ticket.dto.request.AssignTicketRequest;
import com.zenith.webapp.ticket.dto.request.CreateCommentRequest;
import com.zenith.webapp.ticket.dto.request.CreateTicketRequest;
import com.zenith.webapp.ticket.dto.request.UpdateCommentRequest;
import com.zenith.webapp.ticket.dto.request.UpdateTicketStatusRequest;
import com.zenith.webapp.ticket.dto.response.TicketAttachmentResponse;
import com.zenith.webapp.ticket.dto.response.TicketCommentResponse;
import com.zenith.webapp.ticket.dto.response.TicketResponse;
import com.zenith.webapp.ticket.enums.TicketPriority;
import com.zenith.webapp.ticket.enums.TicketStatus;
import com.zenith.webapp.ticket.model.Ticket;
import com.zenith.webapp.ticket.model.TicketAttachment;
import com.zenith.webapp.ticket.model.TicketComment;
import com.zenith.webapp.ticket.repository.TicketAttachmentRepository;
import com.zenith.webapp.ticket.repository.TicketCommentRepository;
import com.zenith.webapp.ticket.repository.TicketRepository;
import com.zenith.webapp.ticket.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service   //Marks this class as business logic
@RequiredArgsConstructor
@Transactional
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final TicketAttachmentRepository attachmentRepository;
    private final TicketCommentRepository commentRepository;

    @Value("${app.ticket.upload-dir:uploads/tickets}")
    private String uploadBaseDir;

    @Override
    public TicketResponse createTicket(CreateTicketRequest request, Long requesterId) {
        Ticket ticket = Ticket.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .resourceLocation(request.getResourceLocation())
                .preferredContactDetails(request.getPreferredContactDetails())
                .category(request.getCategory())
                .priority(request.getPriority())
                .status(TicketStatus.OPEN)
                .requesterId(requesterId)
                .build();

        Ticket saved = ticketRepository.save(ticket);
        return toTicketResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketResponse> getTickets(TicketStatus status, TicketPriority priority) {
        return ticketRepository.findAll().stream()
                .filter(t -> status == null || t.getStatus() == status)
                .filter(t -> priority == null || t.getPriority() == priority)
                .map(this::toTicketResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TicketResponse getTicketById(Long ticketId) {
        Ticket ticket = getTicketOrThrow(ticketId);
        return toTicketResponse(ticket);
    }

    @Override
    public TicketResponse updateStatus(Long ticketId, UpdateTicketStatusRequest request, Long actorUserId, String actorRole) {
        Ticket ticket = getTicketOrThrow(ticketId);

        boolean isAdmin = isAdmin(actorRole);
        boolean isAssignee = ticket.getAssigneeId() != null && ticket.getAssigneeId().equals(actorUserId);

        if (!isAdmin && !isAssignee) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only assignee or admin can update status");
        }

        validateTransition(ticket.getStatus(), request.getStatus(), isAdmin);

        if (request.getStatus() == TicketStatus.RESOLVED && isBlank(request.getResolutionNotes())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Resolution notes are required for RESOLVED");
        }

        if (request.getStatus() == TicketStatus.REJECTED) {
            if (!isAdmin) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admin can reject ticket");
            }
            if (isBlank(request.getRejectionReason())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rejection reason is required for REJECTED");
            }
            ticket.setRejectionReason(request.getRejectionReason());
        }

        ticket.setStatus(request.getStatus());

        if (!isBlank(request.getResolutionNotes())) {
            ticket.setResolutionNotes(request.getResolutionNotes());
        }

        Ticket updated = ticketRepository.save(ticket);
        return toTicketResponse(updated);
    }

    @Override
    public TicketResponse assignTicket(Long ticketId, AssignTicketRequest request, Long actorUserId, String actorRole) {
        if (!isAdmin(actorRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admin can assign ticket");
        }

        Ticket ticket = getTicketOrThrow(ticketId);
        ticket.setAssigneeId(request.getAssigneeId());
        Ticket updated = ticketRepository.save(ticket);
        return toTicketResponse(updated);
    }

    @Override
    public List<TicketAttachmentResponse> addAttachments(Long ticketId, List<MultipartFile> files) {
        Ticket ticket = getTicketOrThrow(ticketId);

        if (files == null || files.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one file is required");
        }

        long existing = attachmentRepository.countByTicketId(ticketId);
        if (existing + files.size() > 3) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Maximum 3 attachments allowed per ticket");
        }

        Path ticketDir = Path.of(uploadBaseDir, String.valueOf(ticketId));
        try {
            Files.createDirectories(ticketDir);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not create upload directory");
        }

        List<TicketAttachment> saved = files.stream().map(file -> {
            String contentType = file.getContentType() == null ? "" : file.getContentType();
            if (!contentType.startsWith("image/")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only image attachments are allowed");
            }

            String original = file.getOriginalFilename() == null ? "unknown" : file.getOriginalFilename();
            String stored = UUID.randomUUID() + "_" + original;
            Path destination = ticketDir.resolve(stored);

            try {
                Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save file: " + original);
            }

            TicketAttachment attachment = TicketAttachment.builder()
                    .ticket(ticket)
                    .originalFileName(original)
                    .storedFileName(stored)
                    .filePath(destination.toString())
                    .contentType(contentType)
                    .sizeInBytes(file.getSize())
                    .build();

            return attachmentRepository.save(attachment);
        }).toList();

        return saved.stream().map(this::toAttachmentResponse).toList();
    }

    @Override
    public void deleteAttachment(Long ticketId, Long attachmentId) {
        getTicketOrThrow(ticketId);

        TicketAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Attachment not found"));

        if (!attachment.getTicket().getId().equals(ticketId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Attachment does not belong to ticket");
        }

        attachmentRepository.delete(attachment);

        try {
            Files.deleteIfExists(Path.of(attachment.getFilePath()));
        } catch (IOException ignored) {
            // Ignore file cleanup failures after DB delete.
        }
    }

    @Override
    public TicketCommentResponse addComment(Long ticketId, CreateCommentRequest request, Long actorUserId) {
        Ticket ticket = getTicketOrThrow(ticketId);

        TicketComment comment = TicketComment.builder()
                .ticket(ticket)
                .authorId(actorUserId)
                .content(request.getContent())
                .build();

        TicketComment saved = commentRepository.save(comment);
        return toCommentResponse(saved);
    }

    @Override
    public TicketCommentResponse updateComment(Long ticketId, Long commentId, UpdateCommentRequest request, Long actorUserId, String actorRole) {
        getTicketOrThrow(ticketId);

        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));

        if (!comment.getTicket().getId().equals(ticketId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment does not belong to ticket");
        }

        boolean canEdit = comment.getAuthorId().equals(actorUserId) || isAdmin(actorRole);
        if (!canEdit) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only owner or admin can edit comment");
        }

        comment.setContent(request.getContent());
        TicketComment updated = commentRepository.save(comment);
        return toCommentResponse(updated);
    }

    @Override
    public void deleteComment(Long ticketId, Long commentId, Long actorUserId, String actorRole) {
        getTicketOrThrow(ticketId);

        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));

        if (!comment.getTicket().getId().equals(ticketId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment does not belong to ticket");
        }

        boolean canDelete = comment.getAuthorId().equals(actorUserId) || isAdmin(actorRole);
        if (!canDelete) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only owner or admin can delete comment");
        }

        commentRepository.delete(comment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketCommentResponse> getComments(Long ticketId) {
        getTicketOrThrow(ticketId);
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId).stream()
                .map(this::toCommentResponse)
                .toList();
    }

    private Ticket getTicketOrThrow(Long ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));
    }

    private void validateTransition(TicketStatus current, TicketStatus next, boolean isAdmin) {
        if (next == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New status is required");
        }

        if (current == TicketStatus.CLOSED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Closed ticket cannot be changed");
        }

        if (next == TicketStatus.REJECTED) {
            if (!isAdmin) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admin can reject ticket");
            }
            return;
        }

        boolean valid =
                (current == TicketStatus.OPEN && next == TicketStatus.IN_PROGRESS) ||
                (current == TicketStatus.IN_PROGRESS && next == TicketStatus.RESOLVED) ||
                (current == TicketStatus.RESOLVED && next == TicketStatus.CLOSED);

        if (!valid) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Invalid transition: " + current + " -> " + next);
        }
    }

    private TicketResponse toTicketResponse(Ticket ticket) {
        return TicketResponse.builder()
                .id(ticket.getId())
                .title(ticket.getTitle())
                .description(ticket.getDescription())
                .resourceLocation(ticket.getResourceLocation())
                .preferredContactDetails(ticket.getPreferredContactDetails())
                .category(ticket.getCategory())
                .priority(ticket.getPriority())
                .status(ticket.getStatus())
                .resolutionNotes(ticket.getResolutionNotes())
                .rejectionReason(ticket.getRejectionReason())
                .requesterId(ticket.getRequesterId())
                .assigneeId(ticket.getAssigneeId())
                .attachmentCount((int) attachmentRepository.countByTicketId(ticket.getId()))
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }

    private TicketCommentResponse toCommentResponse(TicketComment comment) {
        return TicketCommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .authorId(comment.getAuthorId())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }

    private TicketAttachmentResponse toAttachmentResponse(TicketAttachment attachment) {
        return TicketAttachmentResponse.builder()
                .id(attachment.getId())
                .originalFileName(attachment.getOriginalFileName())
                .contentType(attachment.getContentType())
                .sizeInBytes(attachment.getSizeInBytes())
                .filePath(attachment.getFilePath())
                .uploadedAt(attachment.getUploadedAt())
                .build();
    }

    private boolean isAdmin(String role) {
        return role != null && role.equalsIgnoreCase("ADMIN");
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}



// CRUD is executed in the impl, defined in the service, and triggered by the controller.