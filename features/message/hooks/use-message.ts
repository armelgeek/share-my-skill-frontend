import { useQuery } from '@tanstack/react-query';
import { messageService } from '../message.mock';

export function useMessage() {
  return useQuery({
    queryKey: ['messages'],
    queryFn: () => messageService.fetchItems(),
  });
}
