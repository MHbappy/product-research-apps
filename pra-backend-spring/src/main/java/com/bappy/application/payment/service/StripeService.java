package com.bappy.application.payment.service;

import com.bappy.application.payment.dto.CheckoutResponse;
import com.bappy.application.payment.entity.GatewayConfig;
import com.bappy.application.payment.entity.SubscriptionPlan;
import com.bappy.application.payment.repository.GatewayConfigRepository;
import com.bappy.application.user.entity.User;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class StripeService implements PaymentGatewayService {

    private final GatewayConfigRepository gatewayConfigRepository;

    private void initStripe() {
        Optional<GatewayConfig> config = gatewayConfigRepository.findByGatewayName(GatewayConfig.GatewayType.STRIPE);
        if (config.isPresent() && config.get().isEnabled()) {
            Stripe.apiKey = config.get().getSecretKey();
        } else {
            // throw new RuntimeException("Stripe is not configured or enabled");
            log.warn("Stripe is not configured or enabled");
        }
    }

    @Override
    public GatewayConfig.GatewayType getGatewayType() {
        return GatewayConfig.GatewayType.STRIPE;
    }

    @Override
    public CheckoutResponse createCheckoutSession(User user, SubscriptionPlan plan, String successUrl, String cancelUrl) {
        initStripe();
        
        try {
            // Ensure we have a price ID. If not, we might need to create it dynamically or rely on it being present
            // For this MVP, assuming stripePriceId is present in plan or we create on the fly.
            // Simplified: Creating a price data object inline for simplicity if priceId missing, 
            // but ideally we use priceId.
            
            SessionCreateParams.LineItem.PriceData.ProductData productData = SessionCreateParams.LineItem.PriceData.ProductData.builder()
                    .setName(plan.getName())
                    .setDescription(plan.getDescription())
                    .build();

            SessionCreateParams.LineItem.PriceData priceData = SessionCreateParams.LineItem.PriceData.builder()
                    .setCurrency(plan.getCurrency().toLowerCase())
                    .setUnitAmount(plan.getPrice().multiply(new BigDecimal(100)).longValue()) // Generic handling
                    .setProductData(productData)
                    .setRecurring(SessionCreateParams.LineItem.PriceData.Recurring.builder()
                            .setInterval(mapBillingCycleToStripeInterval(plan.getInterval()))
                            .build())
                    .build();

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                    .setSuccessUrl(successUrl + "?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl(cancelUrl)
                    .setCustomerEmail(user.getEmail())
                    .addLineItem(SessionCreateParams.LineItem.builder()
                            .setQuantity(1L)
                            .setPriceData(priceData)
                            .build())
                    .putMetadata("userId", user.getId().toString())
                    .putMetadata("planId", plan.getId().toString())
                    .build();

            Session session = Session.create(params);
            
            return CheckoutResponse.builder()
                    .sessionId(session.getId())
                    .url(session.getUrl())
                    .build();
            
        } catch (StripeException e) {
            log.error("Error creating Stripe session", e);
            throw new RuntimeException("Failed to create checkout session", e);
        }
    }

    @Override
    public void cancelSubscription(String subscriptionId) {
        initStripe();
        try {
            com.stripe.model.Subscription subscription = com.stripe.model.Subscription.retrieve(subscriptionId);
            subscription.cancel();
        } catch (StripeException e) {
             throw new RuntimeException("Failed to cancel subscription", e);
        }
    }
    private SessionCreateParams.LineItem.PriceData.Recurring.Interval mapBillingCycleToStripeInterval(SubscriptionPlan.BillingCycle billingCycle) {
        switch (billingCycle) {
            case MONTHLY:
                return SessionCreateParams.LineItem.PriceData.Recurring.Interval.MONTH;
            case YEARLY:
                return SessionCreateParams.LineItem.PriceData.Recurring.Interval.YEAR;
            default:
                throw new IllegalArgumentException("Unsupported billing cycle for Stripe: " + billingCycle);
        }
    }
}
