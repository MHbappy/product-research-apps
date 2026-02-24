package com.bappy.application.payment.dto;

import com.bappy.application.payment.entity.SubscriptionPlan;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class SubscriptionPlanDto {
    private Long id;
    private String name;
    private String code;
    private BigDecimal price;
    private String currency;
    private SubscriptionPlan.BillingCycle interval;
    private String description;
    private List<String> features;
    private boolean isActive;
}
