package com.bappy.application.auth.repository;

import com.bappy.application.auth.entity.EmailVerificationToken;
import com.bappy.application.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Repository for EmailVerificationToken entity.
 */
@Repository
public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {

    /**
     * Find token by token string
     */
    Optional<EmailVerificationToken> findByToken(String token);

    /**
     * Find token by user
     */
    Optional<EmailVerificationToken> findByUser(User user);

    /**
     * Delete all tokens for a user
     */
    void deleteByUser(User user);

    /**
     * Delete expired tokens
     */
    @Modifying
    @Query("DELETE FROM EmailVerificationToken evt WHERE evt.expiryDate < :now")
    void deleteExpiredTokens(@Param("now") LocalDateTime now);
}
