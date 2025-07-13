import { useQuery } from '@tanstack/react-query';
import { atelierService } from '../atelier.mock';

export function useAtelier() {
  return useQuery({
    queryKey: ['ateliers'],
    queryFn: () => atelierService.fetchItems(),
  });
}
