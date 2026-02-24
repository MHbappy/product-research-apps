package com.bappy.application.email.service;

import com.bappy.application.email.dto.EmailDto;
import com.bappy.application.user.entity.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.HashMap;
import java.util.Map;

/**
 * Email service for sending emails.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${spring.mail.from:noreply@example.com}")
    private String fromEmail;

    @Value("${app.url:http://localhost:8080}")
    private String appUrl;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    /**
     * Send simple text email
     */
    @Async
    public void sendSimpleEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            
            mailSender.send(message);
            log.info("Simple email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send simple email to: {}", to, e);
        }
    }

    /**
     * Send HTML email
     */
    @Async
    public void sendHtmlEmail(EmailDto emailDto) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(emailDto.getTo());
            helper.setSubject(emailDto.getSubject());
            helper.setText(emailDto.getBody(), true);
            
            mailSender.send(message);
            log.info("HTML email sent successfully to: {}", emailDto.getTo());
        } catch (MessagingException e) {
            log.error("Failed to send HTML email to: {}", emailDto.getTo(), e);
        }
    }

    /**
     * Send email using Thymeleaf template
     */
    @Async
    public void sendTemplateEmail(EmailDto emailDto) {
        try {
            Context context = new Context();
            context.setVariables(emailDto.getTemplateModel());
            
            String htmlContent = templateEngine.process(emailDto.getTemplateName(), context);
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(emailDto.getTo());
            helper.setSubject(emailDto.getSubject());
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("Template email sent successfully to: {} using template: {}", 
                    emailDto.getTo(), emailDto.getTemplateName());
        } catch (MessagingException e) {
            log.error("Failed to send template email to: {}", emailDto.getTo(), e);
        }
    }

    /**
     * Send email verification email
     */
    @Async
    public void sendVerificationEmail(User user, String token) {
        try {
            String verificationUrl = appUrl + "/api/v1/auth/verify-email?token=" + token;
            
            Map<String, Object> model = new HashMap<>();
            model.put("name", user.getFirstName() != null ? user.getFirstName() : user.getEmail());
            model.put("verificationUrl", verificationUrl);
            model.put("appUrl", frontendUrl);
            
            EmailDto emailDto = EmailDto.builder()
                    .to(user.getEmail())
                    .subject("Verify Your Email Address")
                    .templateName("email/verification-email")
                    .templateModel(model)
                    .build();
            
            sendTemplateEmail(emailDto);
            log.info("Verification email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send verification email to: {}", user.getEmail(), e);
        }
    }

    /**
     * Send password reset email
     */
    @Async
    public void sendPasswordResetEmail(User user, String token) {
        try {
            String resetUrl = frontendUrl + "/reset-password?token=" + token;
            
            Map<String, Object> model = new HashMap<>();
            model.put("name", user.getFirstName() != null ? user.getFirstName() : user.getEmail());
            model.put("resetUrl", resetUrl);
            model.put("appUrl", frontendUrl);
            
            EmailDto emailDto = EmailDto.builder()
                    .to(user.getEmail())
                    .subject("Reset Your Password")
                    .templateName("email/password-reset-email")
                    .templateModel(model)
                    .build();
            
            sendTemplateEmail(emailDto);
            log.info("Password reset email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", user.getEmail(), e);
        }
    }

    /**
     * Send login alert email
     */
    @Async
    public void sendLoginAlertEmail(User user, String ipAddress, String userAgent) {
        try {
            Map<String, Object> model = new HashMap<>();
            model.put("name", user.getFirstName() != null ? user.getFirstName() : user.getEmail());
            model.put("ipAddress", ipAddress != null ? ipAddress : "Unknown");
            model.put("userAgent", userAgent != null ? userAgent : "Unknown");
            model.put("appUrl", frontendUrl);
            
            EmailDto emailDto = EmailDto.builder()
                    .to(user.getEmail())
                    .subject("New Login to Your Account")
                    .templateName("email/login-alert-email")
                    .templateModel(model)
                    .build();
            
            sendTemplateEmail(emailDto);
            log.info("Login alert email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send login alert email to: {}", user.getEmail(), e);
        }
    }

    /**
     * Send welcome email
     */
    @Async
    public void sendWelcomeEmail(User user) {
        try {
            Map<String, Object> model = new HashMap<>();
            model.put("name", user.getFirstName() != null ? user.getFirstName() : user.getEmail());
            model.put("appUrl", frontendUrl);
            
            EmailDto emailDto = EmailDto.builder()
                    .to(user.getEmail())
                    .subject("Welcome to Our Platform!")
                    .templateName("email/welcome-email")
                    .templateModel(model)
                    .build();
            
            sendTemplateEmail(emailDto);
            log.info("Welcome email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send welcome email to: {}", user.getEmail(), e);
        }
    }
}
