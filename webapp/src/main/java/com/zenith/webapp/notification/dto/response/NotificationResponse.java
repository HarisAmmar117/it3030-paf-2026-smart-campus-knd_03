package com.zenith.webapp.notification.dto.response;

import com.zenith.webapp.notification.enums.NotificationType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {

    private Long id;
    private Long recipientId;
    private NotificationType type;
    private String message;
    private Long referenceId;
    private boolean isRead;
    private LocalDateTime createdAt;
}