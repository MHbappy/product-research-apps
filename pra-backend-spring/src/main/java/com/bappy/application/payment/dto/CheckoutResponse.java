package com.bappy.application.payment.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CheckoutResponse {
    private String sessionId;
    private String url;
}
