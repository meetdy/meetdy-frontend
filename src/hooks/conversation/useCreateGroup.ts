import { useMutation } from '@tanstack/react-query';
import { createQueryKey } from '@/queries/core';
import { TCreateGroup } from '@/models/conversation.model';
import ServiceConversation from '@/api/conversationApi';

export function useCreateGroup() {
  return useMutation<void, unknown, TCreateGroup>({
    mutationKey: createQueryKey('createGroup', {}),
    mutationFn: (params: TCreateGroup) =>
      ServiceConversation.createGroup(params),
  });
}
