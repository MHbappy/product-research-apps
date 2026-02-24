package com.bappy.application.notification.repository;

import com.bappy.application.notification.entity.Notification;
import com.bappy.application.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Notification repository.
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    /**
     * Find all notifications for a user
     */
    Page<Notification> findByRecipientOrderByCreatedAtDesc(User recipient, Pageable pageable);

    /**
     * Find unread notifications for a user
     */
    Page<Notification> findByRecipientAndIsReadFalseOrderByCreatedAtDesc(User recipient, Pageable pageable);

    /**
     * Find all unread notifications for a user (for count)
     */
    List<Notification> findByRecipientAndIsReadFalse(User recipient);

    /**
     * Count unread notifications for a user
     */
    long countByRecipientAndIsReadFalse(User recipient);

    /**
     * Mark all notifications as read for a user
     */
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.recipient = :recipient AND n.isRead = false")
    void markAllAsReadForUser(@Param("recipient") User recipient);

    /**
     * Delete old read notifications
     */
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.isRead = true AND n.createdAt < :date")
    void deleteOldReadNotifications(@Param("date") LocalDateTime date);

    /**
     * Find recent notifications for a user
     */
    List<Notification> findTop10ByRecipientOrderByCreatedAtDesc(User recipient);
}
