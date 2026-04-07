package com.zenith.webapp.notification.service;

import com.zenith.webapp.notification.dto.request.CreateNotificationRequest;
import com.zenith.webapp.notification.dto.response.NotificationResponse;

import java.util.List;

public interface NotificationService {

    // CREATE — send a new notification
    NotificationResponse createNotification(CreateNotificationRequest request);

    // READ — get all notifications for a user
    List<NotificationResponse> getNotificationsForUser(Long recipientId);

    // READ — get unread count for a user
    long getUnreadCount(Long recipientId);

    // UPDATE — mark a single notification as read
    NotificationResponse markAsRead(Long notificationId, Long actorUserId);

    // UPDATE — mark ALL notifications as read for a user
    void markAllAsRead(Long recipientId);

    // DELETE — delete a single notification
    void deleteNotification(Long notificationId, Long actorUserId);
}