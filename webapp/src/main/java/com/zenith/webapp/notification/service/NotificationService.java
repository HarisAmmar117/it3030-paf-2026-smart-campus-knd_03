package com.zenith.webapp.notification.service;

import com.zenith.webapp.notification.dto.request.CreateNotificationRequest;
import com.zenith.webapp.notification.dto.request.UpdateNotificationRequest;
import com.zenith.webapp.notification.dto.response.NotificationResponse;

import java.util.List;

public interface NotificationService {

    // CREATE
    NotificationResponse createNotification(CreateNotificationRequest request);

    // READ — all notifications for one user
    List<NotificationResponse> getNotificationsForUser(Long recipientId);

    // READ — ALL notifications (admin view)
    List<NotificationResponse> getAllNotifications();

    // READ — unread count for a user
    long getUnreadCount(Long recipientId);

    // UPDATE — mark one as read
    NotificationResponse markAsRead(Long notificationId, Long actorUserId);

    // UPDATE — mark all as read
    void markAllAsRead(Long recipientId);

    // UPDATE — edit message/type of a notification
    NotificationResponse updateNotification(Long notificationId, UpdateNotificationRequest request);

    // DELETE
    void deleteNotification(Long notificationId, Long actorUserId);
}