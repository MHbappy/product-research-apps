package com.bappy.application.notification.entity;

import com.bappy.application.common.entity.BaseEntity;
import com.bappy.application.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

/**
 * Notification entity for storing notifications.
 */
@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private NotificationType type = NotificationType.INFO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private User sender;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isRead = false;

    @Column(name = "is_broadcast")
    @Builder.Default
    private Boolean isBroadcast = false;

    @Column(length = 500)
    private String actionUrl;

    @Column(length = 100)
    private String actionLabel;

    /**
     * Mark notification as read
     */
    public void markAsRead() {
        this.isRead = true;
    }

    /**
     * Mark notification as unread
     */
    public void markAsUnread() {
        this.isRead = false;
    }
}
