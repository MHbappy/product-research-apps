package com.bappy.application.notification.service;

import com.bappy.application.common.dto.PageResponse;
import com.bappy.application.exception.ResourceNotFoundException;
import com.bappy.application.notification.dto.CreateNotificationRequest;
import com.bappy.application.notification.dto.NotificationDto;
import com.bappy.application.notification.entity.Notification;
import com.bappy.application.notification.repository.NotificationRepository;
import com.bappy.application.user.entity.User;
import com.bappy.application.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Notification service for managing notifications.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Create and send notification to specific user (1-to-1)
     */
    @Transactional
    public NotificationDto createNotification(CreateNotificationRequest request, User sender) {
        if (request.getIsBroadcast()) {
            throw new IllegalArgumentException("Use createBroadcastNotification for broadcast messages");
        }

        if (request.getRecipientId() == null) {
            throw new IllegalArgumentException("Recipient ID is required for 1-to-1 notification");
        }

        User recipient = userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getRecipientId()));

        Notification notification = Notification.builder()
                .title(request.getTitle())
                .message(request.getMessage())
                .type(request.getType())
                .recipient(recipient)
                .sender(sender)
                .isRead(false)
                .isBroadcast(false)
                .actionUrl(request.getActionUrl())
                .actionLabel(request.getActionLabel())
                .build();

        notification = notificationRepository.save(notification);
        log.info("Notification created: {} for user: {}", notification.getId(), recipient.getId());

        // Send via WebSocket to specific user
        NotificationDto dto = toDto(notification);
        sendToUser(recipient.getId(), dto);

        return dto;
    }

    /**
     * Create and send broadcast notification to all users (1-to-all)
     */
    @Transactional
    public List<NotificationDto> createBroadcastNotification(CreateNotificationRequest request, User sender) {
        if (!request.getIsBroadcast()) {
            throw new IllegalArgumentException("isBroadcast must be true for broadcast notifications");
        }

        // Get all active users
        List<User> allUsers = userRepository.findAll();
        
        List<Notification> notifications = allUsers.stream()
                .map(recipient -> Notification.builder()
                        .title(request.getTitle())
                        .message(request.getMessage())
                        .type(request.getType())
                        .recipient(recipient)
                        .sender(sender)
                        .isRead(false)
                        .isBroadcast(true)
                        .actionUrl(request.getActionUrl())
                        .actionLabel(request.getActionLabel())
                        .build())
                .collect(Collectors.toList());

        notifications = notificationRepository.saveAll(notifications);
        log.info("Broadcast notification created for {} users", notifications.size());

        // Send via WebSocket to all users
        List<NotificationDto> dtos = notifications.stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        // Broadcast to all connected users
        sendBroadcast(dtos.get(0)); // Send one notification to topic

        return dtos;
    }

    /**
     * Get all notifications for a user
     */
    @Transactional(readOnly = true)
    public PageResponse<NotificationDto> getUserNotifications(User user, Pageable pageable) {
        Page<Notification> notifications = notificationRepository.findByRecipientOrderByCreatedAtDesc(user, pageable);
        
        List<NotificationDto> dtos = notifications.getContent().stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return PageResponse.<NotificationDto>builder()
                .content(dtos)
                .pageNumber(notifications.getNumber())
                .pageSize(notifications.getSize())
                .totalElements(notifications.getTotalElements())
                .totalPages(notifications.getTotalPages())
                .last(notifications.isLast())
                .build();
    }

    /**
     * Get unread notifications for a user
     */
    @Transactional(readOnly = true)
    public PageResponse<NotificationDto> getUnreadNotifications(User user, Pageable pageable) {
        Page<Notification> notifications = notificationRepository
                .findByRecipientAndIsReadFalseOrderByCreatedAtDesc(user, pageable);
        
        List<NotificationDto> dtos = notifications.getContent().stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return PageResponse.<NotificationDto>builder()
                .content(dtos)
                .pageNumber(notifications.getNumber())
                .pageSize(notifications.getSize())
                .totalElements(notifications.getTotalElements())
                .totalPages(notifications.getTotalPages())
                .last(notifications.isLast())
                .build();
    }

    /**
     * Get unread notification count
     */
    @Transactional(readOnly = true)
    public long getUnreadCount(User user) {
        return notificationRepository.countByRecipientAndIsReadFalse(user);
    }

    /**
     * Mark notification as read
     */
    @Transactional
    public void markAsRead(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));

        if (!notification.getRecipient().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You can only mark your own notifications as read");
        }

        notification.markAsRead();
        notificationRepository.save(notification);
        log.info("Notification {} marked as read", notificationId);
    }

    /**
     * Mark all notifications as read for a user
     */
    @Transactional
    public void markAllAsRead(User user) {
        notificationRepository.markAllAsReadForUser(user);
        log.info("All notifications marked as read for user: {}", user.getId());
    }

    /**
     * Delete notification
     */
    @Transactional
    public void deleteNotification(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));

        if (!notification.getRecipient().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You can only delete your own notifications");
        }

        notificationRepository.delete(notification);
        log.info("Notification {} deleted", notificationId);
    }

    /**
     * Clean up old read notifications (scheduled task)
     */
    @Transactional
    public void cleanupOldNotifications() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);
        notificationRepository.deleteOldReadNotifications(cutoffDate);
        log.info("Old read notifications cleaned up");
    }

    /**
     * Send notification to specific user via WebSocket
     */
    private void sendToUser(Long userId, NotificationDto notification) {
        try {
            messagingTemplate.convertAndSendToUser(
                    userId.toString(),
                    "/queue/notifications",
                    notification
            );
            log.info("Notification sent via WebSocket to user: {}", userId);
        } catch (Exception e) {
            log.error("Failed to send notification via WebSocket to user: {}", userId, e);
        }
    }

    /**
     * Send broadcast notification via WebSocket
     */
    private void sendBroadcast(NotificationDto notification) {
        try {
            messagingTemplate.convertAndSend("/topic/notifications", notification);
            log.info("Broadcast notification sent via WebSocket");
        } catch (Exception e) {
            log.error("Failed to send broadcast notification via WebSocket", e);
        }
    }

    /**
     * Convert entity to DTO
     */
    private NotificationDto toDto(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .recipientId(notification.getRecipient().getId())
                .recipientName(notification.getRecipient().getFirstName() + " " + notification.getRecipient().getLastName())
                .senderId(notification.getSender() != null ? notification.getSender().getId() : null)
                .senderName(notification.getSender() != null ? 
                        notification.getSender().getFirstName() + " " + notification.getSender().getLastName() : "System")
                .isRead(notification.getIsRead())
                .isBroadcast(notification.getIsBroadcast())
                .actionUrl(notification.getActionUrl())
                .actionLabel(notification.getActionLabel())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
