import { createEnhancedMockService, createMockDataGenerator, mockDataGenerators } from '@/shared/lib/admin/admin-generator';
import type { Commentaire } from './commentaire.schema';

export const commentaireService = createEnhancedMockService<Commentaire>(
  'commentaires',
  () => ({
    contenu: mockDataGenerators.description() as string,
    auteur: mockDataGenerators.name() as string,
    date: mockDataGenerators.date(30) as string,
    ressourceId: mockDataGenerators.id() as string,
  }),
  50
);
