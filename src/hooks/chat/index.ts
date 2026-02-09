// ── Query key factory ─────────────────────────────────────────
export { chatKeys } from './chatKeys';
export type { ChatQueryKey } from './chatKeys';

// ── Cache utilities ──────────────────────────────────────────
export * from './messageCacheUtils';
export * from './conversationCacheUtils';

// ── Query hooks ──────────────────────────────────────────────
export { useMessages } from './useMessages';
export type { UseMessagesOptions } from './useMessages';

export {
  useConversations,
  useConversationCacheActions,
} from './useConversations';
export type { UseConversationsOptions } from './useConversations';

// ── Mutation hooks (with optimistic updates) ─────────────────
export { useSendMessage } from './useSendMessage';
export type { SendMessageInput } from './useSendMessage';

export { useRedoMessageMutation } from './useRedoMessageMutation';
export { useDeleteMessageClientSideMutation } from './useDeleteMessageClientSideMutation';
export { useDropReactionMutation } from './useDropReactionMutation';
export { useRetryMessage } from './useRetryMessage';

// ── Socket ↔ Cache bridge ────────────────────────────────────
export { useChatSocket } from './useChatSocket';
