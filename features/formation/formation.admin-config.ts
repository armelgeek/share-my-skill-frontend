import { createAdminEntity } from '@/shared/lib/admin/admin-generator';
import { formationSchema } from './formation.schema';
import { formationService } from './formation.mock';

export const FormationAdminConfig = createAdminEntity('Formation', formationSchema, {
  description: 'Gérez vos formations (sessions, ateliers, certifiantes)',
  icon: '🎓',
  actions: { create: true, read: true, update: true, delete: true, bulk: false },
  services: formationService,
  queryKey: ['formations'],
});
