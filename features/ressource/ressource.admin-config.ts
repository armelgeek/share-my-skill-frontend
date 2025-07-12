import { createAdminEntity } from '@/shared/lib/admin/admin-generator';
import { ressourceSchema } from './ressource.schema';
import { ressourceService } from './ressource.mock';

export const RessourceAdminConfig = createAdminEntity('Ressource', ressourceSchema, {
  description: 'Gérez vos ressources',
  icon: '📚',
  actions: { create: true, read: true, update: true, delete: true, bulk: false },
  services: ressourceService,
  queryKey: ['ressources'],
});
