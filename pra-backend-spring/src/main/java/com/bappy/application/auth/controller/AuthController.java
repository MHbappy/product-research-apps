package com.bappy.application.auth.controller;

import com.bappy.application.auth.dto.AuthResponse;
import com.bappy.application.auth.dto.LoginRequest;
import com.bappy.application.auth.dto.OAuth2TokenRequest;
import com.bappy.application.auth.dto.RefreshTokenRequest;
import com.bappy.application.auth.dto.SignupRequest;
import com.bappy.application.auth.service.AuthService;
import com.bappy.application.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication REST controller.
 * Handles user registration, login, token refresh, and password management.
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "Authentication and authorization endpoints")
public class AuthController {

    private final AuthService authService;

    /**
     * Register new user
     */
    @PostMapping("/signup")
    @Operation(summary = "Register new user", description = "Create a new user account with email and password")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(@Valid @RequestBody SignupRequest request) {
        log.info("Signup request received for email: {}", request.getEmail());
        AuthResponse response = authService.signup(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully. Please verify your email.", response));
    }

    /**
     * Login with email and password
     */
    @PostMapping("/login")
    @Operation(summary = "Login", description = "Authenticate user with email and password")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request received for email: {}", request.getEmail());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    /**
     * Exchange OAuth2 token for JWT tokens
     * This endpoint accepts the token from OAuth2 redirect and returns the same response as /login
     */
    @PostMapping("/oauth2/token")
    @Operation(summary = "Exchange OAuth2 token", 
               description = "Exchange OAuth2 token from redirect URL for JWT access and refresh tokens")
    public ResponseEntity<ApiResponse<AuthResponse>> exchangeOAuth2Token(
            @Valid @RequestBody OAuth2TokenRequest request) {
        
        log.info("OAuth2 token exchange request received");
        
        AuthResponse response = authService.exchangeOAuth2Token(request.getToken());
        
        return ResponseEntity.ok(ApiResponse.success("OAuth2 login successful", response));
    }

    /**
     * Refresh access token
     */
    @PostMapping("/refresh")
    @Operation(summary = "Refresh token", description = "Get new access token using refresh token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("Token refresh request received");
        AuthResponse response = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response));
    }

    /**
     * Logout user
     */
    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "Logout user and revoke refresh token")
    public ResponseEntity<ApiResponse<Void>> logout(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("Logout request received");
        authService.logout(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.success("Logout successful"));
    }

    /**
     * Verify email
     */
    @GetMapping("/verify-email")
    @Operation(summary = "Verify email", description = "Verify user email address with token")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@RequestParam String token) {
        log.info("Email verification request received");
        authService.verifyEmail(token);
        return ResponseEntity.ok(ApiResponse.success("Email verified successfully"));
    }

    /**
     * Request password reset
     */
    @PostMapping("/forgot-password")
    @Operation(summary = "Forgot password", description = "Request password reset email")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@RequestParam @Email @NotBlank String email) {
        log.info("Password reset request received for email: {}", email);
        authService.forgotPassword(email);
        return ResponseEntity.ok(ApiResponse.success("Password reset email sent"));
    }

    /**
     * Reset password
     */
    @PostMapping("/reset-password")
    @Operation(summary = "Reset password", description = "Reset password with token")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @RequestParam String token,
            @RequestParam @NotBlank String newPassword) {
        log.info("Password reset request received");
        authService.resetPassword(token, newPassword);
        return ResponseEntity.ok(ApiResponse.success("Password reset successfully"));
    }

    /**
     * Change password for logged-in user
     */
    @PostMapping("/change-password")
    @Operation(summary = "Change password", description = "Change password for logged-in user")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody com.bappy.application.auth.dto.ChangePasswordRequest request,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.bappy.application.security.UserPrincipal currentUser) {
        log.info("Change password request received for user: {}", currentUser.getEmail());
        authService.changePassword(currentUser.getId(), request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
    }
}
