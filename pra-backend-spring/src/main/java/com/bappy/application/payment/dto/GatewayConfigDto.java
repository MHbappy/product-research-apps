package com.bappy.application.payment.dto;

import com.bappy.application.payment.entity.GatewayConfig;
import lombok.Data;

import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class GatewayConfigDto {
    private Long id;
    private GatewayConfig.GatewayType gatewayName;
    private String apiKey;
    private String secretKey; // TODO: Mask in response
    private String webhookSecret;
    
    @JsonProperty("isEnabled")
    private boolean isEnabled;
    
    @JsonProperty("isTestMode")
    private boolean isTestMode;
}
