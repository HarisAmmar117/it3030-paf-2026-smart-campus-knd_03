package com.zenith.webapp.ticket.dto.request;

import com.zenith.webapp.ticket.enums.TicketCategory;
import com.zenith.webapp.ticket.enums.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateTicketRequest {

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