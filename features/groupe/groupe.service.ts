import BaseService from '@/shared/lib/services/base-service';
import { API_ENDPOINTS } from '@/shared/config/api';
import type { Groupe } from './groupe.schema';

export const groupeService = new BaseService(API_ENDPOINTS.groupe.base);

export const joinGroupe = (groupeId: string) => {
  // Appel API pour rejoindre le groupe
  return groupeService.post(`${API_ENDPOINTS.groupe.base}/${groupeId}/join`, {});
};
