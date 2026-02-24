'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Upload } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

// Define the form schema
const profileFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  avatarUrl: z.string().optional()
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  const { user, mutate } = useUser();
  const [isUploading, setIsUploading] = React.useState(false);

  console.log('User avatar URL:', user?.avatarUrl);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      avatarUrl: user?.avatarUrl || ''
    }
  });

  // Reset form when user data loads
  React.useEffect(() => {
    if (user) {
      console.log('User avatar URL:', user.avatarUrl);
      form.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        avatarUrl: user.avatarUrl || ''
      });
    }
  }, [user, form]);

  async function onSubmit(data: ProfileFormValues) {
    try {
      await apiClient.put('/profile', data);
      await mutate(); // Refresh user data
      toast.success('Profile updated', {
        description: 'Your profile has been updated successfully.'
      });
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to update profile.'
      });
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', {
        description: 'Please upload an image file (JPEG, PNG, etc.)'
      });
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Image size should be less than 5MB'
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Assuming existing file upload endpoint
      const response = await apiClient.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Use result data structure based on typical API response
      // Adjust according to actual response structure from FileController
      const fileUrl = response.data.data.fileUrl;

      form.setValue('avatarUrl', fileUrl);

      toast.info('Avatar uploaded', {
        description: 'Please save changes to update your profile.'
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed', {
        description: 'Failed to upload avatar image.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Form
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      className='space-y-8'
    >
      <FormField
        control={form.control}
        name='avatarUrl'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Profile Picture</FormLabel>
            <FormControl>
              <div className='flex items-center gap-6'>
                <Avatar className='h-24 w-24'>
                  {field.value && <AvatarImage src={field.value} />}
                  <AvatarFallback className='text-lg'>
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className='flex flex-col gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className='relative'
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className='mr-2 h-4 w-4' />
                        Upload new picture
                      </>
                    )}
                    <input
                      type='file'
                      className='absolute inset-0 cursor-pointer opacity-0'
                      accept='image/*'
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </Button>
                  <p className='text-muted-foreground text-xs'>
                    JPG, GIF or PNG. Max size of 5MB.
                  </p>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className='grid gap-4 md:grid-cols-2'>
        <FormField
          control={form.control}
          name='firstName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder='John' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='lastName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder='Doe' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Button type='submit' disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting && (
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        )}
        Save Changes
      </Button>
    </Form>
  );
}
