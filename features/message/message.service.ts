import BaseService from '@/shared/lib/services/base-service';
import { API_ENDPOINTS } from '@/shared/config/api';
import type { Message } from './message.schema';

export const messageService = new BaseService(API_ENDPOINTS.message.base);
