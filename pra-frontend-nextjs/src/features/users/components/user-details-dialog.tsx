'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { User, UserStatus } from '@/types/user.types';
import { format } from 'date-fns';
import { CheckCircle, Mail, Calendar, Shield, Lock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface UserDetailsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusColor = (status: UserStatus): string => {
  switch (status) {
    case UserStatus.ACTIVE:
      return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
    case UserStatus.DISABLED:
      return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
    case UserStatus.LOCKED:
      return 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20';
    case UserStatus.PENDING_VERIFICATION:
      return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
    case UserStatus.DELETED:
      return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
  }
};

export function UserDetailsDialog({
  user,
  open,
  onOpenChange
}: UserDetailsDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Detailed information about {user.fullName || user.email}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Basic Information */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold'>Basic Information</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='text-muted-foreground text-sm'>User ID</label>
                <p className='font-medium'>#{user.id}</p>
              </div>
              <div>
                <label className='text-muted-foreground text-sm'>Email</label>
                <div className='flex items-center gap-2'>
                  <Mail className='text-muted-foreground h-4 w-4' />
                  <p className='font-medium'>{user.email}</p>
                </div>
              </div>
              <div>
                <label className='text-muted-foreground text-sm'>
                  First Name
                </label>
                <p className='font-medium'>{user.firstName || 'N/A'}</p>
              </div>
              <div>
                <label className='text-muted-foreground text-sm'>
                  Last Name
                </label>
                <p className='font-medium'>{user.lastName || 'N/A'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Account Status */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold'>Account Status</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='text-muted-foreground text-sm'>Status</label>
                <div className='mt-1'>
                  <Badge className={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                </div>
              </div>
              <div>
                <label className='text-muted-foreground text-sm'>
                  Email Verified
                </label>
                <div className='mt-1 flex items-center gap-2'>
                  {user.emailVerified ? (
                    <Badge className='bg-green-500/10 text-green-500'>
                      <CheckCircle className='mr-1 h-3 w-3' />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant='destructive'>Not Verified</Badge>
                  )}
                </div>
              </div>
              <div>
                <label className='text-muted-foreground text-sm'>
                  Auth Provider
                </label>
                <div className='mt-1'>
                  <Badge variant='outline'>
                    <Lock className='mr-1 h-3 w-3' />
                    {user.provider}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Roles */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold'>Roles & Permissions</h3>
            <div>
              <label className='text-muted-foreground text-sm'>
                Assigned Roles
              </label>
              <div className='mt-2 flex flex-wrap gap-2'>
                {user.roles.map((role) => (
                  <Badge key={role} variant='secondary'>
                    <Shield className='mr-1 h-3 w-3' />
                    {role.replace('ROLE_', '')}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Timestamps */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold'>Timestamps</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='text-muted-foreground text-sm'>
                  Created At
                </label>
                <div className='mt-1 flex items-center gap-2'>
                  <Calendar className='text-muted-foreground h-4 w-4' />
                  <p className='text-sm'>
                    {format(new Date(user.createdAt), 'PPpp')}
                  </p>
                </div>
              </div>
              <div>
                <label className='text-muted-foreground text-sm'>
                  Last Updated
                </label>
                <div className='mt-1 flex items-center gap-2'>
                  <Calendar className='text-muted-foreground h-4 w-4' />
                  <p className='text-sm'>
                    {format(new Date(user.updatedAt), 'PPpp')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
