'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/use-user';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import ChangePasswordForm from './change-password-form';
import ProfileForm from './profile-form';
import { cn } from '@/lib/utils';
import { User, Lock, Settings, UserCircle } from 'lucide-react';

type Tab = 'profile' | 'security';

export default function ProfileViewPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const menuItems = [
    {
      id: 'profile',
      label: 'Public profile',
      icon: UserCircle
    },
    {
      id: 'security',
      label: 'Password and authentication',
      icon: Lock
    }
  ];

  return (
    <div className='flex w-full flex-col gap-6 p-4 lg:flex-row lg:gap-10'>
      {/* Sidebar Navigation */}
      <aside className='w-full lg:w-1/4'>
        <nav className='flex flex-col space-y-1'>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors',
                activeTab === item.id
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              )}
            >
              <item.icon className='h-4 w-4' />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className='flex-1'>
        {activeTab === 'profile' && (
          <div className='space-y-6'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                Public profile
              </h2>
              <p className='text-muted-foreground'>
                Manage how you are seen by others.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and public profile information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'security' && (
          <div className='space-y-6'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                Password and authentication
              </h2>
              <p className='text-muted-foreground'>
                Manage your password and security settings.
              </p>
            </div>
            <ChangePasswordForm />
          </div>
        )}
      </main>
    </div>
  );
}
