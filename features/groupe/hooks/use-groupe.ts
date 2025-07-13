import { useQuery } from '@tanstack/react-query';
import { groupeService } from '../groupe.mock';
export function useGroupe() {
  return useQuery({
    queryKey: ['groupes'],
    queryFn: () => groupeService.fetchItems({}),
  });
}
