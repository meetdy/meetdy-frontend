import { useQuery } from '@tanstack/react-query';
import {
  TGetListConversations,
  IIndividualConversation,
  IGroupConversation,
} from '@/models/conversation.model';
import ServiceConversation from '@/api/conversationApi';
import { createQueryKey } from '@/queries/core';

const fetchListConversationsKey = (params: any) =>
  createQueryKey('fetchListConversations', params);

interface UseFetchListConversationsProps {
  params: TGetListConversations;
  enabled?: boolean;
}
export function useFetchListConversations({
  params,
  enabled = true,
}: UseFetchListConversationsProps) {
  const { data, isFetched, isFetching } = useQuery<
    Array<IIndividualConversation | IGroupConversation>
  >({
    queryKey: fetchListConversationsKey(params),
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
