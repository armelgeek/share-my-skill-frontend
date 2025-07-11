import { useQuery } from '@tanstack/react-query';
import { atelierService } from '../atelier.service';

export function useAtelier() {
  return useQuery({
    queryKey: ['ateliers'],
    queryFn: () => atelierService.list(),
  });
}
