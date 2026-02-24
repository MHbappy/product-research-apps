package com.bappy.application.user.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for profile update requests.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    
    @Size(min = 1, max = 100)
    private String firstName;
    
    @Size(min = 1, max = 100)
    private String lastName;
    
    @Size(max = 500)
    private String avatarUrl;
}
