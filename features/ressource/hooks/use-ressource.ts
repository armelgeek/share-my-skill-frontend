import { useQuery } from '@tanstack/react-query';
import { ressourceService } from '../ressource.mock';

export function useRessource() {
  return useQuery({
    queryKey: ['ressources'],
    queryFn: () => ressourceService.fetchItems(),
  });
}
