package com.bappy.application.payment.repository;

import com.bappy.application.payment.entity.GatewayConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GatewayConfigRepository extends JpaRepository<GatewayConfig, Long> {
    Optional<GatewayConfig> findByGatewayName(GatewayConfig.GatewayType gatewayName);
    
    boolean existsByGatewayName(GatewayConfig.GatewayType gatewayName);
}
