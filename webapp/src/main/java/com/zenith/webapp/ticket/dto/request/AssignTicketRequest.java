package com.zenith.webapp.ticket.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignTicketRequest {

    @NotNull
    private Long assigneeId;
}


// Defines payload for assigning a ticket to technician/staff.