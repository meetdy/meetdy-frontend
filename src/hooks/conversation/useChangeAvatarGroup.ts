import { useMutation } from '@tanstack/react-query';
import { createQueryKey } from '@/queries/core';
import ServiceConversation from '@/api/conversationApi';

export function useChangeAvatarGroup() {
  return useMutation<void, unknown, { conversationId: string; file: File }>({
    mutationKey: createQueryKey('changeAvatarGroup', {}),
    mutationFn: ({
      conversationId,
      file,
    }: {
      conversationId: string;
      file: File;
    }) => ServiceConversation.changeAvatarGroup(conversationId, file),
  });
}
