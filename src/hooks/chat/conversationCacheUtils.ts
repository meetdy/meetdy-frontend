/**
 * Immutable helpers for updating the conversations list cache
 * from optimistic updates and socket events.
 */

import type {
  IGroupConversation,
  IIndividualConversation,
} from '@/models/conversation.model';
import timeUtils from '@/utils/time-utils';

type Conversation = IIndividualConversation | IGroupConversation;

// ─── Bump a conversation to the top & update its lastMessage ────────
export function bumpConversation(
  conversations: Conversation[] | undefined,
  conversationId: string,
  lastMessage: any,
  options?: { resetUnread?: boolean },
): Conversation[] {
  if (!conversations) return [];

  const idx = conversations.findIndex((c) => c._id === conversationId);
  if (idx === -1) return conversations;

  const target = {
    ...conversations[idx],
    lastMessage: {
      ...lastMessage,
      createdAt: timeUtils.toTime(lastMessage.createdAt),
    },
  };

  if (options?.resetUnread) {
    target.numberUnread = 0;
  } else {
    target.numberUnread = (target.numberUnread || 0) + 1;
  }

  const rest = conversations.filter((c) => c._id !== conversationId);
  return [target as Conversation, ...rest];
}

// ─── Remove a conversation from the list ────────────────────────────
export function removeConversation(
  conversations: Conversation[] | undefined,
  conversationId: string,
): Conversation[] {
  if (!conversations) return [];
  return conversations.filter((c) => c._id !== conversationId);
}

// ─── Reset unread count for a conversation ──────────────────────────
export function resetUnread(
  conversations: Conversation[] | undefined,
  conversationId: string,
): Conversation[] {
  if (!conversations) return [];
  return conversations.map((c) =>
    c._id === conversationId ? { ...c, numberUnread: 0 } : c,
  );
}

// ─── Update a conversation field (name, avatar, etc.) ───────────────
export function patchConversation(
  conversations: Conversation[] | undefined,
  conversationId: string,
  patch: Partial<Conversation>,
): Conversation[] {
  if (!conversations) return [];
  return conversations.map((c) =>
    c._id === conversationId ? ({ ...c, ...patch } as Conversation) : c,
  );
}
