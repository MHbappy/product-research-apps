package com.bappy.application.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

/**
 * Application configuration properties.
 */
@Configuration
@ConfigurationProperties(prefix = "app")
@Getter
@Setter
public class AppConfig {

    private String name;
    private String version;
    private String url;
    private String frontendUrl;
    private Jwt jwt = new Jwt();
    private Cors cors = new Cors();
    private Security security = new Security();
    private Email email = new Email();
    private OAuth2 oauth2 = new OAuth2();

    @Getter
    @Setter
    public static class Jwt {
        private String secret;
        private Long expiration;
        private Long refreshExpiration;
    }

    @Getter
    @Setter
    public static class Cors {
        private String allowedOrigins;
        private String allowedMethods;
        private String allowedHeaders;
        private Boolean allowCredentials;
        private Long maxAge;
    }

    @Getter
    @Setter
    public static class Security {
        private RateLimit rateLimit = new RateLimit();
        private LoginAttempts loginAttempts = new LoginAttempts();

        @Getter
        @Setter
        public static class RateLimit {
            private Boolean enabled;
            private Integer capacity;
            private Integer refillTokens;
            private Integer refillDurationSeconds;
        }

        @Getter
        @Setter
        public static class LoginAttempts {
            private Integer maxAttempts;
            private Integer lockoutDurationMinutes;
        }
    }

    @Getter
    @Setter
    public static class Email {
        private Integer verificationExpirationHours;
        private Integer passwordResetExpirationHours;
    }

    @Getter
    @Setter
    public static class OAuth2 {
        private List<String> authorizedRedirectUris = new ArrayList<>();
    }
}
