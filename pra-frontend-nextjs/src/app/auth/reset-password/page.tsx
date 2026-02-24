'use client';

import ResetPasswordView from '@/features/auth/components/reset-password-view';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  if (!token) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='space-y-4 text-center'>
          <h1 className='text-2xl font-bold'>Invalid Reset Link</h1>
          <p className='text-muted-foreground'>
            This password reset link is invalid or has expired.
          </p>
          <a href='/auth/forgot-password' className='text-primary underline'>
            Request a new reset link
          </a>
        </div>
      </div>
    );
  }

  return <ResetPasswordView stars={1000} token={token} />;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
