# Forgot Password & Reset Password Implementation

## Overview

The forgot password and reset password flows have been implemented using your Spring Boot authentication API.

## Features

### 1. Forgot Password Flow
- **Route**: `/auth/forgot-password`
- **Component**: `ForgotPasswordForm`
- **API Endpoint**: `POST /api/v1/auth/forgot-password?email={email}`

**User Flow**:
1. User enters their email address
2. System sends password reset email with token
3. Success message displayed
4. User can request another email if needed

### 2. Reset Password Flow
- **Route**: `/auth/reset-password?token={token}`
- **Component**: `ResetPasswordForm`
- **API Endpoint**: `POST /api/v1/auth/reset-password?token={token}&newPassword={newPassword}`

**User Flow**:
1. User clicks reset link from email (contains token)
2. User enters new password and confirms it
3. Password is validated (minimum 8 characters)
4. Passwords must match
5. On success, user is redirected to sign-in page

## Files Created

### Forms
- `src/features/auth/components/forgot-password-form.tsx` - Forgot password form
- `src/features/auth/components/reset-password-form.tsx` - Reset password form

### Views
- `src/features/auth/components/forgot-password-view.tsx` - Forgot password page layout
- `src/features/auth/components/reset-password-view.tsx` - Reset password page layout

### Pages
- `src/app/auth/forgot-password/page.tsx` - Forgot password route
- `src/app/auth/reset-password/page.tsx` - Reset password route

## Usage

### From Sign-In Page
The sign-in form includes a "Forgot password?" link that directs users to `/auth/forgot-password`.

### Email Template (Backend)
Your Spring Boot backend should send an email with a reset link in this format:
```
https://your-domain.com/auth/reset-password?token={reset_token}
```

### Token Expiration
According to your API documentation:
- Reset tokens expire after **1 hour**
- If token is expired, user must request a new reset link

## Validation

### Forgot Password Form
- Email must be valid format
- Shows success message even if email doesn't exist (security best practice)

### Reset Password Form
- Password must be at least 8 characters
- Confirm password must match
- Token must be valid and not expired
- Shows error if token is invalid/expired

## Security Features

1. **Token-based**: Uses secure tokens from backend
2. **Time-limited**: Tokens expire after 1 hour
3. **One-time use**: Tokens should be invalidated after use (backend)
4. **No email enumeration**: Success message shown regardless of email existence
5. **Password strength**: Minimum 8 characters required

## Testing

1. **Test Forgot Password**:
   ```
   Navigate to: http://localhost:3000/auth/forgot-password
   Enter email: test@example.com
   Check backend logs for reset token
   ```

2. **Test Reset Password**:
   ```
   Navigate to: http://localhost:3000/auth/reset-password?token=YOUR_TOKEN
   Enter new password (min 8 chars)
   Confirm password
   Submit and verify redirect to sign-in
   ```

## Error Handling

### Forgot Password
- Network errors: Shows toast notification
- Invalid email: Form validation error
- Backend errors: Generic error message

### Reset Password
- Invalid/expired token: Shows error message with link to request new token
- Password mismatch: Form validation error
- Network errors: Shows toast notification
- Backend errors: "Link may be expired" message

## Customization

### Email Template
Update your Spring Boot backend to customize the reset email:
- Email subject
- Email body content
- Reset link format
- Sender information

### Token Expiration
To change token expiration time, update your Spring Boot backend configuration.

### Password Requirements
To change password requirements, update the validation in:
- `src/features/auth/components/reset-password-form.tsx` (line 12)
- Your Spring Boot backend validation

## Integration with Backend

Make sure your Spring Boot backend:
1. Generates secure reset tokens
2. Stores tokens with expiration time
3. Sends email with reset link
4. Validates token on reset
5. Invalidates token after successful reset
6. Handles expired tokens appropriately

## Next Steps

- [ ] Configure email service in Spring Boot
- [ ] Test email delivery
- [ ] Customize email template
- [ ] Test token expiration
- [ ] Test complete flow end-to-end
- [ ] Add rate limiting for forgot password requests (backend)
- [ ] Add CAPTCHA if needed (optional)

---

**Implementation Date**: December 30, 2025  
**Status**: ✅ Complete - Ready for Testing
