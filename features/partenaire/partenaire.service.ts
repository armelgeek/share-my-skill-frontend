import BaseService from '@/shared/lib/services/base-service';
import { API_ENDPOINTS } from '@/shared/config/api';

export const partenaireService = new BaseService(API_ENDPOINTS.partenaire.base);
