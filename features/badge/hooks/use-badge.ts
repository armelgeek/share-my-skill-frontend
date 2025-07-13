import { useQuery } from '@tanstack/react-query';
import { badgeService } from '../badge.service';

export function useBadge() {
  return useQuery({
    queryKey: ['badges'],
    queryFn: () => badgeService.list(),
  });
}
