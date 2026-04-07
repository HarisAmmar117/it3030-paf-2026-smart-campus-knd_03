package com.zenith.webapp.ticket.controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.zenith.webapp.ticket.dto.request.CreateTicketRequest;
import com.zenith.webapp.ticket.dto.response.TicketResponse;
import com.zenith.webapp.ticket.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.zenith.webapp.ticket.enums.TicketPriority;
import com.zenith.webapp.ticket.enums.TicketStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;
import com.zenith.webapp.ticket.dto.request.UpdateTicketRequest;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;
import com.zenith.webapp.ticket.dto.request.CreateCommentRequest;
import com.zenith.webapp.ticket.dto.response.TicketCommentResponse;
import com.zenith.webapp.ticket.dto.request.UpdateCommentRequest;
import com.zenith.webapp.ticket.dto.response.TicketAttachmentResponse;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(
            @Valid @RequestBody CreateTicketRequest request,
            @RequestHeader("X-User-Id") Long requesterId
    ) {
        TicketResponse response = ticketService.createTicket(request, requesterId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @GetMapping
    public ResponseEntity<List<TicketResponse>> getTickets(
        @RequestParam(required = false) TicketStatus status,
        @RequestParam(required = false) TicketPriority priority
) {
    return ResponseEntity.ok(ticketService.getTickets(status, priority));
}

    @PatchMapping("/{ticketId}")
    public ResponseEntity<TicketResponse> updateTicketByRequester(
        @PathVariable Long ticketId,
        @Valid @RequestBody UpdateTicketRequest request,
        @RequestHeader("X-User-Id") Long requesterId
) {
    return ResponseEntity.ok(ticketService.updateTicketByRequester(ticketId, request, requesterId));
}


    @DeleteMapping("/{ticketId}")
    public ResponseEntity<Void> deleteTicketByRequester(
        @PathVariable Long ticketId,
        @RequestHeader("X-User-Id") Long requesterId
) {
    ticketService.deleteTicketByRequester(ticketId, requesterId);
    return ResponseEntity.noContent().build();
}

    @PostMapping("/{ticketId}/comments")
    public ResponseEntity<TicketCommentResponse> addComment(
        @PathVariable Long ticketId,
        @Valid @RequestBody CreateCommentRequest request,
        @RequestHeader("X-User-Id") Long actorUserId
) {
    return ResponseEntity.status(HttpStatus.CREATED)
            .body(ticketService.addComment(ticketId, request, actorUserId));
}

    @GetMapping("/{ticketId}/comments")
    public ResponseEntity<List<TicketCommentResponse>> getComments(@PathVariable Long ticketId) {
    return ResponseEntity.ok(ticketService.getComments(ticketId));
}

    @PatchMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<TicketCommentResponse> updateComment(
        @PathVariable Long ticketId,
        @PathVariable Long commentId,
        @Valid @RequestBody UpdateCommentRequest request,
        @RequestHeader("X-User-Id") Long actorUserId,
        @RequestHeader(value = "X-User-Role", defaultValue = "USER") String actorRole
) {
    return ResponseEntity.ok(
            ticketService.updateComment(ticketId, commentId, request, actorUserId, actorRole)
    );
}

    @DeleteMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
        @PathVariable Long ticketId,
        @PathVariable Long commentId,
        @RequestHeader("X-User-Id") Long actorUserId,
        @RequestHeader(value = "X-User-Role", defaultValue = "USER") String actorRole
) {
    ticketService.deleteComment(ticketId, commentId, actorUserId, actorRole);
    return ResponseEntity.noContent().build();
}

    @PostMapping(value = "/{ticketId}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<TicketAttachmentResponse>> addAttachments(
        @PathVariable Long ticketId,
        @RequestParam("files") List<MultipartFile> files
) {
    return ResponseEntity.status(HttpStatus.CREATED).body(ticketService.addAttachments(ticketId, files));
}

    @GetMapping("/{ticketId}/attachments")
    public ResponseEntity<List<TicketAttachmentResponse>> getAttachments(@PathVariable Long ticketId) {
    return ResponseEntity.ok(ticketService.getAttachments(ticketId));
}

    @DeleteMapping("/{ticketId}/attachments/{attachmentId}")
    public ResponseEntity<Void> deleteAttachment(
        @PathVariable Long ticketId,
        @PathVariable Long attachmentId
) {
    ticketService.deleteAttachment(ticketId, attachmentId);
    return ResponseEntity.noContent().build();
}
}


// Accepts HTTP POST request
// Validates input
// Extracts user info
// Calls service
// Returns proper HTTP response