import { createEnhancedMockService, createMockDataGenerator, mockDataGenerators } from '@/shared/lib/admin/admin-generator';
import type { Message } from './message.schema';

export const messageService = createEnhancedMockService<Message>(
  'messages',
  () => ({
    contenu: mockDataGenerators.description() as string,
    auteur: mockDataGenerators.name() as string,
    date: mockDataGenerators.date(30) as string,
    groupe: mockDataGenerators.category() as string,
  }),
  50
);
