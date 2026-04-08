package com.zenith.webapp.notification.controller;

import com.zenith.webapp.notification.dto.request.CreateNotificationRequest;
import com.zenith.webapp.notification.dto.request.UpdateNotificationRequest;
import com.zenith.webapp.notification.dto.response.NotificationResponse;
import com.zenith.webapp.notification.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // CREATE — POST /api/notifications
    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(
            @Valid @RequestBody CreateNotificationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(notificationService.createNotification(request));
    }

    // READ — GET /api/notifications → all notifications (no param)
    // READ — GET /api/notifications?recipientId=1 → one user's notifications
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(
            @RequestParam(required = false) Long recipientId) {
        if (recipientId != null) {
            return ResponseEntity.ok(notificationService.getNotificationsForUser(recipientId));
        }
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    // READ — GET /api/notifications/unread-count?recipientId=1
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @RequestParam Long recipientId) {
        return ResponseEntity.ok(Map.of("unreadCount", notificationService.getUnreadCount(recipientId)));
    }

    // UPDATE — PUT /api/notifications/{id} (edit type/message)
    @PutMapping("/{id}")
    public ResponseEntity<NotificationResponse> updateNotification(
            @PathVariable Long id,
            @Valid @RequestBody UpdateNotificationRequest request) {
        return ResponseEntity.ok(notificationService.updateNotification(id, request));
    }

    // UPDATE — PATCH /api/notifications/{id}/read
    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long actorUserId) {
        return ResponseEntity.ok(notificationService.markAsRead(id, actorUserId));
    }

    // UPDATE — PATCH /api/notifications/read-all
    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            @RequestHeader("X-User-Id") Long actorUserId) {
        notificationService.markAllAsRead(actorUserId);
        return ResponseEntity.noContent().build();
    }

    // DELETE — DELETE /api/notifications/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long actorUserId) {
        notificationService.deleteNotification(id, actorUserId);
        return ResponseEntity.noContent().build();
    }
}