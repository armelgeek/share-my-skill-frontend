import { AdminCrudService } from '@/shared/lib/admin/admin-generator';
import { API_ENDPOINTS } from '@/shared/config/api';

export const groupeService = new AdminCrudService(API_ENDPOINTS.groupe.base);
