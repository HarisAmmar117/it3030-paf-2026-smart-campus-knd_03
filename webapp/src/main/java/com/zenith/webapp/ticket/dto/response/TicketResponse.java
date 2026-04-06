package com.zenith.webapp.ticket.dto.response;

import com.zenith.webapp.ticket.enums.TicketCategory;
import com.zenith.webapp.ticket.enums.TicketPriority;
import com.zenith.webapp.ticket.enums.TicketStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TicketResponse {

    private Long id;
    private String title;
    private String description;
    private String resourceLocation;
    private String preferredContactDetails;
    private TicketCategory category;
    private TicketPriority priority;
    private TicketStatus status;
    private String resolutionNotes;
    private String rejectionReason;
    private Long requesterId;
    private Long assigneeId;
    private int attachmentCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


// Defines what ticket data the API sends back to frontend.
// Keeps entity hidden from controller responses (clean architecture).
// Includes fields needed for list/detail pages and workflow UI.