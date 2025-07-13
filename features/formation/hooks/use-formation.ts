import { useQuery } from '@tanstack/react-query';
import { formationService } from '../formation.service';

export function useFormation() {
  return useQuery({
    queryKey: ['formations'],
    queryFn: () => formationService.list(),
  });
}
