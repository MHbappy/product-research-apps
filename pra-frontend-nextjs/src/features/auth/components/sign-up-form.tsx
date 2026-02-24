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

const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignUpForm() {
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setIsLoading(true);
      const result = await signup({
        ...data,
        lastName: data.lastName || ''
      });

      // Check if signup failed - show toast with longer duration
      if (result && !result.success && result.error) {
        toast.error(result.error, {
          duration: 5000 // Show for 5 seconds
        });
        return; // Stop execution, don't navigate
      }

      // If result is undefined or success is not explicitly true, also show error
      if (!result || result.success !== true) {
        toast.error('Signup failed. Please try again.', {
          duration: 5000
        });
        return;
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      // Fallback error handling - show toast with longer duration
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Signup failed. Please try again.';
      toast.error(errorMessage, {
        duration: 5000 // Show for 5 seconds
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full space-y-6'>
      <div className='space-y-2 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight'>
          Create an account
        </h1>
        <p className='text-muted-foreground text-sm'>
          Enter your details below to create your account
        </p>
      </div>

      {error && (
        <div className='bg-destructive/15 text-destructive rounded-md p-3 text-sm'>
          <p className='font-medium'>Error</p>
          <p>{error}</p>
        </div>
      )}

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='John'
                      autoComplete='given-name'
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
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Doe'
                      autoComplete='family-name'
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Create a strong password'
                    autoComplete='new-password'
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
            Create Account
          </Button>
        </form>
      </FormProvider>

      <div className='text-center text-sm'>
        <span className='text-muted-foreground'>Already have an account? </span>
        <Link
          href='/auth/sign-in'
          className='hover:text-primary underline underline-offset-4'
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
