package com.bappy.application.auth.service;

import com.bappy.application.auth.dto.AuthResponse;
import com.bappy.application.auth.dto.LoginRequest;
import com.bappy.application.auth.dto.SignupRequest;
import com.bappy.application.auth.entity.EmailVerificationToken;
import com.bappy.application.auth.entity.PasswordResetToken;
import com.bappy.application.auth.entity.RefreshToken;
import com.bappy.application.auth.repository.EmailVerificationTokenRepository;
import com.bappy.application.auth.repository.PasswordResetTokenRepository;
import com.bappy.application.config.AppConfig;
import com.bappy.application.exception.BadRequestException;
import com.bappy.application.exception.EmailAlreadyExistsException;
import com.bappy.application.exception.ResourceNotFoundException;
import com.bappy.application.security.UserPrincipal;
import com.bappy.application.security.jwt.JwtTokenProvider;
import com.bappy.application.user.entity.AuthProvider;
import com.bappy.application.user.entity.Role;
import com.bappy.application.user.entity.User;
import com.bappy.application.user.entity.UserStatus;
import com.bappy.application.user.repository.RoleRepository;
import com.bappy.application.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * Authentication service handling user registration, login, and token management.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;
    private final AppConfig appConfig;
    private final com.bappy.application.email.service.EmailService emailService;

    /**
     * Register new user
     */
    @Transactional
    public AuthResponse signup(SignupRequest request) {
        log.info("Attempting to register new user: {}", request.getEmail());

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        // Get default user role
        Role userRole = roleRepository.findByName(Role.USER)
                .orElseThrow(() -> new RuntimeException("User role not found. Please run database migrations."));

        Set<Role> roles = new HashSet<>();
        roles.add(userRole);

        // Create new user
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .provider(AuthProvider.LOCAL)
                .emailVerified(false)
                .status(UserStatus.PENDING_VERIFICATION)
                .roles(roles)
                .build();

        user = userRepository.save(user);
        log.info("User registered successfully: {}", user.getEmail());

        // Generate email verification token
        EmailVerificationToken verificationToken = createEmailVerificationToken(user);

        // Send verification email (async)
        emailService.sendVerificationEmail(user, verificationToken.getToken());

        // Generate JWT tokens
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        String accessToken = jwtTokenProvider.generateAccessToken(userPrincipal);
        RefreshToken refreshToken = tokenService.createRefreshToken(user);

        return buildAuthResponse(user, accessToken, refreshToken.getToken());
    }

    /**
     * Login with email and password
     */
    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("Attempting login for user: {}", request.getEmail());

        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        // Get user from database
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

        // Check if user is active
        if (user.getStatus() == UserStatus.DISABLED) {
            throw new BadRequestException("Account is disabled. Please contact support.");
        }

        if (user.getStatus() == UserStatus.LOCKED) {
            throw new BadRequestException("Account is locked due to security reasons. Please contact support.");
        }

        // Generate JWT tokens
        String accessToken = jwtTokenProvider.generateAccessToken(authentication);
        RefreshToken refreshToken = tokenService.createRefreshToken(user);

        log.info("User logged in successfully: {}", user.getEmail());

        // Send login alert email (optional, async)
        emailService.sendLoginAlertEmail(user, null, null);

        return buildAuthResponse(user, accessToken, refreshToken.getToken());
    }

    /**
     * Refresh access token using refresh token
     */
    @Transactional
    public AuthResponse refreshToken(String refreshTokenString) {
        log.info("Attempting to refresh token");

        // Verify refresh token
        RefreshToken refreshToken = tokenService.verifyRefreshToken(refreshTokenString);
        User user = refreshToken.getUser();

        // Generate new access token
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        String accessToken = jwtTokenProvider.generateAccessToken(userPrincipal);

        // Rotate refresh token (create new one and revoke old one)
        tokenService.revokeRefreshToken(refreshTokenString);
        RefreshToken newRefreshToken = tokenService.createRefreshToken(user);

        log.info("Token refreshed successfully for user: {}", user.getEmail());

        return buildAuthResponse(user, accessToken, newRefreshToken.getToken());
    }

    /**
     * Logout user (revoke refresh token)
     */
    @Transactional
    public void logout(String refreshToken) {
        log.info("Attempting to logout user");
        tokenService.revokeRefreshToken(refreshToken);
        log.info("User logged out successfully");
    }

    /**
     * Verify email with token
     */
    @Transactional
    public void verifyEmail(String token) {
        log.info("Attempting to verify email with token");

        EmailVerificationToken verificationToken = emailVerificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid verification token"));

        if (!verificationToken.isValid()) {
            throw new BadRequestException("Verification token has expired or already been used");
        }

        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);

        verificationToken.setVerified(true);
        emailVerificationTokenRepository.save(verificationToken);

        log.info("Email verified successfully for user: {}", user.getEmail());
    }

    /**
     * Request password reset
     */
    @Transactional
    public void forgotPassword(String email) {
        log.info("Password reset requested for email: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        // Delete existing password reset tokens
        passwordResetTokenRepository.deleteByUser(user);

        // Create new password reset token
        PasswordResetToken resetToken = createPasswordResetToken(user);

        // Send password reset email
        emailService.sendPasswordResetEmail(user, resetToken.getToken());

        log.info("Password reset email sent to: {}", email);
    }

    /**
     * Reset password with token
     */
    @Transactional
    public void resetPassword(String token, String newPassword) {
        log.info("Attempting to reset password with token");

        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid password reset token"));

        if (!resetToken.isValid()) {
            throw new BadRequestException("Password reset token has expired or already been used");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        // Revoke all refresh tokens for security
        tokenService.revokeAllUserTokens(user);

        log.info("Password reset successfully for user: {}", user.getEmail());
    }

    /**
     * Exchange OAuth2 token for JWT tokens
     * This endpoint accepts the token from OAuth2 redirect and returns the same response as login
     */
    @Transactional
    public AuthResponse exchangeOAuth2Token(String oauth2Token) {
        try {
            // Validate the OAuth2 token (it's actually a JWT we generated)
            if (!jwtTokenProvider.validateToken(oauth2Token)) {
                throw new BadRequestException("Invalid or expired OAuth2 token");
            }

            // Get user ID from token
            Long userId = jwtTokenProvider.getUserIdFromToken(oauth2Token);
            
            // Load user
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

            // Check if user is active
            if (user.getStatus() != UserStatus.ACTIVE) {
                throw new BadRequestException("User account is not active");
            }

            // Generate new JWT tokens (same as login)
            UserPrincipal userPrincipal = UserPrincipal.create(user);
            String accessToken = jwtTokenProvider.generateAccessToken(userPrincipal);

            // Create refresh token
            RefreshToken refreshToken = tokenService.createRefreshToken(user);

            // Send login alert email (optional)
            emailService.sendLoginAlertEmail(user, null, null);

            log.info("OAuth2 token exchanged successfully for user: {}", user.getEmail());

            log.info("OAuth2 token exchanged successfully for user: {}", user.getEmail());

            return buildAuthResponse(user, accessToken, refreshToken.getToken());
            
        } catch (Exception e) {
            log.error("OAuth2 token exchange failed", e);
            throw new BadRequestException("Failed to exchange OAuth2 token: " + e.getMessage());
        }
    }

    /**
     * Change password for authenticated user
     */
    @Transactional
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // specific check for users who signed up with social login and don't have a password
        if (user.getPassword() == null) {
            throw new BadRequestException("You signed up with a social account. Please use 'Forgot Password' to set a password first.");
        }

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new BadRequestException("Incorrect old password");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Optional: Revoke all sessions/tokens if you want to force re-login
        // tokenService.revokeAllUserTokens(user);

        log.info("Password changed successfully for user: {}", user.getEmail());
    }

    // ==================== Helper Methods ====================
    /**
     * Create email verification token
     */
    private EmailVerificationToken createEmailVerificationToken(User user) {
        LocalDateTime expiryDate = LocalDateTime.now()
                .plusHours(appConfig.getEmail().getVerificationExpirationHours());

        EmailVerificationToken token = EmailVerificationToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(expiryDate)
                .verified(false)
                .build();

        return emailVerificationTokenRepository.save(token);
    }

    /**
     * Create password reset token
     */
    private PasswordResetToken createPasswordResetToken(User user) {
        LocalDateTime expiryDate = LocalDateTime.now()
                .plusHours(appConfig.getEmail().getPasswordResetExpirationHours());

        PasswordResetToken token = PasswordResetToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(expiryDate)
                .used(false)
                .build();

        return passwordResetTokenRepository.save(token);
    }

    /**
     * Build authentication response
     */
    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken) {
        // Extract role names from user roles
        java.util.List<String> roleNames = user.getRoles().stream()
                .map(com.bappy.application.user.entity.Role::getName)
                .collect(java.util.stream.Collectors.toList());

        AuthResponse.UserInfo userInfo = AuthResponse.UserInfo.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .emailVerified(user.getEmailVerified())
                .status(user.getStatus().name())
                .roles(roleNames)
                .provider(user.getProvider().name())
                .avatarUrl(user.getAvatarUrl())
                .build();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(appConfig.getJwt().getExpiration() / 1000) // Convert to seconds
                .user(userInfo)
                .build();
    }
}
