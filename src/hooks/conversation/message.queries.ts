import { useMutation, useQuery } from '@tanstack/react-query';
import { createQueryKey } from '@/queries/core';
import ServiceConversation from '@/api/conversationApi';
import {
  IGroupConversation,
  IIndividualConversation,
  TCreateConversationResponse,
  TCreateGroup,
  TGetConversation,
  TGetListConversations,
} from '@/models/conversation.model';

export const fetchConversationByIdKey = (id: string) =>
  createQueryKey('fetchConversationById', { id });

interface UseFetchConversationByIdProps {
  id: string;
  enabled?: boolean;
}

export const createKeyListConversations = (params: TGetListConversations) =>
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

export function useCreateConversationIndividual() {
  return useMutation<TCreateConversationResponse, unknown, string>({
    mutationKey: createQueryKey('createConversationIndividual', {}),
    mutationFn: (userId: string) =>
      ServiceConversation.createConversationIndividual(userId),
  });
}

export function useDeleteConversation() {
  return useMutation<void, unknown, string>({
    mutationKey: createQueryKey('deleteConversation', {}),
    mutationFn: (id: string) => ServiceConversation.deleteConversation(id),
  });
}

export function useCreateConversationGroup() {
  return useMutation<void, unknown, TCreateGroup>({
    mutationKey: createQueryKey('createConversationGroup', {}),
    mutationFn: (params: TCreateGroup) =>
      ServiceConversation.createGroup(params),
  });
}

export function useLeaveConversationGroup() {
  return useMutation<void, unknown, string>({
    mutationKey: createQueryKey('leaveConversationGroup', {}),
    mutationFn: (conversationId: string) =>
      ServiceConversation.leaveGroup(conversationId),
  });
}
