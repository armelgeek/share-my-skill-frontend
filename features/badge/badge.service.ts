import BaseService from '@/shared/lib/services/base-service';
import { API_ENDPOINTS } from '@/shared/config/api';
import type { Badge } from './badge.schema';

export const badgeService = new BaseService(API_ENDPOINTS.badge.base);
