import BaseService from '@/shared/lib/services/base-service';
import { API_ENDPOINTS } from '@/shared/config/api';
import type { User } from './user.schema';

export const userService = new BaseService<User>(API_ENDPOINTS.user);
