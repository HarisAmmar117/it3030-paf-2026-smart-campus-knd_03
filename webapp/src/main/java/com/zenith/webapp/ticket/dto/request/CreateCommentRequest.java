package com.zenith.webapp.ticket.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateCommentRequest {

    @NotBlank
    private String content;
}


// Defines payload for comment creation.
// Prevents empty comments using validation.