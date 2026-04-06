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
}


// Accepts HTTP POST request
// Validates input
// Extracts user info
// Calls service
// Returns proper HTTP response