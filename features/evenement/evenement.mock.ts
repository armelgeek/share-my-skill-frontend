import { createEnhancedMockService, createMockDataGenerator, mockDataGenerators } from '@/shared/lib/admin/admin-generator';
import type { Evenement } from './evenement.schema';

export const evenementService = createEnhancedMockService<Evenement>(
  'evenements',
  () => ({
    titre: `Événement ${mockDataGenerators.name()}`,
    description: mockDataGenerators.description(),
    date: mockDataGenerators.date(60),
    lieu: mockDataGenerators.city(),
    organisateur: mockDataGenerators.name(),
    type: mockDataGenerators.category(),
    capacite: mockDataGenerators.price(10, 500),
    isPublic: mockDataGenerators.boolean(),
  }),
  50
);
