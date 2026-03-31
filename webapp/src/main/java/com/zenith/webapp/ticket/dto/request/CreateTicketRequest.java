package com.zenith.webapp.ticket.dto.request;

import com.zenith.webapp.ticket.enums.TicketCategory;
import com.zenith.webapp.ticket.enums.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateTicketRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotBlank
    private String resourceLocation;

    @NotBlank
    private String preferredContactDetails;

    @NotNull
    private TicketCategory category;

    @NotNull
    private TicketPriority priority;
}


//  Using a request DTO:

// Accepts only required fields
// Keeps API secure

