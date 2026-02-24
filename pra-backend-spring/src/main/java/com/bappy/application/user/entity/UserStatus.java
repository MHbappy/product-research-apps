package com.bappy.application.user.entity;

/**
 * User status enumeration.
 */
public enum UserStatus {
    /**
     * User account is active and can login
     */
    ACTIVE,
    
    /**
     * User account is temporarily disabled
     */
    DISABLED,
    
    /**
     * User account is soft deleted
     */
    DELETED,
    
    /**
     * User account is locked due to security reasons
     */
    LOCKED,
    
    /**
     * User account is pending email verification
     */
    PENDING_VERIFICATION
}
