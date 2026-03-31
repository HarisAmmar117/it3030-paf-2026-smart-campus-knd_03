package com.zenith.webapp.ticket.enums;

public enum TicketStatus {
    OPEN,
    IN_PROGRESS,
    RESOLVED,
    CLOSED,
    REJECTED

}


// Defines the allowed workflow states
// Prevents random string status values in database/API.
