package com.zenith.webapp.notification.repository;

import com.zenith.webapp.notification.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Get all notifications for a specific user, newest first
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);

    // Count unread notifications for a user
    long countByRecipientIdAndIsReadFalse(Long recipientId);
}