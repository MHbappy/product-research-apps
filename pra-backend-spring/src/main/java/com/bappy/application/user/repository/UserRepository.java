package com.bappy.application.user.repository;

import com.bappy.application.user.entity.User;
import com.bappy.application.user.entity.UserStatus;
import com.bappy.application.user.entity.AuthProvider;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for User entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by email
     */
    Optional<User> findByEmail(String email);

    /**
     * Find user by email and status
     */
    Optional<User> findByEmailAndStatus(String email, UserStatus status);

    /**
     * Find user by provider and provider ID
     */
    Optional<User> findByProviderAndProviderId(AuthProvider provider, String providerId);

    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);

    /**
     * Find all users by status with pagination
     */
    Page<User> findByStatus(UserStatus status, Pageable pageable);

    /**
     * Search users by email or name
     */
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<User> searchUsers(@Param("search") String search, Pageable pageable);

    /**
     * Count users by status
     */
    long countByStatus(UserStatus status);

    /**
     * Find all active users
     */
    @Query("SELECT u FROM User u WHERE u.status = 'ACTIVE'")
    Page<User> findAllActiveUsers(Pageable pageable);
}
