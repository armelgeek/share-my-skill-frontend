import { createEnhancedMockService, mockDataGenerators } from '@/shared/lib/admin/admin-generator';
import type { Atelier } from './atelier.schema';

export const atelierService = createEnhancedMockService<Atelier>(
  'ateliers',
  () => ({
    titre: `Atelier ${mockDataGenerators.name()}` as string,
    description: mockDataGenerators.description() as string,
    date: mockDataGenerators.date(30) as string,
    animateur: mockDataGenerators.name() as string,
  }),
  30
);
