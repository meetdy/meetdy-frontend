import { useMutation } from '@tanstack/react-query';
import { createQueryKey } from '@/queries/core';
import ServiceConversation from '@/api/conversationApi';

export function useChangeStatusForGroup() {
  return useMutation<
    void,
    unknown,
    { conversationId: string; isStatus: boolean }
  >({
    mutationKey: createQueryKey('changeStatusForGroup', {}),
    mutationFn: ({ conversationId, isStatus }) =>
      ServiceConversation.changeStatusForGroup(conversationId, isStatus),
  });
}
