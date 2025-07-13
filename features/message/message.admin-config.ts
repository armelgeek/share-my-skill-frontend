import { createAdminEntity } from '@/shared/lib/admin/admin-generator';
import { messageSchema } from './message.schema';
import { messageService } from './message.mock';

export const MessageAdminConfig = createAdminEntity('Message', messageSchema, {
  description: 'Gérez vos messages',
  icon: '💬',
  actions: { create: true, read: true, update: true, delete: true, bulk: false },
  services: messageService,
  queryKey: ['messages'],
});
