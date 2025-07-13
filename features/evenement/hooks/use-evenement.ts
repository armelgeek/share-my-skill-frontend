import { useQuery } from '@tanstack/react-query';
import { evenementService } from '../evenement.service';

export function useEvenement() {
  return useQuery({
    queryKey: ['evenements'],
    queryFn: () => evenementService.list(),
  });
}
