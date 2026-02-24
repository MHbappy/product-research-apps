package com.bappy.application.payment.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
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
@Table(name = "payment_gateway_config")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class GatewayConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false, unique = true)
    @Enumerated(EnumType.STRING)
    private GatewayType gatewayName; // STRIPE, PAYPAL

    private String apiKey; // Public Key / Client ID

    private String secretKey; // Secret Key / Client Secret
    
    private String webhookSecret;

    @JsonProperty("isEnabled")
    private boolean isEnabled;

    @JsonProperty("isTestMode")
    private boolean isTestMode;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum GatewayType {
        STRIPE,
        PAYPAL
    }
}
