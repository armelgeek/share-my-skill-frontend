import { useMutation } from '@tanstack/react-query';
import { joinGroupe } from '../groupe.service';

export function useGroupeJoin() {
  return useMutation({
    mutationFn: (groupeId: string) => joinGroupe(groupeId),
  });
}
