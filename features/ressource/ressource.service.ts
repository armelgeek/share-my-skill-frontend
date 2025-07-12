import BaseService from '@/shared/lib/services/base-service';
import { API_ENDPOINTS } from '@/shared/config/api';
import type { Ressource } from './ressource.schema';

export const ressourceService = new BaseService(API_ENDPOINTS.ressource.base);
