package com.bappy.application.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * CORS configuration for the application.
 */
@Configuration
@RequiredArgsConstructor
public class CorsConfig {

    private final AppConfig appConfig;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Parse allowed origins from comma-separated string
        String[] origins = appConfig.getCors().getAllowedOrigins().split(",");
        configuration.setAllowedOrigins(Arrays.asList(origins));

        // Parse allowed methods from comma-separated string
        String[] methods = appConfig.getCors().getAllowedMethods().split(",");
        configuration.setAllowedMethods(Arrays.asList(methods));

        // Set allowed headers
        if ("*".equals(appConfig.getCors().getAllowedHeaders())) {
            configuration.setAllowedHeaders(List.of("*"));
        } else {
            String[] headers = appConfig.getCors().getAllowedHeaders().split(",");
            configuration.setAllowedHeaders(Arrays.asList(headers));
        }

        // Set credentials
        configuration.setAllowCredentials(appConfig.getCors().getAllowCredentials());

        // Set max age
        configuration.setMaxAge(appConfig.getCors().getMaxAge());

        // Expose headers
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
