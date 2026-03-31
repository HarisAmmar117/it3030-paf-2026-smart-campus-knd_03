package com.zenith.webapp.ticket.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateCommentRequest {

    @NotBlank
    private String content;
}


// Defines payload for comment edit.
// Blocks empty updates.