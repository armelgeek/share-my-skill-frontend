import { createEnhancedMockService, createMockDataGenerator, mockDataGenerators } from '@/shared/lib/admin/admin-generator';
import type { Badge } from './badge.schema';

export const badgeService = createEnhancedMockService<Badge>(
  'badges',
  () => ({
    nom: mockDataGenerators.name() as string,
    description: mockDataGenerators.description() as string,
    couleur: mockDataGenerators.category() as string,
    icone: 'star',
  }),
  50
);
