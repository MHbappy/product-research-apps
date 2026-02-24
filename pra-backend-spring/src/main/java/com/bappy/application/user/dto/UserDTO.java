package com.bappy.application.user.dto;

import com.bappy.application.user.entity.AuthProvider;
import com.bappy.application.user.entity.UserStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * Data Transfer Object for User entity.
 * Used to expose user information through API endpoints.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDTO {

    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String fullName;
    private Boolean emailVerified;
    private UserStatus status;
    private AuthProvider provider;
    private Set<String> roles;
    private String avatarUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
