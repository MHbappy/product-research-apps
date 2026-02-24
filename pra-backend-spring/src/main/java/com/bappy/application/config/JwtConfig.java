package com.bappy.application.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * JWT configuration properties.
 */
@Configuration
@ConfigurationProperties(prefix = "app.jwt")
@Getter
@Setter
public class JwtConfig {

    /**
     * JWT secret key for signing tokens
     */
    private String secret;

    /**
     * Access token expiration time in milliseconds
     */
    private Long expiration;

    /**
     * Refresh token expiration time in milliseconds
     */
    private Long refreshExpiration;
}
