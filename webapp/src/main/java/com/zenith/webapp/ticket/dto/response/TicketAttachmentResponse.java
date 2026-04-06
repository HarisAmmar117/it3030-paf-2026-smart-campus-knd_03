package com.zenith.webapp.ticket.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TicketAttachmentResponse {

    private Long id;
    private String originalFileName;
    private String contentType;
    private Long sizeInBytes;
    private String filePath;
    private LocalDateTime uploadedAt;
}


// Defines API output for attachment list/upload response.
// Gives frontend file metadata for display.