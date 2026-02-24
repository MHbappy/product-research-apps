'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import GoogleSignInButton from './google-auth-button';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function SignInForm() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    // Prevent multiple submissions
    if (isLoading) {
      console.log('Already loading, preventing duplicate submission');
      return;
    }

    console.log('=== Login attempt started ===');
    try {
      setIsLoading(true);
      console.log('Calling login function...');
      const result = await login(data);
      console.log('Login result:', result);

      // Check if login failed - show toast for API errors with longer duration
      if (result && !result.success && result.error) {
        console.log('Login failed with error:', result.error);
        toast.error(result.error, {
          duration: 5000 // Show for 5 seconds
        });
        console.log('Toast shown, stopping execution');
        return; // Stop execution, don't navigate
      }

      // If result is undefined or success is not explicitly true, also show error
      if (!result || result.success !== true) {
        console.log('Login failed - undefined or not successful result');
        toast.error('Login failed. Please try again.', {
          duration: 5000
        });
        return;
      }

      console.log('Login successful, should navigate to dashboard');
    } catch (error: any) {
      console.error('Login error caught:', error);
      // Fallback error handling - show toast with longer duration
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Invalid email or password. Please try again.';
      console.log('Showing error toast:', errorMessage);
      toast.error(errorMessage, {
        duration: 5000 // Show for 5 seconds
      });
    } finally {
      console.log('Setting isLoading to false');
      setIsLoading(false);
      console.log('=== Login attempt ended ===');
    }
  };

  // Wrapper to ensure preventDefault is called
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Form submit event intercepted');
    form.handleSubmit(onSubmit)(e);
  };

  return (
    <div className='w-full space-y-6'>
      <div className='space-y-2 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>
        <p className='text-muted-foreground text-sm'>
          Enter your email and password to sign in
        </p>
      </div>

      {/* Google OAuth Button */}
      <GoogleSignInButton />

      {/* Divider */}
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background text-muted-foreground px-2'>
            Or continue with email
          </span>
        </div>
      </div>

      <FormProvider {...form}>
        <form onSubmit={handleFormSubmit} className='space-y-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='name@example.com'
                    autoComplete='email'
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center justify-between'>
                  <FormLabel>Password</FormLabel>
                  <Link
                    href='/auth/forgot-password'
                    className='text-muted-foreground hover:text-primary text-sm underline-offset-4 hover:underline'
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Enter your password'
                    autoComplete='current-password'
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Sign In
          </Button>
        </form>
      </FormProvider>

      <div className='text-center text-sm'>
        <span className='text-muted-foreground'>
          Don&apos;t have an account?{' '}
        </span>
        <Link
          href='/auth/sign-up'
          className='hover:text-primary underline underline-offset-4'
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
