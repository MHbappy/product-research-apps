package com.bappy.application.payment.repository;

import com.bappy.application.payment.entity.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, Long> {
    Optional<SubscriptionPlan> findByCode(String code);
    
    List<SubscriptionPlan> findByIsActiveTrue();
    
    boolean existsByCode(String code);
}
