package com.bappy.application.payment.controller;


import com.bappy.application.payment.dto.GatewayConfigDto;
import com.bappy.application.payment.dto.SubscriptionPlanDto;
import com.bappy.application.payment.entity.GatewayConfig;
import com.bappy.application.payment.entity.SubscriptionPlan;
import com.bappy.application.payment.repository.GatewayConfigRepository;
import com.bappy.application.payment.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/payment")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class PaymentAdminController {

    private final GatewayConfigRepository gatewayConfigRepository;
    private final SubscriptionService subscriptionService;

    private final com.bappy.application.payment.service.InvoiceService invoiceService;

    @GetMapping("/gateways")
    public ResponseEntity<List<GatewayConfig>> getAllGateways() {
        return ResponseEntity.ok(gatewayConfigRepository.findAll());
    }

    // ... existing ...

    @GetMapping("/invoices/{transactionId}")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long transactionId) {
        com.bappy.application.payment.entity.PaymentTransaction transaction = 
                subscriptionService.getTransaction(transactionId);
        
        byte[] pdfBytes = invoiceService.generateInvoicePdf(transaction);
        
        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice_" + transactionId + ".pdf")
                .header(org.springframework.http.HttpHeaders.CONTENT_TYPE, org.springframework.http.MediaType.APPLICATION_PDF_VALUE)
                .body(pdfBytes);
    }


    @PostMapping("/gateways")
    public ResponseEntity<GatewayConfig> updateGateway(@RequestBody GatewayConfigDto dto) {
        // Simple update logic for MVP
        GatewayConfig config = gatewayConfigRepository.findByGatewayName(dto.getGatewayName())
                .orElse(GatewayConfig.builder().gatewayName(dto.getGatewayName()).build());

        config.setApiKey(dto.getApiKey());
        if (dto.getSecretKey() != null && !dto.getSecretKey().isEmpty()) {
            config.setSecretKey(dto.getSecretKey());
        }
        config.setEnabled(dto.isEnabled());
        config.setTestMode(dto.isTestMode());
        config.setWebhookSecret(dto.getWebhookSecret());

        return ResponseEntity.ok(gatewayConfigRepository.save(config));
    }


    @GetMapping("/plans")
    public ResponseEntity<List<SubscriptionPlanDto>> getAllPlans() {
        return ResponseEntity.ok(subscriptionService.getAllPlans());
    }


    @PostMapping("/plans")
    public ResponseEntity<SubscriptionPlanDto> createAvailablePlan(@RequestBody SubscriptionPlan plan) {
        return ResponseEntity.ok(subscriptionService.createPlan(plan));
    }

    @PutMapping("/plans/{id}")
    public ResponseEntity<SubscriptionPlanDto> updatePlan(@PathVariable Long id, @RequestBody SubscriptionPlan plan) {
        return ResponseEntity.ok(subscriptionService.updatePlan(id, plan));
    }
    @GetMapping("/transactions")
    public ResponseEntity<List<com.bappy.application.payment.dto.PaymentTransactionDto>> getAllTransactions() {
        return ResponseEntity.ok(subscriptionService.getAllTransactions());
    }

    @GetMapping("/transactions/user/{userId}")
    public ResponseEntity<List<com.bappy.application.payment.dto.PaymentTransactionDto>> getUserTransactions(@PathVariable Long userId) {
        return ResponseEntity.ok(subscriptionService.getUserTransactions(userId));
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<com.bappy.application.payment.dto.DashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(subscriptionService.getDashboardStats());
    }

    @GetMapping("/dashboard/chart/revenue/daily")
    public ResponseEntity<List<com.bappy.application.payment.dto.ChartDataDto>> getDailyRevenue() {
        return ResponseEntity.ok(subscriptionService.getDailyRevenue());
    }

    @GetMapping("/dashboard/chart/revenue/monthly")
    public ResponseEntity<List<com.bappy.application.payment.dto.ChartDataDto>> getMonthlyRevenue() {
        return ResponseEntity.ok(subscriptionService.getMonthlyRevenue());
    }

    @GetMapping("/dashboard/transactions/recent")
    public ResponseEntity<List<com.bappy.application.payment.dto.PaymentTransactionDto>> getRecentTransactions() {
        return ResponseEntity.ok(subscriptionService.getRecentTransactions());
    }

    @GetMapping("/dashboard/subscribers/active")
    public ResponseEntity<org.springframework.data.domain.Page<com.bappy.application.payment.dto.ActiveSubscriberDto>> getActiveSubscribers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(subscriptionService.getActiveSubscribers(org.springframework.data.domain.PageRequest.of(page, size)));
    }

    @PostMapping("/subscription/cancel/{userId}")
    public ResponseEntity<Void> cancelUserSubscription(@PathVariable Long userId) {
        subscriptionService.cancelSubscription(userId);
        return ResponseEntity.ok().build();
    }
}
