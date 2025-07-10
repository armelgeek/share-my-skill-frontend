import { createAdminEntity } from '@/shared/lib/admin/admin-generator';
import { UserSchema } from './user.schema';
import { userService } from './user.mock';

export const UserAdminConfig = createAdminEntity('Utilisateur', UserSchema, {
  description: 'Gérez vos utilisateurs',
  icon: '👤',
  actions: { create: true, read: true, update: true, delete: true, bulk: false },
  services: userService,
  queryKey: ['users'],
});
