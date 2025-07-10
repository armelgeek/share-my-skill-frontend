import { z } from 'zod';
import { createField } from '@/shared/lib/admin/admin-generator';

export const UserSchema = z.object({
  email: createField.email(),
  name: createField.string(),
  avatar: createField.image(),
  role: createField.select(['user', 'admin', 'moderator']),
  isActive: createField.boolean(),
  createdAt: createField.date(),
  updatedAt: createField.date(),
});

export type User = z.infer<typeof UserSchema>;
