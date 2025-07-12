import { createEnhancedMockService, createMockDataGenerator, mockDataGenerators } from '@/shared/lib/admin/admin-generator';
import type { Ressource } from './ressource.schema';

export const ressourceService = createEnhancedMockService<Ressource>(
  'ressources',
  () => ({
    titre: mockDataGenerators.name() as string,
    url: mockDataGenerators.url() as string,
    type: mockDataGenerators.category() as string,
    auteur: mockDataGenerators.name() as string,
  }),
  50
);
