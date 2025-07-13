import { createAdminEntity } from '@/shared/lib/admin/admin-generator';
import { partenaireSchema } from './partenaire.schema';
import { partenaireService } from './partenaire.mock';

export const PartenaireAdminConfig = createAdminEntity('Partenaire', partenaireSchema, {
  description: 'Gérez vos partenaires (entreprises, institutions, contacts)',
  icon: '🤝',
  actions: { create: true, read: true, update: true, delete: true, bulk: false },
  services: partenaireService,
  queryKey: ['partenaires'],
});
