package com.bappy.application.payment.service;

import com.bappy.application.payment.dto.CheckoutResponse;
import com.bappy.application.payment.entity.GatewayConfig;
import com.bappy.application.payment.entity.SubscriptionPlan;
import com.bappy.application.user.entity.User;

public interface PaymentGatewayService {
    
    GatewayConfig.GatewayType getGatewayType();
    
    CheckoutResponse createCheckoutSession(User user, SubscriptionPlan plan, String successUrl, String cancelUrl);
    
    void cancelSubscription(String subscriptionId);
    
    // Add other common methods as needed
}
