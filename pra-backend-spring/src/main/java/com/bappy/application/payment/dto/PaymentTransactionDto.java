package com.bappy.application.payment.dto;

import com.bappy.application.payment.entity.GatewayConfig;
import com.bappy.application.payment.entity.PaymentTransaction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentTransactionDto {
    private Long id;
    private Long userId;
    private String userEmail; // Helpful for admin to identify user
    private BigDecimal amount;
    private String currency;
    private GatewayConfig.GatewayType gateway;
    private String transactionId;
    private PaymentTransaction.TransactionStatus status;
    private PaymentTransaction.TransactionType type;
    private String description;
    private String failureReason;
    private LocalDateTime createdAt;
}
