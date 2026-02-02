import { useMemo, useState, useEffect, useCallback } from 'react';
import messageApi from '@/api/messageApi';
import type { ReactionType } from '../types/message.types';

const DEFAULT_REACTIONS = ['👍', '❤️', '😆', '😮', '😭', '😡'];

export function useMessageReactions(
  messageId: string,
  reacts: ReactionType[] = [],
  currentUserId: string,
) {
  const [listReactionCurrent, setListReactionCurrent] = useState<
    Array<string | number>
  >([]);

  const myReact = useMemo(() => {
    if (!reacts?.length) return undefined;
    return reacts.find((ele) => ele.user?._id === currentUserId);
  }, [reacts, currentUserId]);

  useEffect(() => {
    const unique = new Set<string | number>();
    for (const ele of reacts ?? []) unique.add(ele.type);
    setListReactionCurrent(Array.from(unique));
  }, [reacts]);

  const transferIcon = useCallback((reactionType: string | number) => {
    const parsed = Number.parseInt(String(reactionType), 10);
    if (!Number.isNaN(parsed)) {
      const idx = parsed - 1;
      return DEFAULT_REACTIONS[idx] ?? String(reactionType);
    }
    return String(reactionType);
  }, []);

  const sendReaction = useCallback(
    async (reactionType: string | number) => {
      await messageApi.dropReaction(messageId, String(reactionType));
    },
    [messageId],
  );

  const handleClickLike = useCallback(() => {
    void sendReaction(1);
  }, [sendReaction]);

  const handleClickReaction = useCallback(
    (value: string) => {
      const legacyIdx = DEFAULT_REACTIONS.findIndex(
        (element) => element === value,
      );
      if (legacyIdx >= 0) {
        void sendReaction(legacyIdx + 1);
        return;
      }

      if (!value) return;
      void sendReaction(value);
    },
    [sendReaction],
  );

  return {
    myReact,
    listReactionCurrent,
    listReaction: DEFAULT_REACTIONS,
    transferIcon,
    handleClickLike,
    handleClickReaction,
  };
}
