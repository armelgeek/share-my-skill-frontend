import { createAdminEntity } from '@/shared/lib/admin/admin-generator';
import { evenementSchema } from './evenement.schema';
import { evenementService } from './evenement.mock';

export const EvenementAdminConfig = createAdminEntity('Événement', evenementSchema, {
  description: 'Gérez vos événements (conférences, ateliers, etc.)',
  icon: '📅',
  actions: { create: true, read: true, update: true, delete: true, bulk: false },
  services: evenementService,
  queryKey: ['evenements'],
});
