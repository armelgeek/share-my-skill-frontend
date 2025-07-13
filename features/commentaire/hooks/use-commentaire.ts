import { useQuery } from '@tanstack/react-query';
import { commentaireService } from '../commentaire.service';

export function useCommentaire() {
  return useQuery({
    queryKey: ['commentaires'],
    queryFn: () => commentaireService.list(),
  });
}
