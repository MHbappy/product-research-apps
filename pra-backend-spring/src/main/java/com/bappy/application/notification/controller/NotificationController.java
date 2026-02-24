package com.bappy.application.notification.controller;

import com.bappy.application.common.dto.ApiResponse;
import com.bappy.application.common.dto.PageResponse;
import com.bappy.application.notification.dto.CreateNotificationRequest;
import com.bappy.application.notification.dto.NotificationDto;
import com.bappy.application.notification.service.NotificationService;
import com.bappy.application.security.UserPrincipal;
import com.bappy.application.user.entity.User;
import com.bappy.application.user.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Notification REST controller.
 */
@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Notifications", description = "Real-time notification endpoints")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    /**
     * Send notification to specific user (1-to-1)
     */
    @PostMapping("/send")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Send notification to user", description = "Send a notification to a specific user")
    public ResponseEntity<ApiResponse<NotificationDto>> sendNotification(
            @Valid @RequestBody CreateNotificationRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        log.info("Send notification request from user: {}", currentUser.getId());
        
        User sender = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        NotificationDto notification = notificationService.createNotification(request, sender);
        
        return ResponseEntity.ok(ApiResponse.success("Notification sent successfully", notification));
    }

    /**
     * Send broadcast notification to all users (1-to-all)
     */
    @PostMapping("/broadcast")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Broadcast notification", description = "Send notification to all users (Admin only)")
    public ResponseEntity<ApiResponse<List<NotificationDto>>> broadcastNotification(
            @Valid @RequestBody CreateNotificationRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        log.info("Broadcast notification request from admin: {}", currentUser.getId());
        
        User sender = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        request.setIsBroadcast(true);
        List<NotificationDto> notifications = notificationService.createBroadcastNotification(request, sender);
        
        return ResponseEntity.ok(ApiResponse.success(
                "Broadcast notification sent to " + notifications.size() + " users", 
                notifications));
    }

    /**
     * Get all notifications for current user
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get notifications", description = "Get all notifications for current user")
    public ResponseEntity<ApiResponse<PageResponse<NotificationDto>>> getNotifications(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Pageable pageable = PageRequest.of(page, size);
        PageResponse<NotificationDto> notifications = notificationService.getUserNotifications(user, pageable);
        
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved successfully", notifications));
    }

    /**
     * Get unread notifications
     */
    @GetMapping("/unread")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get unread notifications", description = "Get unread notifications for current user")
    public ResponseEntity<ApiResponse<PageResponse<NotificationDto>>> getUnreadNotifications(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Pageable pageable = PageRequest.of(page, size);
        PageResponse<NotificationDto> notifications = notificationService.getUnreadNotifications(user, pageable);
        
        return ResponseEntity.ok(ApiResponse.success("Unread notifications retrieved successfully", notifications));
    }

    /**
     * Get unread notification count
     */
    @GetMapping("/unread/count")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get unread count", description = "Get count of unread notifications")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@AuthenticationPrincipal UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        long count = notificationService.getUnreadCount(user);
        
        return ResponseEntity.ok(ApiResponse.success("Unread count retrieved successfully", count));
    }

    /**
     * Mark notification as read
     */
    @PutMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Mark as read", description = "Mark a notification as read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        notificationService.markAsRead(id, user);
        
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read"));
    }

    /**
     * Mark all notifications as read
     */
    @PutMapping("/read-all")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Mark all as read", description = "Mark all notifications as read")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@AuthenticationPrincipal UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        notificationService.markAllAsRead(user);
        
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read"));
    }

    /**
     * Delete notification
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete notification", description = "Delete a notification")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        notificationService.deleteNotification(id, user);
        
        return ResponseEntity.ok(ApiResponse.success("Notification deleted successfully"));
    }
}
