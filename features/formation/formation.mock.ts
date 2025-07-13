import { createEnhancedMockService, createMockDataGenerator, mockDataGenerators } from '@/shared/lib/admin/admin-generator';
import type { Formation } from './formation.schema';

export const formationService = createEnhancedMockService<Formation>(
  'formations',
  () => ({
    titre: `Formation ${mockDataGenerators.name()}`,
    description: mockDataGenerators.description(),
    dateDebut: mockDataGenerators.date(90),
    dateFin: mockDataGenerators.date(80),
    lieu: mockDataGenerators.city(),
    formateur: mockDataGenerators.name(),
    capacite: mockDataGenerators.price(5, 50),
    isCertifiante: mockDataGenerators.boolean(),
  }),
  50
);
