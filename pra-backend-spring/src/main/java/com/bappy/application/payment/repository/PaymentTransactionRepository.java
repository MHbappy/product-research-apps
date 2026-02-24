package com.bappy.application.payment.repository;

import com.bappy.application.payment.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    List<PaymentTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    Optional<PaymentTransaction> findByTransactionId(String transactionId);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(pt.amount) FROM PaymentTransaction pt WHERE pt.status = :status")
    java.math.BigDecimal sumAmountByStatus(@org.springframework.data.repository.query.Param("status") PaymentTransaction.TransactionStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(pt.amount) FROM PaymentTransaction pt WHERE pt.status = :status AND pt.createdAt BETWEEN :startDate AND :endDate")
    java.math.BigDecimal sumAmountByStatusAndDateRange(
        @org.springframework.data.repository.query.Param("status") PaymentTransaction.TransactionStatus status,
        @org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate,
        @org.springframework.data.repository.query.Param("endDate") java.time.LocalDateTime endDate
    );

    List<PaymentTransaction> findByStatusAndCreatedAtAfter(PaymentTransaction.TransactionStatus status, java.time.LocalDateTime date);
}
