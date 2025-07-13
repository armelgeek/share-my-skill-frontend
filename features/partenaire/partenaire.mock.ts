import { createEnhancedMockService, createMockDataGenerator, mockDataGenerators } from '@/shared/lib/admin/admin-generator';
import type { Partenaire } from './partenaire.schema';

export const partenaireService = createEnhancedMockService<Partenaire>(
  'partenaires',
  () => ({
    nom: mockDataGenerators.name(),
    description: mockDataGenerators.description(),
    type: mockDataGenerators.category(),
    contact: mockDataGenerators.name(),
    email: mockDataGenerators.email(),
    telephone: mockDataGenerators.phone(),
    adresse: mockDataGenerators.address(),
    siteWeb: mockDataGenerators.url(),
    isActif: mockDataGenerators.boolean(),
  }),
  50
);
