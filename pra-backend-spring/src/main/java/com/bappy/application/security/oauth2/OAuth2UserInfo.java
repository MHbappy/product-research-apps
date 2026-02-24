package com.bappy.application.security.oauth2;

import lombok.Getter;

import java.util.Map;

/**
 * Abstract class for OAuth2 user information.
 */
@Getter
public abstract class OAuth2UserInfo {

    protected Map<String, Object> attributes;

    public OAuth2UserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    public abstract String getId();

    public abstract String getEmail();

    public abstract String getFirstName();

    public abstract String getLastName();

    public abstract String getImageUrl();
}
