package com.bappy.application.security.oauth2;

import com.bappy.application.security.UserPrincipal;
import com.bappy.application.user.entity.AuthProvider;
import com.bappy.application.user.entity.Role;
import com.bappy.application.user.entity.User;
import com.bappy.application.user.entity.UserStatus;
import com.bappy.application.user.repository.RoleRepository;
import com.bappy.application.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Custom OAuth2 user service for processing OAuth2 user information.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        try {
            return processOAuth2User(userRequest, oAuth2User);
        } catch (Exception ex) {
            log.error("Error processing OAuth2 user", ex);
            throw new OAuth2AuthenticationException(ex.getMessage());
        }
    }

    /**
     * Process OAuth2 user information and create/update user
     */
    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(registrationId, oAuth2User.getAttributes());

        if (!StringUtils.hasText(oAuth2UserInfo.getEmail())) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        User user = userRepository.findByEmail(oAuth2UserInfo.getEmail())
                .map(existingUser -> updateExistingUser(existingUser, oAuth2UserInfo, registrationId))
                .orElseGet(() -> registerNewUser(oAuth2UserInfo, registrationId));

        return UserPrincipal.create(user, oAuth2User.getAttributes());
    }

    /**
     * Register new user from OAuth2 information
     */
    private User registerNewUser(OAuth2UserInfo oAuth2UserInfo, String registrationId) {
        log.info("Registering new OAuth2 user: {}", oAuth2UserInfo.getEmail());

        Role userRole = roleRepository.findByName(Role.USER)
                .orElseThrow(() -> new RuntimeException("User role not found"));

        Set<Role> roles = new HashSet<>();
        roles.add(userRole);

        User user = User.builder()
                .email(oAuth2UserInfo.getEmail())
                .firstName(oAuth2UserInfo.getFirstName())
                .lastName(oAuth2UserInfo.getLastName())
                .provider(AuthProvider.valueOf(registrationId.toUpperCase()))
                .providerId(oAuth2UserInfo.getId())
                .emailVerified(true) // OAuth2 providers verify email
                .status(UserStatus.ACTIVE)
                .roles(roles)
                .build();

        return userRepository.save(user);
    }

    /**
     * Update existing user with OAuth2 information
     */
    private User updateExistingUser(User existingUser, OAuth2UserInfo oAuth2UserInfo, String registrationId) {
        log.info("Updating existing OAuth2 user: {}", oAuth2UserInfo.getEmail());

        // Update user information if changed
        if (StringUtils.hasText(oAuth2UserInfo.getFirstName()) && 
            !oAuth2UserInfo.getFirstName().equals(existingUser.getFirstName())) {
            existingUser.setFirstName(oAuth2UserInfo.getFirstName());
        }

        if (StringUtils.hasText(oAuth2UserInfo.getLastName()) && 
            !oAuth2UserInfo.getLastName().equals(existingUser.getLastName())) {
            existingUser.setLastName(oAuth2UserInfo.getLastName());
        }

        // Link OAuth2 provider if not already linked
        if (existingUser.getProvider() == AuthProvider.LOCAL) {
            existingUser.setProvider(AuthProvider.valueOf(registrationId.toUpperCase()));
            existingUser.setProviderId(oAuth2UserInfo.getId());
        }

        return userRepository.save(existingUser);
    }
}
