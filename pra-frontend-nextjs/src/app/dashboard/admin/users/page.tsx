import { Metadata } from 'next';
import { UserTable } from '@/features/users/components/user-table';

export const metadata: Metadata = {
  title: 'User Management | Admin Dashboard',
  description: 'Manage user accounts, permissions, and access'
};

export default function UsersPage() {
  return (
    <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>User Management</h2>
          <p className='text-muted-foreground'>
            Manage user accounts, view details, and control access permissions
          </p>
        </div>
      </div>
      <UserTable />
    </div>
  );
}
