package com.bappy.application.payment.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payment/webhook")
@RequiredArgsConstructor
@Slf4j
public class WebhookController {
    private final com.bappy.application.payment.service.SubscriptionService subscriptionService;

    @PostMapping("/stripe")
    public ResponseEntity<String> stripeWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            subscriptionService.handleStripeWebhook(payload, sigHeader);
            log.info("Processed Stripe Webhook");
            return ResponseEntity.ok("Received");
        } catch (Exception e) {
            log.error("Stripe Webhook processing failed", e);
            return ResponseEntity.badRequest().body("Webhook Error: " + e.getMessage());
        }
    }
    
    @PostMapping("/paypal")
    public ResponseEntity<String> paypalWebhook(@RequestBody String payload) {
        log.info("Received PayPal Webhook");
        // Implement PayPal webhook handling
        return ResponseEntity.ok("Received");
    }
}
