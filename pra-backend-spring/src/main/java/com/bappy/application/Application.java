package com.bappy.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

/**
 * Main Spring Boot application class.
 * 
 * This is a production-ready enterprise application with:
 * - JWT Authentication
 * - OAuth2 Social Login (Google, GitHub, Facebook)
 * - Role-Based Access Control
 * - Email Verification
 * - Password Reset
 * - Refresh Token Rotation
 * - Comprehensive Security
 * - API Documentation (Swagger)
 * - Database Migrations (Flyway)
 * - Monitoring (Actuator + Prometheus)
 * - Auditing
 * - Global Exception Handling
 */
@SpringBootApplication
@EnableConfigurationProperties
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
