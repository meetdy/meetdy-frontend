import { useMutation } from '@tanstack/react-query';
import { createQueryKey } from '@/queries/core';
import ServiceConversation from '@/api/conversationApi';

export function useJoinGroupFromLink() {
  return useMutation<void, unknown, string>({
    mutationKey: createQueryKey('joinGroupFromLink', {}),
    mutationFn: (conversationId: string) =>
      ServiceConversation.joinGroupFromLink(conversationId),
  });
}
