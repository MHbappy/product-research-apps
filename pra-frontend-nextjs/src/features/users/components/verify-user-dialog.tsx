'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from '@/types/user.types';
import { UserService } from '@/lib/api/user.service';
import { toast } from 'sonner';
import { Loader2, CheckCircle } from 'lucide-react';

interface VerifyUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function VerifyUserDialog({
  user,
  open,
  onOpenChange,
  onSuccess
}: VerifyUserDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleVerify = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await UserService.verifyUser(user.id);

      toast.success('User verified successfully', {
        description: `${user.fullName || user.email} is now active`
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error verifying user:', error);
      toast.error('Failed to verify user', {
        description: error.response?.data?.message || 'An error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <CheckCircle className='h-5 w-5 text-green-500' />
            Verify User
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to verify{' '}
            <strong>{user.fullName || user.email}</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className='py-4'>
          <p className='text-muted-foreground text-sm'>
            This will change the user's status from{' '}
            <strong>PENDING_VERIFICATION</strong> to <strong>ACTIVE</strong> and
            mark their email as verified.
          </p>
        </div>

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleVerify} disabled={isLoading}>
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Verify User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
