package com.zenith.webapp.notification.dto.request;

import com.zenith.webapp.notification.enums.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateNotificationRequest {

    @NotNull(message = "Recipient ID is required")
    private Long recipientId;

    @NotNull(message = "Notification type is required")
    private NotificationType type;

    @NotBlank(message = "Message is required")
    private String message;

    // Optional: links the notification to a booking or ticket
    private Long referenceId;
}