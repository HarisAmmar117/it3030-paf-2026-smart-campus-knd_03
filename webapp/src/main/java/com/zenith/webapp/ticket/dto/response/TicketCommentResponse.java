package com.zenith.webapp.ticket.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TicketCommentResponse {

    private Long id;
    private String content;
    private Long authorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

// Defines API output for comments.
// Includes owner and timestamps for ownership UI logic.