import { createAdminEntity } from '@/shared/lib/admin/admin-generator';
import { badgeSchema } from './badge.schema';
import { badgeService } from './badge.mock';

export const BadgeAdminConfig = createAdminEntity('Badge', badgeSchema, {
  description: 'Gérez vos badges',
  icon: '🏅',
  actions: { create: true, read: true, update: true, delete: true, bulk: false },
  services: badgeService,
  queryKey: ['badges'],
});
