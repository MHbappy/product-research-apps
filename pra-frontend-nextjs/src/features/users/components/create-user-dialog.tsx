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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { UserService } from '@/lib/api/user.service';
import { toast } from 'sonner';
import { Loader2, UserPlus } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createUserSchema,
  type CreateUserFormData
} from '../schemas/create-user.schema';
import { UserStatus, Role } from '@/types/user.types';

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateUserDialog({
  open,
  onOpenChange,
  onSuccess
}: CreateUserDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [fetchingRoles, setFetchingRoles] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      roles: [],
      status: UserStatus.ACTIVE
    }
  });

  const selectedRoles = watch('roles');

  // Fetch roles when dialog opens
  React.useEffect(() => {
    if (open) {
      fetchRoles();
    } else {
      reset();
    }
  }, [open, reset]);

  const fetchRoles = async () => {
    setFetchingRoles(true);
    try {
      const response = await UserService.getAllRoles();
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to fetch roles');
    } finally {
      setFetchingRoles(false);
    }
  };

  const toggleRole = (roleName: string) => {
    const currentRoles = selectedRoles || [];
    if (currentRoles.includes(roleName)) {
      setValue(
        'roles',
        currentRoles.filter((r) => r !== roleName)
      );
    } else {
      setValue('roles', [...currentRoles, roleName]);
    }
  };

  const onSubmit = async (data: CreateUserFormData) => {
    setIsLoading(true);
    try {
      await UserService.createUser(data);

      toast.success('User created successfully', {
        description: `${data.firstName} ${data.lastName} has been created`
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user', {
        description: error.response?.data?.message || 'An error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[500px]'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <UserPlus className='h-5 w-5' />
              Create New User
            </DialogTitle>
            <DialogDescription>
              Create a new user account with admin privileges
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            {/* Email */}
            <div className='grid gap-2'>
              <Label htmlFor='email'>
                Email <span className='text-destructive'>*</span>
              </Label>
              <Input
                id='email'
                type='email'
                {...register('email')}
                disabled={isLoading}
                placeholder='user@example.com'
              />
              {errors.email && (
                <p className='text-destructive text-sm'>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* First Name */}
            <div className='grid gap-2'>
              <Label htmlFor='firstName'>
                First Name <span className='text-destructive'>*</span>
              </Label>
              <Input
                id='firstName'
                {...register('firstName')}
                disabled={isLoading}
                placeholder='John'
              />
              {errors.firstName && (
                <p className='text-destructive text-sm'>
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className='grid gap-2'>
              <Label htmlFor='lastName'>
                Last Name <span className='text-destructive'>*</span>
              </Label>
              <Input
                id='lastName'
                {...register('lastName')}
                disabled={isLoading}
                placeholder='Doe'
              />
              {errors.lastName && (
                <p className='text-destructive text-sm'>
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Roles */}
            <div className='grid gap-2'>
              <Label>
                Roles <span className='text-destructive'>*</span>
              </Label>
              {fetchingRoles ? (
                <p className='text-muted-foreground text-sm'>
                  Loading roles...
                </p>
              ) : (
                <div className='space-y-2'>
                  {roles.map((role) => (
                    <div key={role.id} className='flex items-center space-x-2'>
                      <Checkbox
                        id={`role-${role.id}`}
                        checked={selectedRoles?.includes(role.name)}
                        onCheckedChange={() => toggleRole(role.name)}
                        disabled={isLoading}
                      />
                      <Label
                        htmlFor={`role-${role.id}`}
                        className='cursor-pointer text-sm font-normal'
                      >
                        {role.name.replace('ROLE_', '')}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
              {errors.roles && (
                <p className='text-destructive text-sm'>
                  {errors.roles.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className='grid gap-2'>
              <Label htmlFor='status'>
                Initial Status <span className='text-destructive'>*</span>
              </Label>
              <Controller
                name='status'
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger id='status'>
                      <SelectValue placeholder='Select status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
                      <SelectItem value={UserStatus.PENDING_VERIFICATION}>
                        Pending Verification
                      </SelectItem>
                      <SelectItem value={UserStatus.DISABLED}>
                        Disabled
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className='text-destructive text-sm'>
                  {errors.status.message}
                </p>
              )}
            </div>

            {/* Info Note */}
            <div className='bg-muted text-muted-foreground rounded-md p-3 text-sm'>
              <p className='mb-1 font-medium'>Note:</p>
              <p className='text-xs'>
                A temporary password will be auto-generated and should be sent
                to the user via email (feature coming soon).
              </p>
            </div>
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
            <Button type='submit' disabled={isLoading || fetchingRoles}>
              {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Create User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
