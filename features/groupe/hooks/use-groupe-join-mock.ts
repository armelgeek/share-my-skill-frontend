import { useMutation } from '@tanstack/react-query';
import { joinGroupeMock } from '../groupe.mock';

export function useGroupeJoinMock() {
  return useMutation({
    mutationFn: (groupeId: string) => joinGroupeMock(groupeId),
  });
}
