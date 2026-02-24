import { z } from 'zod';

/**
 * Schema for updating user roles (Admin only)
 */
export const updateRolesSchema = z.object({
  roles: z.array(z.string()).min(1, 'Select at least one role')
});

export type UpdateRolesFormData = z.infer<typeof updateRolesSchema>;
