import { createAdminEntity } from '@/shared/lib/admin/admin-generator';
import { groupeSchema } from './groupe.schema';
import { groupeService } from './groupe.service';

export const GroupeAdminConfig = createAdminEntity('Groupe', groupeSchema, {
  description: 'Gérez vos groupes',
  icon: '👥',
  actions: { create: true, read: true, update: true, delete: true, bulk: false },
  services: groupeService,
  queryKey: ['groupes'],
});