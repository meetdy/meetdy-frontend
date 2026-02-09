/**
 * Helper utilities for manipulating the React Query infinite-messages cache
 * in an immutable, type-safe way.
 *
 * These are consumed by mutations (optimistic updates) and the socket bridge.
 */

import type { InfiniteData } from '@tanstack/react-query';
import type { IMessage } from '@/models/message.model';

/** The shape of a single page returned by the messages infinite query. */
export type MessagePage = IMessage; // { data: any[]; page: number; totalPages: number }

/** Full cache structure for an infinite message query. */
export type MessagesCache = InfiniteData<MessagePage>;

// ─── Append a message to the LAST page (newest) ──────────────────────
export function appendMessage(
  cache: MessagesCache | undefined,
  message: any,
): MessagesCache {
  if (!cache || cache.pages.length === 0) {
    return {
      pages: [{ data: [message], page: 0, totalPages: 1 }],
      pageParams: [0],
    };
  }

  const pages = cache.pages.map((page, idx) => {
    if (idx === cache.pages.length - 1) {
      return { ...page, data: [...page.data, message] };
    }
    return page;
  });

  return { ...cache, pages };
}

// ─── Remove a message by ID ─────────────────────────────────────────
export function removeMessageById(
  cache: MessagesCache | undefined,
  messageId: string,
): MessagesCache | undefined {
  if (!cache) return cache;

  const pages = cache.pages.map((page) => ({
    ...page,
    data: page.data.filter((msg: any) => msg._id !== messageId),
  }));

  return { ...cache, pages };
}

// ─── Replace a message (match by _id or tempId) ────────────────────
export function replaceMessage(
  cache: MessagesCache | undefined,
  matchId: string,
  newMessage: any,
): MessagesCache | undefined {
  if (!cache) return cache;

  const pages = cache.pages.map((page) => ({
    ...page,
    data: page.data.map((msg: any) => (msg._id === matchId ? newMessage : msg)),
  }));

  return { ...cache, pages };
}

// ─── Update a message in-place (partial patch) ─────────────────────
export function patchMessage(
  cache: MessagesCache | undefined,
  messageId: string,
  patch: Record<string, any>,
): MessagesCache | undefined {
  if (!cache) return cache;

  const pages = cache.pages.map((page) => ({
    ...page,
    data: page.data.map((msg: any) =>
      msg._id === messageId ? { ...msg, ...patch } : msg,
    ),
  }));

  return { ...cache, pages };
}

// ─── Mark a message as deleted (redo / recall) ─────────────────────
export function markMessageDeleted(
  cache: MessagesCache | undefined,
  messageId: string,
): MessagesCache | undefined {
  return patchMessage(cache, messageId, { isDeleted: true });
}

// ─── Update reaction on a message ──────────────────────────────────
export function updateReaction(
  cache: MessagesCache | undefined,
  messageId: string,
  user: { _id: string; name: string },
  type: string,
): MessagesCache | undefined {
  if (!cache) return cache;

  const pages = cache.pages.map((page) => ({
    ...page,
    data: page.data.map((msg: any) => {
      if (msg._id !== messageId) return msg;

      const reacts = [...(msg.reacts || [])];
      const existingIdx = reacts.findIndex((r: any) => r.user._id === user._id);

      if (existingIdx >= 0) {
        reacts[existingIdx] = { ...reacts[existingIdx], type };
      } else {
        reacts.push({ user, type });
      }

      return { ...msg, reacts };
    }),
  }));

  return { ...cache, pages };
}

// ─── Check if a message ID already exists in cache (dedup) ─────────
export function hasMessageInCache(
  cache: MessagesCache | undefined,
  messageId: string,
): boolean {
  if (!cache) return false;
  return cache.pages.some((page) =>
    page.data.some((msg: any) => msg._id === messageId),
  );
}
