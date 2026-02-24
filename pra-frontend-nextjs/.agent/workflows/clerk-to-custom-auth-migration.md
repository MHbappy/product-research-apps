---
description: Migrate from Clerk to Custom Spring Boot Authentication
---

# Migration Plan: Clerk to Custom Spring Boot Auth

## Overview
This workflow guides the complete migration from Clerk authentication to a custom JWT-based authentication system using your Spring Boot API.

## Phase 1: Setup Authentication Infrastructure

### 1.1 Create Environment Variables
Create `.env.local` file with:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_API_VERSION=v1
```

### 1.2 Install Required Dependencies
```bash
npm install axios js-cookie
npm install --save-dev @types/js-cookie
```

### 1.3 Create Auth Types
- Create `src/types/auth.ts` with TypeScript interfaces for:
  - User
  - AuthResponse
  - LoginRequest
  - SignupRequest
  - TokenResponse

### 1.4 Create API Service
- Create `src/lib/api/client.ts` - Axios instance with interceptors
- Create `src/lib/api/auth.service.ts` - Auth API methods

### 1.5 Create Token Management
- Create `src/lib/auth/token-manager.ts` - Token storage and refresh logic

## Phase 2: Create Auth Context and Hooks

### 2.1 Create Auth Context
- Create `src/contexts/auth-context.tsx` with:
  - User state management
  - Login/logout/signup methods
  - Token refresh logic
  - Loading states

### 2.2 Create Custom Hooks
- Create `src/hooks/use-auth.ts` - useAuth hook
- Create `src/hooks/use-user.ts` - useUser hook (replaces Clerk's useUser)

## Phase 3: Create Custom Auth Components

### 3.1 Create Sign In Form
- Create `src/features/auth/components/sign-in-form.tsx`
- Replace Clerk's SignIn component
- Implement email/password validation
- Add error handling

### 3.2 Create Sign Up Form
- Create `src/features/auth/components/sign-up-form.tsx`
- Replace Clerk's SignUp component
- Implement form validation with Zod
- Add error handling

### 3.3 Create OAuth Buttons (Optional)
- Create `src/features/auth/components/oauth-buttons.tsx`
- Implement Google/GitHub/Facebook OAuth

### 3.4 Update Auth Views
- Update `src/features/auth/components/sign-in-view.tsx`
- Update `src/features/auth/components/sign-up-view.tsx`

## Phase 4: Create Middleware and Route Protection

### 4.1 Create Middleware
- Create `middleware.ts` in project root
- Implement JWT token verification
- Add route protection logic
- Handle token refresh

### 4.2 Create Protected Route Component
- Create `src/components/auth/protected-route.tsx`
- Wrap protected pages

## Phase 5: Update Application Components

### 5.1 Update Providers
- Update `src/components/layout/providers.tsx`
- Replace ClerkProvider with AuthProvider

### 5.2 Update User Navigation
- Update `src/components/layout/user-nav.tsx`
- Replace Clerk hooks with custom hooks
- Update SignOutButton logic

### 5.3 Update App Sidebar
- Update `src/components/layout/app-sidebar.tsx`
- Replace useUser hook

### 5.4 Update Other Components
- Update `src/hooks/use-nav.ts`
- Update `src/components/org-switcher.tsx` (if needed)
- Update any other files using Clerk hooks

## Phase 6: Remove Clerk Dependencies

### 6.1 Uninstall Clerk Packages
```bash
npm uninstall @clerk/nextjs @clerk/themes
```

### 6.2 Remove Clerk Files
- Delete `.clerk` directory
- Delete `docs/clerk_setup.md`

### 6.3 Update Environment Variables
- Remove Clerk-related variables from `.env.local`
- Update `env.example.txt`

## Phase 7: Testing and Validation

### 7.1 Test Authentication Flow
- Test sign up
- Test email verification
- Test sign in
- Test token refresh
- Test logout

### 7.2 Test Protected Routes
- Test middleware protection
- Test unauthorized access
- Test token expiration handling

### 7.3 Test User Session
- Test session persistence
- Test cross-tab synchronization

## Phase 8: Additional Features (Optional)

### 8.1 Forgot Password Flow
- Create forgot password form
- Create reset password form

### 8.2 Email Verification
- Create email verification page
- Handle verification token

### 8.3 OAuth Integration
- Implement OAuth redirect handling
- Create OAuth callback pages

## Notes
- Keep backup of original Clerk implementation
- Test thoroughly in development before deploying
- Update API base URL for production
- Implement proper error handling and user feedback
- Consider implementing refresh token rotation
- Add rate limiting on client side if needed
