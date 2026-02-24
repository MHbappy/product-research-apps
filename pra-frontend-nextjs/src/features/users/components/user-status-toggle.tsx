'use client';

import * as React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { User, UserStatus } from '@/types/user.types';
import { UserService } from '@/lib/api/user.service';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface UserStatusToggleProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function UserStatusToggle({
  user,
  open,
  onOpenChange,
  onSuccess
}: UserStatusToggleProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  if (!user) return null;

  const isActive = user.status === UserStatus.ACTIVE;
  const newStatus = isActive ? UserStatus.DISABLED : UserStatus.ACTIVE;
  const action = isActive ? 'suspend' : 'activate';

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await UserService.updateUserStatus(user.id, { status: newStatus });
      toast.success(`User ${action}d successfully`, {
        description: `${user.fullName || user.email} has been ${action}d.`
      });
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating user status:', error);
      toast.error(`Failed to ${action} user`, {
        description: error.response?.data?.message || 'An error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isActive ? 'Suspend Account' : 'Activate Account'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isActive ? (
              <>
                Are you sure you want to suspend{' '}
                <strong>{user.fullName || user.email}</strong>? This will
                prevent the user from logging in until their account is
                reactivated.
              </>
            ) : (
              <>
                Are you sure you want to activate{' '}
                <strong>{user.fullName || user.email}</strong>? This will allow
                the user to log in to their account.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={
              isActive
                ? 'bg-destructive hover:bg-destructive/90'
                : 'bg-green-600 hover:bg-green-600/90'
            }
          >
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {isActive ? 'Suspend Account' : 'Activate Account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
