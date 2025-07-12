import { useQuery } from '@tanstack/react-query';
import { groupeService } from '../groupe.service';

export function useGroupe() {
  return useQuery({
    queryKey: ['groupes'],
    queryFn: () => groupeService.list({}),
  });
}
