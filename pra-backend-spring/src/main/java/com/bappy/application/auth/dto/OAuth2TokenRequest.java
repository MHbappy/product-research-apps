package com.bappy.application.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * OAuth2 token exchange request.
 * Used to exchange OAuth2 authorization code for JWT tokens.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OAuth2TokenRequest {

    @NotBlank(message = "Token is required")
    private String token;

    private String provider; // google, github, facebook
}
