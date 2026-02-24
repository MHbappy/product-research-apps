'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { User, UserStatus } from '@/types/user.types';
import {
  MoreHorizontal,
  Eye,
  Ban,
  CheckCircle,
  Key,
  Shield,
  BadgeCheck,
  CreditCard
} from 'lucide-react';
import { format } from 'date-fns';

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

interface UserColumnProps {
  onViewDetails: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onChangePassword: (user: User) => void;
  onVerifyUser: (user: User) => void;
  onUpdateRoles: (user: User) => void;
  onViewPaymentHistory: (user: User) => void;
}

export const createUserColumns = ({
  onViewDetails,
  onToggleStatus,
  onChangePassword,
  onVerifyUser,
  onUpdateRoles,
  onViewPaymentHistory
}: UserColumnProps): ColumnDef<User>[] => [
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <div className='flex flex-col gap-1'>
        <span className='font-medium'>{row.original.email}</span>
        {row.original.emailVerified && (
          <Badge variant='outline' className='w-fit text-xs'>
            <CheckCircle className='mr-1 h-3 w-3' />
            Verified
          </Badge>
        )}
      </div>
    )
  },
  {
    accessorKey: 'fullName',
    header: 'Full Name',
    cell: ({ row }) => (
      <span className='font-medium'>{row.original.fullName || 'N/A'}</span>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge className={getStatusColor(row.original.status)}>
        {row.original.status}
      </Badge>
    )
  },
  {
    accessorKey: 'roles',
    header: 'Roles',
    cell: ({ row }) => (
      <div className='flex flex-wrap gap-1'>
        {row.original.roles.map((role) => (
          <Badge key={role} variant='secondary' className='text-xs'>
            {role.replace('ROLE_', '')}
          </Badge>
        ))}
      </div>
    )
  },
  {
    accessorKey: 'provider',
    header: 'Provider',
    cell: ({ row }) => (
      <Badge variant='outline' className='text-xs'>
        {row.original.provider}
      </Badge>
    )
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => (
      <span className='text-muted-foreground text-sm'>
        {format(new Date(row.original.createdAt), 'MMM dd, yyyy')}
      </span>
    )
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewDetails(user)}>
              <Eye className='mr-2 h-4 w-4' />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChangePassword(user)}>
              <Key className='mr-2 h-4 w-4' />
              Change Password
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewPaymentHistory(user)}>
              <CreditCard className='mr-2 h-4 w-4' />
              Payment History
            </DropdownMenuItem>
            {user.status === UserStatus.PENDING_VERIFICATION && (
              <DropdownMenuItem onClick={() => onVerifyUser(user)}>
                <BadgeCheck className='mr-2 h-4 w-4' />
                Verify User
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onUpdateRoles(user)}>
              <Shield className='mr-2 h-4 w-4' />
              Change Roles
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onToggleStatus(user)}>
              {user.status === UserStatus.ACTIVE ? (
                <>
                  <Ban className='mr-2 h-4 w-4' />
                  Suspend Account
                </>
              ) : (
                <>
                  <CheckCircle className='mr-2 h-4 w-4' />
                  Activate Account
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
