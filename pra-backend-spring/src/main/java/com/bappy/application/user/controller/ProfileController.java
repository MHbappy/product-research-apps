package com.bappy.application.user.controller;

import com.bappy.application.common.dto.ApiResponse;
import com.bappy.application.security.UserPrincipal;
import com.bappy.application.user.dto.UpdateProfileRequest;
import com.bappy.application.user.dto.UserDTO;
import com.bappy.application.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Profile management REST controller for authenticated users.
 */
@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Profile Management", description = "Endpoints for managing user profile")
@SecurityRequirement(name = "bearerAuth")
public class ProfileController {

    private final UserService userService;

    /**
     * Get current user profile
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get profile", description = "Get current user profile information")
    public ResponseEntity<ApiResponse<UserDTO>> getProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        log.info("Get profile request for user: {}", currentUser.getEmail());
        
        UserDTO user = userService.getUserById(currentUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", user));
    }

    /**
     * Update current user profile
     */
    @PutMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update profile", description = "Update current user profile information")
    public ResponseEntity<ApiResponse<UserDTO>> updateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody UpdateProfileRequest request) {
        
        log.info("Update profile request for user: {}", currentUser.getEmail());
        
        UserDTO updatedUser = userService.updateProfile(currentUser.getId(), request);
        
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updatedUser));
    }
}
