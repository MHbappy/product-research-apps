package com.bappy.application.payment.repository;

import com.bappy.application.payment.entity.UserSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {
    Optional<UserSubscription> findByUserIdAndStatus(Long userId, UserSubscription.SubscriptionStatus status);
    
    Optional<UserSubscription> findByStripeSubscriptionId(String stripeSubscriptionId);
    
    Optional<UserSubscription> findByPaypalSubscriptionId(String paypalSubscriptionId);
    
    @Query("SELECT us FROM UserSubscription us WHERE us.user.id = :userId AND us.status IN ('ACTIVE', 'TRIALING', 'PAST_DUE')")
    List<UserSubscription> findActiveSubscriptionByUserId(Long userId);
    
    long countByStatus(UserSubscription.SubscriptionStatus status);

    org.springframework.data.domain.Page<UserSubscription> findByStatusIn(List<UserSubscription.SubscriptionStatus> statuses, org.springframework.data.domain.Pageable pageable);
}
