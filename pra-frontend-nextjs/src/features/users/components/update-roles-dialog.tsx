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
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Role } from '@/types/user.types';
import { UserService } from '@/lib/api/user.service';
import { toast } from 'sonner';
import { Loader2, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  updateRolesSchema,
  type UpdateRolesFormData
} from '../schemas/update-roles.schema';

interface UpdateRolesDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function UpdateRolesDialog({
  user,
  open,
  onOpenChange,
  onSuccess
}: UpdateRolesDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [fetchingRoles, setFetchingRoles] = React.useState(false);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<UpdateRolesFormData>({
    resolver: zodResolver(updateRolesSchema),
    defaultValues: {
      roles: []
    }
  });

  const selectedRoles = watch('roles');

  // Fetch roles and set user's current roles when dialog opens
  React.useEffect(() => {
    if (open && user) {
      fetchRoles();
      setValue('roles', user.roles);
    } else {
      reset();
    }
  }, [open, user, reset, setValue]);

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

  const onSubmit = async (data: UpdateRolesFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      await UserService.updateUserRoles(user.id, { roles: data.roles });

      toast.success('Roles updated successfully', {
        description: `Updated roles for ${user.fullName || user.email}`
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating roles:', error);
      toast.error('Failed to update roles', {
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Shield className='h-5 w-5' />
              Change User Roles
            </DialogTitle>
            <DialogDescription>
              Update role assignments for{' '}
              <strong>{user.fullName || user.email}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label>
                Roles <span className='text-destructive'>*</span>
              </Label>
              {fetchingRoles ? (
                <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Loading roles...
                </div>
              ) : (
                <div className='space-y-3'>
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className='hover:bg-accent/50 flex items-center space-x-2 rounded-md border p-3 transition-colors'
                    >
                      <Checkbox
                        id={`role-${role.id}`}
                        checked={selectedRoles?.includes(role.name)}
                        onCheckedChange={() => toggleRole(role.name)}
                        disabled={isLoading}
                      />
                      <Label
                        htmlFor={`role-${role.id}`}
                        className='flex-1 cursor-pointer text-sm font-medium'
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

            {selectedRoles && selectedRoles.length > 0 && (
              <div className='bg-muted rounded-md p-3 text-sm'>
                <p className='mb-1 font-medium'>Selected roles:</p>
                <p className='text-muted-foreground text-xs'>
                  {selectedRoles.map((r) => r.replace('ROLE_', '')).join(', ')}
                </p>
              </div>
            )}
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
              Update Roles
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
