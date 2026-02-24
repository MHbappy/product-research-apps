'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthService } from '@/lib/api/auth.service';
import { TokenManager } from '@/lib/auth/token-manager';
import { User } from '@/types/auth';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function OAuth2CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuth2Callback = async () => {
      const token = searchParams.get('token');
      const errorParam = searchParams.get('error');

      // Handle error from OAuth2 provider
      if (errorParam) {
        setError(errorParam);
        toast.error(`OAuth2 login failed: ${errorParam}`);
        setTimeout(() => {
          router.push('/auth/sign-in');
        }, 3000);
        return;
      }

      // Check if token is present
      if (!token) {
        setError('No token received from OAuth2 provider');
        toast.error('OAuth2 login failed: No token received');
        setTimeout(() => {
          router.push('/auth/sign-in');
        }, 3000);
        return;
      }

      try {
        // Exchange OAuth2 token for JWT tokens
        const response = await AuthService.oauth2Login({
          token,
          provider: 'google'
        });

        if (response.success && response.data) {
          const { accessToken, refreshToken, user: userData } = response.data;

          // Store tokens
          TokenManager.setAccessToken(accessToken);
          TokenManager.setRefreshToken(refreshToken);

          // Add fullName to user object and store
          const userWithFullName: User = {
            ...userData,
            fullName: `${userData.firstName} ${userData.lastName}`
          };
          TokenManager.setUser(userWithFullName);

          toast.success('Google login successful!');
          router.push('/dashboard');
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (err: unknown) {
        console.error('OAuth2 token exchange failed:', err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to complete OAuth2 login';
        setError(errorMessage);
        toast.error(`OAuth2 login failed: ${errorMessage}`);
        setTimeout(() => {
          router.push('/auth/sign-in');
        }, 3000);
      }
    };

    handleOAuth2Callback();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-semibold text-red-600'>Login Failed</h1>
          <p className='text-muted-foreground mt-2'>{error}</p>
          <p className='text-muted-foreground mt-4 text-sm'>
            Redirecting to sign-in page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center'>
      <div className='text-center'>
        <Loader2 className='mx-auto h-8 w-8 animate-spin' />
        <h1 className='mt-4 text-xl font-semibold'>Completing sign in...</h1>
        <p className='text-muted-foreground mt-2'>
          Please wait while we complete your Google sign in.
        </p>
      </div>
    </div>
  );
}

export default function OAuth2CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen flex-col items-center justify-center'>
          <Loader2 className='h-8 w-8 animate-spin' />
        </div>
      }
    >
      <OAuth2CallbackContent />
    </Suspense>
  );
}
