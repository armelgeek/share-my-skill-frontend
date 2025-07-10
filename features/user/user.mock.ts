import { User } from './user.schema';
import { createMockService } from '@/shared/lib/admin/admin-generator';

export const mockUsers: User[] = [
  {
    email: 'alice@example.com',
    name: 'Alice',
    avatar: '/avatars/alice.png',
    role: 'user',
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-07-01'),
  },
  {
    email: 'bob@example.com',
    name: 'Bob',
    avatar: '/avatars/bob.png',
    role: 'admin',
    isActive: false,
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-07-01'),
  }
];

export const userService = createMockService(mockUsers, {
  entityName: 'users',
  enableValidation: true,
  validator: (user) => user.email ? true : 'Email requis',
  enableBackup: true,
  maxBackups: 5
});
