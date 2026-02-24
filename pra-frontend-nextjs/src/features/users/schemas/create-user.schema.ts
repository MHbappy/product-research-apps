import { z } from 'zod';
import { UserStatus } from '@/types/user.types';

/**
 * Schema for creating a new user (Admin only)
 */
export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  roles: z.array(z.string()).min(1, 'Select at least one role'),
  status: z.nativeEnum(UserStatus)
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
