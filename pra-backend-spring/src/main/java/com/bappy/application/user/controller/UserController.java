package com.bappy.application.user.controller;

import com.bappy.application.common.dto.ApiResponse;
import com.bappy.application.user.dto.AdminChangePasswordRequest;
import com.bappy.application.user.dto.CreateUserRequest;
import com.bappy.application.user.dto.RoleDTO;
import com.bappy.application.user.dto.UpdateUserRolesRequest;
import com.bappy.application.user.dto.UpdateUserStatusRequest;
import com.bappy.application.user.dto.UserDTO;
import com.bappy.application.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * User management REST controller for ADMIN operations.
 * All endpoints require ADMIN role.
 */
@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "User Management (Admin)", description = "Admin endpoints for managing users")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    /**
     * Get all users with pagination
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all users", description = "Retrieve paginated list of all users (ADMIN only)")
    public ResponseEntity<ApiResponse<Page<UserDTO>>> getAllUsers(
            @Parameter(description = "Page number (0-indexed)")
            @RequestParam(defaultValue = "0") int page,
            
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "10") int size,
            
            @Parameter(description = "Sort by field")
            @RequestParam(defaultValue = "id") String sortBy,
            
            @Parameter(description = "Sort direction (ASC or DESC)")
            @RequestParam(defaultValue = "DESC") String sortDir) {
        
        log.info("Get all users request: page={}, size={}, sortBy={}, sortDir={}", 
                page, size, sortBy, sortDir);
        
        Sort sort = sortDir.equalsIgnoreCase("ASC") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<UserDTO> users = userService.getAllUsers(pageable);
        
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }

    /**
     * Search users by email or name
     */
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Search users", description = "Search users by email or name (ADMIN only)")
    public ResponseEntity<ApiResponse<Page<UserDTO>>> searchUsers(
            @Parameter(description = "Search query")
            @RequestParam String query,
            
            @Parameter(description = "Page number (0-indexed)")
            @RequestParam(defaultValue = "0") int page,
            
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "10") int size,
            
            @Parameter(description = "Sort by field")
            @RequestParam(defaultValue = "id") String sortBy,
            
            @Parameter(description = "Sort direction (ASC or DESC)")
            @RequestParam(defaultValue = "DESC") String sortDir) {
        
        log.info("Search users request: query={}, page={}, size={}", query, page, size);
        
        Sort sort = sortDir.equalsIgnoreCase("ASC") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<UserDTO> users = userService.searchUsers(query, pageable);
        
        return ResponseEntity.ok(ApiResponse.success("Search results retrieved successfully", users));
    }

    /**
     * Get user by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get user by ID", description = "Retrieve user details by ID (ADMIN only)")
    public ResponseEntity<ApiResponse<UserDTO>> getUserById(
            @Parameter(description = "User ID")
            @PathVariable Long id) {
        
        log.info("Get user by ID request: id={}", id);
        
        UserDTO user = userService.getUserById(id);
        
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user));
    }

    /**
     * Update user status (activate/suspend)
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update user status", description = "Update user account status (ADMIN only)")
    public ResponseEntity<ApiResponse<UserDTO>> updateUserStatus(
            @Parameter(description = "User ID")
            @PathVariable Long id,
            
            @Valid @RequestBody UpdateUserStatusRequest request) {
        
        log.info("Update user status request: id={}, newStatus={}", id, request.getStatus());
        
        UserDTO updatedUser = userService.updateUserStatus(id, request.getStatus());
        
        return ResponseEntity.ok(ApiResponse.success("User status updated successfully", updatedUser));
    }

    /**
     * Change user password (ADMIN only)
     */
    @PutMapping("/{id}/password")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Change user password", description = "Change password for any user (ADMIN only)")
    public ResponseEntity<ApiResponse<Void>> changeUserPassword(
            @Parameter(description = "User ID")
            @PathVariable Long id,
            
            @Valid @RequestBody AdminChangePasswordRequest request) {
        
        log.info("Change password request for user ID: {}", id);
        
        userService.changeUserPassword(id, request.getNewPassword());
        
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully for user ID: " + id, null));
    }

    /**
     * Create a new user (ADMIN only)
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create user", description = "Create a new user account (ADMIN only)")
    public ResponseEntity<ApiResponse<UserDTO>> createUser(
            @Valid @RequestBody CreateUserRequest request) {
        
        log.info("Create user request: {}", request.getEmail());
        
        UserDTO createdUser = userService.createUser(request);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User created successfully", createdUser));
    }

    /**
     * Verify user manually (ADMIN only)
     */
    @PutMapping("/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Verify user", description = "Manually verify pending user (ADMIN only)")
    public ResponseEntity<ApiResponse<UserDTO>> verifyUser(
            @Parameter(description = "User ID")
            @PathVariable Long id) {
        
        log.info("Verify user request for ID: {}", id);
        
        UserDTO verifiedUser = userService.verifyUser(id);
        
        return ResponseEntity.ok(ApiResponse.success("User verified successfully", verifiedUser));
    }

    /**
     * Get all available roles (ADMIN only)
     */
    @GetMapping("/roles")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all roles", description = "Retrieve all available roles (ADMIN only)")
    public ResponseEntity<ApiResponse<List<RoleDTO>>> getAllRoles() {
        
        log.info("Get all roles request");
        
        List<RoleDTO> roles = userService.getAllRoles();
        
        return ResponseEntity.ok(ApiResponse.success("Roles retrieved successfully", roles));
    }

    /**
     * Update user roles (ADMIN only)
     */
    @PutMapping("/{id}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update user roles", description = "Update role assignments for user (ADMIN only)")
    public ResponseEntity<ApiResponse<UserDTO>> updateUserRoles(
            @Parameter(description = "User ID")
            @PathVariable Long id,
            
            @Valid @RequestBody UpdateUserRolesRequest request) {
        
        log.info("Update user roles request for ID: {}", id);
        
        UserDTO updatedUser = userService.updateUserRoles(id, request.getRoles());
        
        return ResponseEntity.ok(ApiResponse.success("User roles updated successfully", updatedUser));
    }
}
