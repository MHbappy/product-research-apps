package com.bappy.application.payment.entity;

import com.bappy.application.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_subscriptions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class UserSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private SubscriptionPlan plan;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionStatus status; // ACTIVE, CANCELED, PAST_DUE, TRIALING

    private LocalDateTime currentPeriodStart;

    private LocalDateTime currentPeriodEnd;

    // Gateway specific subscription IDs
    private String stripeSubscriptionId;
    private String stripeCustomerId;
    private String paypalSubscriptionId;

    private boolean autoRenew;
    
    // Gateway used for this subscription
    @Enumerated(EnumType.STRING)
    private GatewayConfig.GatewayType gatewayType;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    private LocalDateTime canceledAt;

    public enum SubscriptionStatus {
        ACTIVE,
        CANCELED,
        PAST_DUE,
        TRIALING,
        INCOMPLETE,
        INCOMPLETE_EXPIRED,
        UNPAID,
        PAUSED
    }
}
