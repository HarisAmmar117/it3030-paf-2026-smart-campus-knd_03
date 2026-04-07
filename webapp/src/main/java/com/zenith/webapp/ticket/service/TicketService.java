package com.zenith.webapp.ticket.service;

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
import org.springframework.web.multipart.MultipartFile;
import com.zenith.webapp.ticket.dto.request.UpdateTicketRequest;

import java.util.List;

public interface TicketService {

    TicketResponse createTicket(CreateTicketRequest request, Long requesterId);

    List<TicketResponse> getTickets(TicketStatus status, TicketPriority priority);

    TicketResponse getTicketById(Long ticketId);

    TicketResponse updateStatus(Long ticketId, UpdateTicketStatusRequest request, Long actorUserId, String actorRole);

    TicketResponse assignTicket(Long ticketId, AssignTicketRequest request, Long actorUserId, String actorRole);

    List<TicketAttachmentResponse> addAttachments(Long ticketId, List<MultipartFile> files);

    void deleteAttachment(Long ticketId, Long attachmentId);

    TicketCommentResponse addComment(Long ticketId, CreateCommentRequest request, Long actorUserId);

    TicketCommentResponse updateComment(Long ticketId, Long commentId, UpdateCommentRequest request, Long actorUserId, String actorRole);

    void deleteComment(Long ticketId, Long commentId, Long actorUserId, String actorRole);

    List<TicketCommentResponse> getComments(Long ticketId);

    TicketResponse updateTicketByRequester(Long ticketId, UpdateTicketRequest request, Long requesterId);

    void deleteTicketByRequester(Long ticketId, Long requesterId);
}



// TicketService  (what the system can do)
// TicketServiceImpl (how it is done)

// Defines all Module C business operations in one contract.
// Keeps controller thin and delegates logic to service layer.