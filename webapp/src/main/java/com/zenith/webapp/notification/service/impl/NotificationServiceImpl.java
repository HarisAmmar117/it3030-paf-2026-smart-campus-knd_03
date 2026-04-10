package com.zenith.webapp.notification.service.impl;

import com.zenith.webapp.notification.dto.request.CreateNotificationRequest;
import com.zenith.webapp.notification.dto.request.UpdateNotificationRequest;
import com.zenith.webapp.notification.dto.response.NotificationResponse;
import com.zenith.webapp.notification.model.Notification;
import com.zenith.webapp.notification.repository.NotificationRepository;
import com.zenith.webapp.notification.service.NotificationService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public NotificationResponse createNotification(CreateNotificationRequest request) {
        Notification notification = Notification.builder()
                .recipientId(request.getRecipientId())
                .type(request.getType())
                .message(request.getMessage())
                .referenceId(request.getReferenceId())
                .isRead(false)
                .build();

        Notification saved = notificationRepository.save(notification);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotificationsForUser(Long recipientId) {
        return notificationRepository
                .findByRecipientIdOrderByCreatedAtDesc(recipientId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getAllNotifications() {
        return notificationRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(Long recipientId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(recipientId);
    }

    @Override
    public NotificationResponse markAsRead(Long notificationId, Long actorUserId) {
        Notification notification = getOrThrow(notificationId);

        if (!notification.getRecipientId().equals(actorUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only mark your own notifications as read");
        }

        notification.setRead(true);
        Notification updated = notificationRepository.save(notification);
        return toResponse(updated);
    }

    @Override
    public void markAllAsRead(Long recipientId) {
        List<Notification> unread = notificationRepository
                .findByRecipientIdOrderByCreatedAtDesc(recipientId)
                .stream()
                .filter(n -> !n.isRead())
                .toList();

        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    @Override
    public NotificationResponse updateNotification(Long notificationId, UpdateNotificationRequest request) {
        Notification notification = getOrThrow(notificationId);
        notification.setType(request.getType());
        notification.setMessage(request.getMessage());
        notification.setReferenceId(request.getReferenceId());
        Notification updated = notificationRepository.save(notification);
        return toResponse(updated);
    }

    @Override
    public void deleteNotification(Long notificationId, Long actorUserId) {
        Notification notification = getOrThrow(notificationId);

        if (!notification.getRecipientId().equals(actorUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own notifications");
        }

        notificationRepository.delete(notification);
    }

    @Override
    public void deleteNotification(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new EntityNotFoundException("Notification not found with id: " + id);
        }

        notificationRepository.deleteById(id);
    }

    // ── Private helpers ───────────────────────────────────────────────────

    private Notification getOrThrow(Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));
    }

    private NotificationResponse toResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .recipientId(notification.getRecipientId())
                .type(notification.getType())
                .message(notification.getMessage())
                .referenceId(notification.getReferenceId())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}