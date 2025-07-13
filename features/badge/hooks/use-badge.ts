import { useQuery } from '@tanstack/react-query';
import { badgeService } from '../badge.mock';

export function useBadge() {
  return useQuery({
    queryKey: ['badges'],
    queryFn: () => badgeService.fetchItems(),
  });
}
