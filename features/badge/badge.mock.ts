import { createEnhancedMockService, createMockDataGenerator, mockDataGenerators } from '@/shared/lib/admin/admin-generator';
import type { Badge } from './badge.schema';

export const badgeService = createEnhancedMockService<Badge>(
  'badges',
  () => ({
    nom: mockDataGenerators.name() as string,
    description: mockDataGenerators.description() as string,
    couleur: 'obtained' as 'obtained' | 'in-progress',
    icone: 'star',
    dateObtention: mockDataGenerators.date(30) as string,
    criteres: mockDataGenerators.description() as string,
  }),
  50
);
