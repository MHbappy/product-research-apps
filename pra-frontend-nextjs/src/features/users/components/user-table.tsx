'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User } from '@/types/user.types';
import { UserService } from '@/lib/api/user.service';
import { createUserColumns } from './user-table-columns';
import { UserDetailsDialog } from './user-details-dialog';
import { UserStatusToggle } from './user-status-toggle';
import { UserChangePasswordDialog } from './user-change-password-dialog';
import { CreateUserDialog } from './create-user-dialog';
import { VerifyUserDialog } from './verify-user-dialog';
import { UpdateRolesDialog } from './update-roles-dialog';
import { UserPaymentHistoryDialog } from './user-payment-history-dialog';
import { toast } from 'sonner';

import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  UserPlus
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';

export function UserTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useQueryState('search', { defaultValue: '' });
  const [page, setPage] = useQueryState('page', { defaultValue: '0' });

  const [users, setUsers] = React.useState<User[]>([]);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalElements, setTotalElements] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [statusToggleOpen, setStatusToggleOpen] = React.useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = React.useState(false);
  const [createUserOpen, setCreateUserOpen] = React.useState(false);
  const [verifyUserOpen, setVerifyUserOpen] = React.useState(false);
  const [updateRolesOpen, setUpdateRolesOpen] = React.useState(false);
  const [paymentHistoryOpen, setPaymentHistoryOpen] = React.useState(false);

  const currentPage = parseInt(page);

  const fetchUsers = React.useCallback(async () => {
    setIsLoading(true);
    try {
      let response;
      if (search && search.trim()) {
        response = await UserService.searchUsers(search, currentPage, 10);
      } else {
        response = await UserService.getUsers(currentPage, 10);
      }

      setUsers(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users', {
        description: error.response?.data?.message || 'An error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  }, [search, currentPage]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

  const handleToggleStatus = (user: User) => {
    setSelectedUser(user);
    setStatusToggleOpen(true);
  };

  const handleChangePassword = (user: User) => {
    setSelectedUser(user);
    setChangePasswordOpen(true);
  };

  const handleVerifyUser = (user: User) => {
    setSelectedUser(user);
    setVerifyUserOpen(true);
  };

  const handleUpdateRoles = (user: User) => {
    setSelectedUser(user);
    setUpdateRolesOpen(true);
  };

  const handleViewPaymentHistory = (user: User) => {
    setSelectedUser(user);
    setPaymentHistoryOpen(true);
  };

  const handleStatusUpdateSuccess = () => {
    fetchUsers();
  };

  const columns = React.useMemo(
    () =>
      createUserColumns({
        onViewDetails: handleViewDetails,
        onToggleStatus: handleToggleStatus,
        onChangePassword: handleChangePassword,
        onVerifyUser: handleVerifyUser,
        onUpdateRoles: handleUpdateRoles,
        onViewPaymentHistory: handleViewPaymentHistory
      }),
    []
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage('0'); // Reset to first page on search
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setPage(String(currentPage - 1));
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setPage(String(currentPage + 1));
    }
  };

  return (
    <div className='space-y-4'>
      {/* Header with Search and Create Button */}
      <div className='flex items-center justify-between gap-2'>
        <div className='relative max-w-sm flex-1'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
          <Input
            placeholder='Search users by name or email...'
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className='pl-9'
          />
        </div>
        <Button onClick={() => setCreateUserOpen(true)}>
          <UserPlus className='mr-2 h-4 w-4' />
          Create User
        </Button>
      </div>

      {/* Table */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  <div className='flex items-center justify-center gap-2'>
                    <Loader2 className='h-5 w-5 animate-spin' />
                    <span>Loading users...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-between'>
        <p className='text-muted-foreground text-sm'>
          Showing {users.length} of {totalElements} users
        </p>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={handlePreviousPage}
            disabled={currentPage === 0 || isLoading}
          >
            <ChevronLeft className='mr-1 h-4 w-4' />
            Previous
          </Button>
          <span className='text-sm'>
            Page {currentPage + 1} of {totalPages || 1}
          </span>
          <Button
            variant='outline'
            size='sm'
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1 || isLoading}
          >
            Next
            <ChevronRight className='ml-1 h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <UserDetailsDialog
        user={selectedUser}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
      <UserStatusToggle
        user={selectedUser}
        open={statusToggleOpen}
        onOpenChange={setStatusToggleOpen}
        onSuccess={handleStatusUpdateSuccess}
      />
      <UserChangePasswordDialog
        user={selectedUser}
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
        onSuccess={handleStatusUpdateSuccess}
      />
      <CreateUserDialog
        open={createUserOpen}
        onOpenChange={setCreateUserOpen}
        onSuccess={handleStatusUpdateSuccess}
      />
      <VerifyUserDialog
        user={selectedUser}
        open={verifyUserOpen}
        onOpenChange={setVerifyUserOpen}
        onSuccess={handleStatusUpdateSuccess}
      />
      <UpdateRolesDialog
        user={selectedUser}
        open={updateRolesOpen}
        onOpenChange={setUpdateRolesOpen}
        onSuccess={handleStatusUpdateSuccess}
      />
      <UserPaymentHistoryDialog
        user={selectedUser}
        open={paymentHistoryOpen}
        onOpenChange={setPaymentHistoryOpen}
      />
    </div>
  );
}
