package com.bappy.application.payment.service;

import com.bappy.application.payment.dto.CheckoutRequest;
import com.bappy.application.payment.dto.CheckoutResponse;
import com.bappy.application.payment.dto.SubscriptionPlanDto;
import com.bappy.application.payment.dto.UserSubscriptionDto;
import com.bappy.application.payment.entity.GatewayConfig;
import com.bappy.application.payment.entity.PaymentTransaction;
import com.bappy.application.payment.entity.SubscriptionPlan;
import com.bappy.application.payment.entity.UserSubscription;
import com.bappy.application.payment.repository.GatewayConfigRepository;
import com.bappy.application.payment.repository.PaymentTransactionRepository;
import com.bappy.application.payment.repository.SubscriptionPlanRepository;
import com.bappy.application.payment.repository.UserSubscriptionRepository;
import com.bappy.application.user.entity.User;
import com.bappy.application.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionService {

    private final SubscriptionPlanRepository planRepository;
    private final UserSubscriptionRepository subscriptionRepository;
    private final PaymentTransactionRepository transactionRepository;
    private final GatewayConfigRepository gatewayConfigRepository;
    private final List<PaymentGatewayService> gatewayServices;
    private final UserRepository userRepository; 

    @Transactional(readOnly = true)
    public List<SubscriptionPlanDto> getActivePlans() {
        return planRepository.findByIsActiveTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    

    @Transactional(readOnly = true)
    public List<SubscriptionPlanDto> getAllPlans() {
        return planRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    

    @Transactional
    public SubscriptionPlanDto createPlan(SubscriptionPlan plan) {
        return mapToDto(planRepository.save(plan));
    }

    @Transactional
    public SubscriptionPlanDto updatePlan(Long id, SubscriptionPlan planDetails) {
        SubscriptionPlan plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found with id: " + id));

        plan.setName(planDetails.getName());
        plan.setPrice(planDetails.getPrice());
        plan.setCurrency(planDetails.getCurrency());
        plan.setInterval(planDetails.getInterval());
        plan.setDescription(planDetails.getDescription());
        plan.setFeatures(planDetails.getFeatures());
        plan.setActive(planDetails.isActive());
        
        return mapToDto(planRepository.save(plan));
    }

    @Transactional
    public CheckoutResponse initiateCheckout(Long userId, CheckoutRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SubscriptionPlan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new RuntimeException("Plan not found"));
        
        GatewayConfig.GatewayType gatewayType = GatewayConfig.GatewayType.STRIPE;
        if (request.getGateway() != null) {
            try {
                gatewayType = GatewayConfig.GatewayType.valueOf(request.getGateway().toUpperCase());
            } catch (IllegalArgumentException e) {
                // Keep default
            }
        }

        PaymentGatewayService gateway = getGatewayService(gatewayType);
        
        return gateway.createCheckoutSession(user, plan, request.getSuccessUrl(), request.getCancelUrl());
    }
    
    public Optional<UserSubscription> getCurrentSubscription(Long userId) {
        return subscriptionRepository.findActiveSubscriptionByUserId(userId).stream().findFirst();
    }

    @Transactional(readOnly = true)
    public Optional<UserSubscriptionDto> getCurrentSubscriptionDto(Long userId) {
        return subscriptionRepository.findActiveSubscriptionByUserId(userId).stream()
                .findFirst()
                .map(this::mapToUserSubscriptionDto);
    }

    private UserSubscriptionDto mapToUserSubscriptionDto(UserSubscription sub) {
        return UserSubscriptionDto.builder()
                .id(sub.getId())
                .userId(sub.getUser().getId())
                .plan(mapToDto(sub.getPlan()))
                .status(sub.getStatus())
                .currentPeriodStart(sub.getCurrentPeriodStart())
                .currentPeriodEnd(sub.getCurrentPeriodEnd())
                .autoRenew(sub.isAutoRenew())
                .createdAt(sub.getCreatedAt())
                .updatedAt(sub.getUpdatedAt())
                .canceledAt(sub.getCanceledAt())
                .build();
    }

    private PaymentGatewayService getGatewayService(GatewayConfig.GatewayType type) {
        return gatewayServices.stream()
                .filter(s -> s.getGatewayType() == type)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Gateway implementation not found for: " + type));
    }

    private SubscriptionPlanDto mapToDto(SubscriptionPlan plan) {
        SubscriptionPlanDto dto = new SubscriptionPlanDto();
        dto.setId(plan.getId());
        dto.setName(plan.getName());
        dto.setCode(plan.getCode());
        dto.setPrice(plan.getPrice());
        dto.setCurrency(plan.getCurrency());
        dto.setInterval(plan.getInterval());
        dto.setDescription(plan.getDescription());
        if (plan.getFeatures() != null) {
            dto.setFeatures(new java.util.ArrayList<>(plan.getFeatures()));
        } else {
            dto.setFeatures(new java.util.ArrayList<>());
        }
        dto.setActive(plan.isActive());
        return dto;
    }

    public List<String> getEnabledGateways() {
        return gatewayConfigRepository.findAll().stream()
                .filter(GatewayConfig::isEnabled)
                .map(g -> g.getGatewayName().name())
                .collect(Collectors.toList());
    }

    public void handleStripeWebhook(String payload, String sigHeader) {
        String endpointSecret = gatewayConfigRepository.findByGatewayName(GatewayConfig.GatewayType.STRIPE)
                .map(GatewayConfig::getWebhookSecret)
                .orElseThrow(() -> new RuntimeException("Stripe webhook secret not configured"));

        try {
            com.stripe.model.Event event = com.stripe.net.Webhook.constructEvent(
                    payload, sigHeader, endpointSecret
            );

            log.info("Received Stripe Webhook Event: {}", event.getType());

            if ("checkout.session.completed".equals(event.getType())) {
                com.stripe.model.EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
                com.stripe.model.StripeObject stripeObject = null;
                
                if (dataObjectDeserializer.getObject().isPresent()) {
                    stripeObject = dataObjectDeserializer.getObject().get();
                } else {
                    stripeObject = dataObjectDeserializer.deserializeUnsafe();
                }
                
                com.stripe.model.checkout.Session session = (com.stripe.model.checkout.Session) stripeObject;
                
                if (session != null) {
                    handleCheckoutSessionCompleted(session);
                } else {
                    log.error("Failed to deserialize session object from event");
                }
            }
        } catch (Exception e) {
            log.error("Webhook processing failed", e);
            throw new RuntimeException("Webhook processing failed: " + e.getMessage(), e);
        }
    }

    private void handleCheckoutSessionCompleted(com.stripe.model.checkout.Session session) {
        String userId = session.getMetadata().get("userId");
        String planId = session.getMetadata().get("planId");
        
        log.info("Processing checkout completion for user: {} and plan: {}", userId, planId);

        if (userId != null && planId != null) {
            User user = userRepository.findById(Long.parseLong(userId)).orElseThrow();
            SubscriptionPlan plan = planRepository.findById(Long.parseLong(planId)).orElseThrow();
            
            // 0. Cancel any existing active subscription
            subscriptionRepository.findActiveSubscriptionByUserId(user.getId())
                    .forEach(existingSub -> {
                        existingSub.setStatus(UserSubscription.SubscriptionStatus.CANCELED);
                        existingSub.setCanceledAt(LocalDateTime.now());
                        existingSub.setAutoRenew(false); // Disable auto-renew
                        subscriptionRepository.save(existingSub);
                        log.info("Canceled previous subscription id: {} for user: {}", existingSub.getId(), user.getId());
                    });
            
            // 1. Create Subscription
            UserSubscription subscription = new UserSubscription();
            subscription.setUser(user);
            subscription.setPlan(plan);
            subscription.setStatus(UserSubscription.SubscriptionStatus.ACTIVE);
            subscription.setCurrentPeriodStart(LocalDateTime.now());
            
            if (plan.getInterval() == SubscriptionPlan.BillingCycle.MONTHLY) {
                 subscription.setCurrentPeriodEnd(LocalDateTime.now().plusMonths(1));
            } else if (plan.getInterval() == SubscriptionPlan.BillingCycle.YEARLY) {
                 subscription.setCurrentPeriodEnd(LocalDateTime.now().plusYears(1));
            }
            subscription.setAutoRenew(true);
            
            subscription.setStripeSubscriptionId(session.getSubscription());
            subscription.setStripeCustomerId(session.getCustomer());
            subscription.setGatewayType(GatewayConfig.GatewayType.STRIPE);
            
            subscriptionRepository.save(subscription);
            log.info("Subscription created for user: {}", userId);
            
            // 2. Create Payment Transaction
            PaymentTransaction transaction = new PaymentTransaction();
            transaction.setUser(user);
            transaction.setAmount(new BigDecimal(session.getAmountTotal()).divide(new BigDecimal(100)));
            transaction.setCurrency(session.getCurrency().toUpperCase());
            transaction.setGateway(GatewayConfig.GatewayType.STRIPE);
            transaction.setTransactionId(session.getPaymentIntent()); // OR setup_intent, usually payment_intent for one-time or subscription
            transaction.setStatus(PaymentTransaction.TransactionStatus.SUCCESS);
            transaction.setType(PaymentTransaction.TransactionType.SUBSCRIPTION_CHARGE);
            transaction.setDescription("Subscription payment for " + plan.getName());
            transaction.setCreatedAt(LocalDateTime.now());
            
            if (transaction.getTransactionId() == null) {
                 // Fallback if payment intent is null (e.g. strict setup mode), try invoice or subscription
                 transaction.setTransactionId(session.getId());
            }

            transactionRepository.save(transaction);
            log.info("Payment Transaction saved for user: {}", userId);
        } else {
            log.error("Missing metadata in Stripe Session. userId: {}, planId: {}", userId, planId);
        }
    }

    @Transactional(readOnly = true)
    public List<com.bappy.application.payment.dto.PaymentTransactionDto> getUserTransactions(Long userId) {
        return transactionRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToTransactionDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<com.bappy.application.payment.dto.PaymentTransactionDto> getAllTransactions() {
        return transactionRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt")).stream()
                .map(this::mapToTransactionDto)
                .collect(Collectors.toList());
    }

    private com.bappy.application.payment.dto.PaymentTransactionDto mapToTransactionDto(PaymentTransaction tx) {
        return com.bappy.application.payment.dto.PaymentTransactionDto.builder()
                .id(tx.getId())
                .userId(tx.getUser().getId())
                .userEmail(tx.getUser().getEmail())
                .amount(tx.getAmount())
                .currency(tx.getCurrency())
                .gateway(tx.getGateway())
                .transactionId(tx.getTransactionId())
                .status(tx.getStatus())
                .type(tx.getType())
                .description(tx.getDescription())
                .failureReason(tx.getFailureReason())
                .createdAt(tx.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public com.bappy.application.payment.dto.DashboardStatsDto getDashboardStats() {
        java.math.BigDecimal totalRevenue = transactionRepository.sumAmountByStatus(PaymentTransaction.TransactionStatus.SUCCESS);
        if (totalRevenue == null) totalRevenue = java.math.BigDecimal.ZERO;

        java.time.LocalDateTime startOfDay = java.time.LocalDate.now().atStartOfDay();
        java.time.LocalDateTime endOfDay = java.time.LocalDate.now().atTime(java.time.LocalTime.MAX);
        
        java.math.BigDecimal todaysRevenue = transactionRepository.sumAmountByStatusAndDateRange(
                PaymentTransaction.TransactionStatus.SUCCESS, startOfDay, endOfDay
        );
        if (todaysRevenue == null) todaysRevenue = java.math.BigDecimal.ZERO;

        long activeSubscriptions = subscriptionRepository.countByStatus(com.bappy.application.payment.entity.UserSubscription.SubscriptionStatus.ACTIVE);
        long totalUsers = userRepository.count();

        return com.bappy.application.payment.dto.DashboardStatsDto.builder()
                .totalRevenue(totalRevenue)
                .todaysRevenue(todaysRevenue)
                .activeSubscriptions(activeSubscriptions)
                .totalUsers(totalUsers)
                .build();
    }

    @Transactional(readOnly = true)
    public List<com.bappy.application.payment.dto.ChartDataDto> getDailyRevenue() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<PaymentTransaction> transactions = transactionRepository.findByStatusAndCreatedAtAfter(
                PaymentTransaction.TransactionStatus.SUCCESS, thirtyDaysAgo
        );

        java.util.Map<String, BigDecimal> revenueMap = transactions.stream()
                .collect(Collectors.groupingBy(
                        tx -> tx.getCreatedAt().format(java.time.format.DateTimeFormatter.ofPattern("MMM dd")),
                        Collectors.reducing(BigDecimal.ZERO, PaymentTransaction::getAmount, BigDecimal::add)
                ));

        // Ensure all last 30 days are present
        List<com.bappy.application.payment.dto.ChartDataDto> chartData = new java.util.ArrayList<>();
        for (int i = 29; i >= 0; i--) {
            String dateLabel = LocalDateTime.now().minusDays(i).format(java.time.format.DateTimeFormatter.ofPattern("MMM dd"));
            chartData.add(new com.bappy.application.payment.dto.ChartDataDto(
                    dateLabel,
                    revenueMap.getOrDefault(dateLabel, BigDecimal.ZERO)
            ));
        }
        return chartData;
    }

    @Transactional(readOnly = true)
    public List<com.bappy.application.payment.dto.ChartDataDto> getMonthlyRevenue() {
        LocalDateTime twelveMonthsAgo = LocalDateTime.now().minusMonths(11).withDayOfMonth(1);
        List<PaymentTransaction> transactions = transactionRepository.findByStatusAndCreatedAtAfter(
                PaymentTransaction.TransactionStatus.SUCCESS, twelveMonthsAgo
        );

        java.util.Map<String, BigDecimal> revenueMap = transactions.stream()
                .collect(Collectors.groupingBy(
                        tx -> tx.getCreatedAt().format(java.time.format.DateTimeFormatter.ofPattern("MMM")),
                        Collectors.reducing(BigDecimal.ZERO, PaymentTransaction::getAmount, BigDecimal::add)
                ));

        List<com.bappy.application.payment.dto.ChartDataDto> chartData = new java.util.ArrayList<>();
        for (int i = 11; i >= 0; i--) {
            String monthLabel = LocalDateTime.now().minusMonths(i).format(java.time.format.DateTimeFormatter.ofPattern("MMM"));
            chartData.add(new com.bappy.application.payment.dto.ChartDataDto(
                    monthLabel,
                    revenueMap.getOrDefault(monthLabel, BigDecimal.ZERO)
            ));
        }
        return chartData;
    }

    @Transactional(readOnly = true)
    public List<com.bappy.application.payment.dto.PaymentTransactionDto> getRecentTransactions() {
        return transactionRepository.findAll(
                org.springframework.data.domain.PageRequest.of(0, 5, org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt"))
        ).getContent().stream().map(this::mapToTransactionDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<com.bappy.application.payment.dto.ActiveSubscriberDto> getActiveSubscribers(org.springframework.data.domain.Pageable pageable) {
        org.springframework.data.domain.Page<UserSubscription> subscriptions = subscriptionRepository.findByStatusIn(
                java.util.Arrays.asList(
                        UserSubscription.SubscriptionStatus.ACTIVE,
                        UserSubscription.SubscriptionStatus.TRIALING
                ),
                pageable
        );

        return subscriptions.map(sub -> com.bappy.application.payment.dto.ActiveSubscriberDto.builder()
                .userId(sub.getUser().getId())
                .email(sub.getUser().getEmail())
                .firstName(sub.getUser().getFirstName())
                .lastName(sub.getUser().getLastName())
                .planName(sub.getPlan() != null ? sub.getPlan().getName() : "Unknown")
                .status(sub.getStatus().name())
                .currentPeriodEnd(sub.getCurrentPeriodEnd())
                .build()
        );
    }

    @Transactional
    public void cancelSubscription(Long userId) {
        UserSubscription subscription = subscriptionRepository.findActiveSubscriptionByUserId(userId).stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No active subscription found for user: " + userId));

        if (subscription.getGatewayType() == GatewayConfig.GatewayType.STRIPE && subscription.getStripeSubscriptionId() != null) {
            getGatewayService(GatewayConfig.GatewayType.STRIPE).cancelSubscription(subscription.getStripeSubscriptionId());
        }
        
        subscription.setStatus(UserSubscription.SubscriptionStatus.CANCELED);
        subscription.setCanceledAt(LocalDateTime.now());
        subscription.setAutoRenew(false);
        subscriptionRepository.save(subscription);
        
        log.info("Subscription canceled for user: {}", userId);
    }
    @Transactional(readOnly = true)
    public PaymentTransaction getTransaction(Long transactionId) {
        PaymentTransaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        org.hibernate.Hibernate.initialize(transaction.getUser());
        return transaction;
    }

    @Transactional(readOnly = true)
    public PaymentTransaction getUserTransaction(Long userId, Long transactionId) {
        PaymentTransaction transaction = getTransaction(transactionId);
        if (!transaction.getUser().getId().equals(userId)) {
            throw new RuntimeException("Transaction does not belong to user");
        }
        return transaction;
    }
}
