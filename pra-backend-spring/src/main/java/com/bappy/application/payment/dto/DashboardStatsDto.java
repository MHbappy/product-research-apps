package com.bappy.application.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private BigDecimal totalRevenue;
    private BigDecimal todaysRevenue;
    private long activeSubscriptions;
    private long totalUsers;
    
    // Future expansion
    private BigDecimal monthlyRecurringRevenue;
    private long failedPayments;
    private long churnedSubscriptions;
    private long activeTrials;
}
