package com.bappy.application.user.entity;

/**
 * Authentication provider enumeration.
 */
public enum AuthProvider {
    /**
     * Local email/password authentication
     */
    LOCAL,
    
    /**
     * Google OAuth2 authentication
     */
    GOOGLE,
    
    /**
     * GitHub OAuth2 authentication
     */
    GITHUB,
    
    /**
     * Facebook OAuth2 authentication
     */
    FACEBOOK
}
