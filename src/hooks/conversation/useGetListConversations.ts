import { useQuery } from '@tanstack/react-query';
import {
  TGetListConversations,
  IIndividualConversation,
  IGroupConversation,
} from '@/models/conversation.model';
import ServiceConversation from '@/api/conversationApi';
import { createQueryKey } from '@/queries/core';

export const createKeyListConversations = (params: any) =>
  createQueryKey('getListConversations', params);

interface UseGetListConversationsProps {
  params: TGetListConversations;
  enabled?: boolean;
}
export function useGetListConversations({
  params,
  enabled = true,
}: UseGetListConversationsProps) {
  const { data, isFetched, isFetching } = useQuery<
    Array<IIndividualConversation | IGroupConversation>
  >({
    queryKey: createKeyListConversations(params),
    queryFn: () => ServiceConversation.getListConversations(params),
    enabled,
  });

  return {
    conversations: (data || []) as Array<
      IIndividualConversation | IGroupConversation
    >,
    isFetched,
    isFetching,
  };
}
