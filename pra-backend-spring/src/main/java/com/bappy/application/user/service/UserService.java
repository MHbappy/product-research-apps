package com.bappy.application.user.service;


import com.bappy.application.exception.EmailAlreadyExistsException;
import com.bappy.application.exception.ResourceNotFoundException;
import com.bappy.application.user.dto.CreateUserRequest;
import com.bappy.application.user.dto.RoleDTO;
import com.bappy.application.user.dto.UserDTO;
import com.bappy.application.user.entity.AuthProvider;
import com.bappy.application.user.entity.Role;
import com.bappy.application.user.entity.User;
import com.bappy.application.user.entity.UserStatus;
import com.bappy.application.user.repository.RoleRepository;
import com.bappy.application.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service layer for user management operations.
 * Handles business logic for user administration.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    /**
     * Get all users with pagination
     *
     * @param pageable Pagination parameters
     * @return Page of UserDTOs
     */
    @Transactional(readOnly = true)
    public Page<UserDTO> getAllUsers(Pageable pageable) {
        log.info("Fetching all users with pagination: page={}, size={}", 
                pageable.getPageNumber(), pageable.getPageSize());
        
        return userRepository.findAll(pageable)
                .map(this::toDTO);
    }

    /**
     * Search users by email or name
     *
     * @param search   Search query
     * @param pageable Pagination parameters
     * @return Page of UserDTOs matching the search
     */
    @Transactional(readOnly = true)
    public Page<UserDTO> searchUsers(String search, Pageable pageable) {
        log.info("Searching users with query: {}", search);
        
        return userRepository.searchUsers(search, pageable)
                .map(this::toDTO);
    }

    /**
     * Get user by ID
     *
     * @param id User ID
     * @return UserDTO
     * @throws ResourceNotFoundException if user not found
     */
    @Transactional(readOnly = true)
    public UserDTO getUserById(Long id) {
        log.info("Fetching user by ID: {}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        
        return toDTO(user);
    }

    /**
     * Update user status
     *
     * @param id     User ID
     * @param status New status
     * @return Updated UserDTO
     * @throws ResourceNotFoundException if user not found
     */
    @Transactional
    public UserDTO updateUserStatus(Long id, UserStatus status) {
        log.info("Updating user status: userId={}, newStatus={}", id, status);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        
        UserStatus oldStatus = user.getStatus();
        user.setStatus(status);
        User updatedUser = userRepository.save(user);
        

        
        log.info("User status updated successfully: userId={}, oldStatus={}, newStatus={}", 
                id, oldStatus, status);
        
        return toDTO(updatedUser);
    }

    /**
     * Change user password (Admin only)
     *
     * @param id          User ID
     * @param newPassword New password
     * @throws ResourceNotFoundException if user not found
     */
    @Transactional
    public void changeUserPassword(Long id, String newPassword) {
        log.info("Admin changing password for user ID: {}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        

        
        log.info("Password changed successfully by admin for user: {}", user.getEmail());
    }

    /**
     * Create a new user (Admin only)
     *
     * @param request Create user request
     * @return Created UserDTO
     */
    @Transactional
    public UserDTO createUser(CreateUserRequest request) {
        log.info("Creating user with email: {}", request.getEmail());
        
        // Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }
        
        // Generate temporary password (12 characters)
        String tempPassword = generateTemporaryPassword();
        
        // Create user entity
        User user = User.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .password(passwordEncoder.encode(tempPassword))
                .status(request.getStatus())
                .provider(AuthProvider.LOCAL)
                .emailVerified(request.getStatus() == UserStatus.ACTIVE)
                .build();
        
        // Assign roles
        Set<Role> userRoles = request.getRoles().stream()
                .map(roleName -> roleRepository.findByName(roleName)
                        .orElseThrow(() -> new ResourceNotFoundException("Role", "name", roleName)))
                .collect(Collectors.toSet());
        user.setRoles(userRoles);
        
        User savedUser = userRepository.save(user);
        
        log.info("User created successfully: {} with temp password (not logged)", savedUser.getEmail());
        

        
        // TODO: Send email with temporary password
        
        return toDTO(savedUser);
    }

    /**
     * Verify user manually (Admin only)
     * Changes status from PENDING_VERIFICATION to ACTIVE
     *
     * @param userId User ID
     * @return Updated UserDTO
     */
    @Transactional
    public UserDTO verifyUser(Long userId) {
        log.info("Verifying user with ID: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        if (user.getStatus() != UserStatus.PENDING_VERIFICATION) {
            throw new IllegalStateException("User is not in PENDING_VERIFICATION status. Current status: " + user.getStatus());
        }
        
        user.setStatus(UserStatus.ACTIVE);
        user.setEmailVerified(true);
        User updatedUser = userRepository.save(user);
        

        
        log.info("User verified successfully: {}", user.getEmail());
        
        return toDTO(updatedUser);
    }

    /**
     * Get all available roles
     *
     * @return List of RoleDTOs
     */
    @Transactional(readOnly = true)
    public List<RoleDTO> getAllRoles() {
        log.info("Fetching all roles");
        
        return roleRepository.findAll().stream()
                .map(role -> RoleDTO.builder()
                        .id(role.getId())
                        .name(role.getName())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Update user roles (Admin only)
     *
     * @param userId    User ID
     * @param roleNames Set of role names
     * @return Updated UserDTO
     */
    @Transactional
    public UserDTO updateUserRoles(Long userId, Set<String> roleNames) {
        log.info("Updating roles for user ID: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        

        
        Set<Role> newRoles = roleNames.stream()
                .map(roleName -> roleRepository.findByName(roleName)
                        .orElseThrow(() -> new ResourceNotFoundException("Role", "name", roleName)))
                .collect(Collectors.toSet());
        
        user.setRoles(newRoles);
        User updatedUser = userRepository.save(user);
        

        
        log.info("User roles updated successfully for: {}", user.getEmail());
        
        return toDTO(updatedUser);
    }

    /**
     * Generate temporary password
     *
     * @return Random 12-character password
     */
    private String generateTemporaryPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder password = new StringBuilder();
        java.util.Random random = new java.util.Random();
        
        for (int i = 0; i < 12; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }
        
        return password.toString();
    }



    /**
     * Convert User entity to UserDTO
     *
     * @param user User entity
     * @return UserDTO
     */
    private UserDTO toDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .emailVerified(user.getEmailVerified())
                .status(user.getStatus())
                .provider(user.getProvider())
                .roles(user.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet()))
                .avatarUrl(user.getAvatarUrl())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    /**
     * Update user profile
     *
     * @param userId  User ID
     * @param request Update profile request
     * @return Updated UserDTO
     */
    @Transactional
    public UserDTO updateProfile(Long userId, com.bappy.application.user.dto.UpdateProfileRequest request) {
        log.info("Updating profile for user ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        User updatedUser = userRepository.save(user);

        log.info("Profile updated successfully for user: {}", user.getEmail());

        return toDTO(updatedUser);
    }
}
