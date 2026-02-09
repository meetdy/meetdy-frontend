/**
 * Centralized query key factory for all chat-related React Query queries.
 *
 * ## Design Rationale
 *
 * Keys are hierarchical arrays so that `queryClient.invalidateQueries` can
 * target broad or narrow scopes:
 *
 * - `chatKeys.conversations.all`   → invalidate every conversation query
 * - `chatKeys.conversations.list(params)` → invalidate a specific list variant
 * - `chatKeys.messages.all`         → invalidate every message query
 * - `chatKeys.messages.infinite(id)` → invalidate one conversation's messages
 *
 * We deliberately use plain arrays (not `createQueryKey`) so that key
 * structure is transparent and framework-standard.
 */

export const chatKeys = {
  // ── Conversations ──────────────────────────────────────────────
  conversations: {
    all: ['conversations'] as const,
    list: (params?: Record<string, unknown>) =>
      ['conversations', 'list', params ?? {}] as const,
    detail: (id: string) => ['conversations', 'detail', id] as const,
    summary: (id: string) => ['conversations', 'summary', id] as const,
  },

  // ── Messages (infinite scroll) ────────────────────────────────
  messages: {
    all: ['messages'] as const,
    infinite: (conversationId: string, channelId?: string) =>
      ['messages', 'infinite', { conversationId, channelId }] as const,
  },

  // ── Members / Last view ───────────────────────────────────────
  members: {
    all: ['members'] as const,
    list: (conversationId: string) =>
      ['members', 'list', conversationId] as const,
    lastView: (conversationId: string) =>
      ['members', 'lastView', conversationId] as const,
  },

  // ── Channels ──────────────────────────────────────────────────
  channels: {
    all: ['channels'] as const,
    list: (conversationId: string) =>
      ['channels', 'list', conversationId] as const,
    lastView: (channelId: string) =>
      ['channels', 'lastView', channelId] as const,
  },

  // ── Pin messages ──────────────────────────────────────────────
  pinMessages: {
    all: ['pinMessages'] as const,
    list: (conversationId: string) =>
      ['pinMessages', 'list', conversationId] as const,
  },
} as const;

/**
 * Helper type: extracts the return type of any key-factory function above
 * so we can use it in generics, e.g. `QueryKey<typeof chatKeys.messages.infinite>`.
 */
export type ChatQueryKey<T extends (...args: any[]) => readonly unknown[]> =
  ReturnType<T>;
