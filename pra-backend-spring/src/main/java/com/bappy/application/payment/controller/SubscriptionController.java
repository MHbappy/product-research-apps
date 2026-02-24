package com.bappy.application.payment.controller;

import com.bappy.application.payment.dto.CheckoutRequest;
import com.bappy.application.payment.dto.CheckoutResponse;
import com.bappy.application.payment.dto.SubscriptionPlanDto;
import com.bappy.application.payment.entity.UserSubscription;
import com.bappy.application.payment.service.SubscriptionService;
import com.bappy.application.user.entity.User;
import com.bappy.application.user.repository.UserRepository; // Placeholder
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final UserRepository userRepository;

    private final com.bappy.application.payment.service.InvoiceService invoiceService;

    @GetMapping("/config")
    public ResponseEntity<List<String>> getEnabledGateways() {
        return ResponseEntity.ok(subscriptionService.getEnabledGateways());
    }

    // ... existing methods ...

    @GetMapping("/invoices/{transactionId}")
    public ResponseEntity<byte[]> downloadInvoice(
            @PathVariable Long transactionId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        com.bappy.application.payment.entity.PaymentTransaction transaction = 
                subscriptionService.getUserTransaction(user.getId(), transactionId);
        
        byte[] pdfBytes = invoiceService.generateInvoicePdf(transaction);
        
        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice_" + transactionId + ".pdf")
                .header(org.springframework.http.HttpHeaders.CONTENT_TYPE, org.springframework.http.MediaType.APPLICATION_PDF_VALUE)
                .body(pdfBytes);
    }


    @GetMapping("/plans")
    public ResponseEntity<List<SubscriptionPlanDto>> getActivePlans() {
        return ResponseEntity.ok(subscriptionService.getActivePlans());
    }

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> createCheckoutSession(
            @RequestBody CheckoutRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Fetch user by email/username from UserDetails
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return ResponseEntity.ok(subscriptionService.initiateCheckout(user.getId(), request));
    }
    
    @GetMapping("/subscription")
    public ResponseEntity<com.bappy.application.payment.dto.UserSubscriptionDto> getMySubscription(@AuthenticationPrincipal UserDetails userDetails) {
         User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
         
         return subscriptionService.getCurrentSubscriptionDto(user.getId())
                 .map(ResponseEntity::ok)
                 .orElse(ResponseEntity.noContent().build());
    }
    @GetMapping("/transactions")
    public ResponseEntity<List<com.bappy.application.payment.dto.PaymentTransactionDto>> getMyTransactions(@AuthenticationPrincipal UserDetails userDetails) {
         User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
         
         return ResponseEntity.ok(subscriptionService.getUserTransactions(user.getId()));
    }

    @PostMapping("/subscription/cancel")
    public ResponseEntity<Void> cancelMySubscription(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        subscriptionService.cancelSubscription(user.getId());
        return ResponseEntity.ok().build();
    }
}
