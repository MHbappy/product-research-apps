import { z } from 'zod';
import { UserStatus } from '@/types/user.types';

/**
 * Schema for updating user status
 */
export const updateUserStatusSchema = z.object({
  status: z.nativeEnum(UserStatus)
});

export type UpdateUserStatusFormData = z.infer<typeof updateUserStatusSchema>;
