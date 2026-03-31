package com.zenith.webapp.ticket.dto.request;

import com.zenith.webapp.ticket.enums.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateTicketStatusRequest {

    @NotNull
    private TicketStatus status;

    private String resolutionNotes;
    private String rejectionReason;
}


// UpdateTicketStatusRequest is a request DTO used to safely update a ticket’s status.