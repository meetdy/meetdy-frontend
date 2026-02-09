/**
 * useConversations – Conversation list powered by React Query.
 *
 * Replaces:
 *   - Redux `state.chat.conversations`
 *   - `fetchListConversations` async thunk
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import ServiceConversation from '@/api/conversationApi';
import { chatKeys } from './chatKeys';
import type {
  IIndividualConversation,
  IGroupConversation,
  TGetListConversations,
} from '@/models/conversation.model';

type Conversation = IIndividualConversation | IGroupConversation;

export interface UseConversationsOptions {
  params?: TGetListConversations;
  enabled?: boolean;
}

export function useConversations({
  params = {},
  enabled = true,
}: UseConversationsOptions = {}) {
  const queryKey = chatKeys.conversations.list(
    params as Record<string, unknown>,
  );

  const query = useQuery<Conversation[]>({
    queryKey,
    queryFn: () => ServiceConversation.getListConversations(params),
    enabled,
    staleTime: 1000 * 60,
  });

  return {
    conversations: (query.data ?? []) as Conversation[],
    queryKey,
    ...query,
  };
}

/**
 * Imperative helpers to manipulate the conversation cache from outside
 * React components (e.g. socket handlers).
 */
export function useConversationCacheActions() {
  const queryClient = useQueryClient();
  const queryKey = chatKeys.conversations.list({});

  const setConversations = (
    updater: (old: Conversation[] | undefined) => Conversation[],
  ) => {
    queryClient.setQueryData<Conversation[]>(queryKey, updater);
  };

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: chatKeys.conversations.all });
  };

  return { setConversations, invalidate, queryKey };
}
