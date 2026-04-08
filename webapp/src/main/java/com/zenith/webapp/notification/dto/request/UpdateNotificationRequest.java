package com.zenith.webapp.notification.dto.request;

import com.zenith.webapp.notification.enums.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateNotificationRequest {

    @NotNull(message = "Type is required")
    private NotificationType type;

    @NotBlank(message = "Message is required")
    private String message;

    private Long referenceId;
}