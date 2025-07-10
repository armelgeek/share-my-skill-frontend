import { useQuery } from '@tanstack/react-query';
import { userService } from '../user.service';

export function useUser() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userService.list(),
  });
}
