import { useQuery } from '@tanstack/react-query';
import { partenaireService } from '../partenaire.service';

export function usePartenaire() {
  return useQuery({
    queryKey: ['partenaires'],
    queryFn: () => partenaireService.list(),
  });
}
