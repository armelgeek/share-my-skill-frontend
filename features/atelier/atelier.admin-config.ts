import { createAdminEntity } from '@/shared/lib/admin/admin-generator';
import { atelierSchema } from './atelier.schema';
import { atelierService } from './atelier.mock';

export const AtelierAdminConfig = createAdminEntity('Atelier', atelierSchema, {
  description: 'Gérez vos ateliers',
  icon: '🛠️',
  actions: { create: true, read: true, update: true, delete: true, bulk: false },
  services: atelierService,
  queryKey: ['ateliers'],
});
