import { createEnhancedMockService, mockDataGenerators } from '@/shared/lib/admin/admin-generator';
import type { Groupe } from './groupe.schema';

export const groupeService = createEnhancedMockService<Groupe>(
  'groupes',
  () => ({
    nom: `Groupe ${mockDataGenerators.name()}`,
    description: mockDataGenerators.description(),
    membres: [mockDataGenerators.name(), mockDataGenerators.name()],
  }),
  20
);
