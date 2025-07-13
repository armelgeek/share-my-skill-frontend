import { useMutation } from '@tanstack/react-query';
import { quitGroupeMock } from '../groupe.mock';

export function useGroupeQuitMock() {
  return useMutation({
    mutationFn: (groupeId: string) => quitGroupeMock(groupeId),
  });
}
