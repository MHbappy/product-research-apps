package com.bappy.application.notification.dto;

import com.bappy.application.notification.entity.NotificationType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Notification DTO for API responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {

    private Long id;
    private String title;
    private String message;
    private NotificationType type;
    private Long recipientId;
    private String recipientName;
    private Long senderId;
    private String senderName;
    private Boolean isRead;
    private Boolean isBroadcast;
    private String actionUrl;
    private String actionLabel;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
}
