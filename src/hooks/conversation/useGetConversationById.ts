import { createQueryKey, queryClient } from '@/queries/core';
import { useQuery } from '@tanstack/react-query';
import {
  IGroupConversation,
  IIndividualConversation,
  TGetConversation,
} from '@/models/conversation.model';
import ServiceConversation from '@/api/conversationApi';

export const fetchConversationByIdKey = (id: string) =>
  createQueryKey('fetchConversationById', { id });

interface UseFetchConversationByIdProps {
  id: string;
  enabled?: boolean;
}

export function useGetConversationById({
  id,
  enabled = true,
}: UseFetchConversationByIdProps) {
  const { data, isFetched } = useQuery<
    IIndividualConversation | IGroupConversation
  >({
    queryKey: fetchConversationByIdKey(id),
    queryFn: () => ServiceConversation.getConversationById(id),
    enabled,
  });

  return {
    conversation: data as TGetConversation,
    isFetched,
  };
}

export async function checkAndFetchConversationById(
  id: string,
): Promise<IIndividualConversation | IGroupConversation | null> {
  const cachedConversation = queryClient.getQueryData<
    IIndividualConversation | IGroupConversation
  >(fetchConversationByIdKey(id));
  if (cachedConversation) return cachedConversation;

  const conversation = await queryClient.getQuery({
    queryKey: fetchConversationByIdKey(id),
    queryFn: () => ServiceConversation.getConversationById(id),
    staleTime: Infinity,
  });
  return conversation;
}
