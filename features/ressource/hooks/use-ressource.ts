import { useQuery } from '@tanstack/react-query';
import { ressourceService } from '../ressource.service';

export function useRessource() {
  return useQuery({
    queryKey: ['ressources'],
    queryFn: () => ressourceService.list(),
  });
}
