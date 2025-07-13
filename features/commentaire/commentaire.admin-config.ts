import { createAdminEntity } from '@/shared/lib/admin/admin-generator';
import { commentaireService } from './commentaire.mock';
import { commentaireSchema } from './commentaire.schema';

export const CommentaireAdminConfig = createAdminEntity('Commentaire', commentaireSchema, {
  description: 'Gérez vos commentaires',
  icon: '💬',
  actions: { create: true, read: true, update: true, delete: true, bulk: false },
  services: commentaireService,
  queryKey: ['commentaires'],
});
