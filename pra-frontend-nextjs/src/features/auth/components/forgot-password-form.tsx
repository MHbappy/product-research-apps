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
import { AuthService } from '@/lib/api/auth.service';
import Link from 'next/link';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setIsLoading(true);
      await AuthService.forgotPassword(data.email);
      setIsSuccess(true);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className='w-full space-y-6'>
        <div className='space-y-2 text-center'>
          <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900'>
            <CheckCircle2 className='h-6 w-6 text-green-600 dark:text-green-400' />
          </div>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Check your email
          </h1>
          <p className='text-muted-foreground text-sm'>
            We've sent a password reset link to{' '}
            <strong>{form.getValues('email')}</strong>
          </p>
        </div>

        <div className='space-y-4'>
          <p className='text-muted-foreground text-center text-sm'>
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <Button
            variant='outline'
            className='w-full'
            onClick={() => {
              setIsSuccess(false);
              form.reset();
            }}
          >
            Try another email
          </Button>
        </div>

        <div className='text-center text-sm'>
          <Link
            href='/auth/sign-in'
            className='hover:text-primary underline underline-offset-4'
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full space-y-6'>
      <div className='space-y-2 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight'>
          Forgot password?
        </h1>
        <p className='text-muted-foreground text-sm'>
          Enter your email address and we'll send you a link to reset your
          password
        </p>
      </div>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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

          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Send reset link
          </Button>
        </form>
      </FormProvider>

      <div className='text-center text-sm'>
        <Link
          href='/auth/sign-in'
          className='hover:text-primary underline underline-offset-4'
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
