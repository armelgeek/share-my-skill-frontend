import BaseService from '@/shared/lib/services/base-service';
import { API_ENDPOINTS } from '@/shared/config/api';

export const evenementService = new BaseService(API_ENDPOINTS.evenement.base);
