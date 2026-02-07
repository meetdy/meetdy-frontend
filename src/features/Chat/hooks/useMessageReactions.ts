import { useMemo, useState, useEffect, useCallback } from 'react';
import type { ReactionType } from '../types/message.types';
import { useDropReaction } from '@/hooks/message/useDropReaction';

const DEFAULT_REACTIONS = ['👍', '❤️', '😆', '😮', '😭', '😡'];

export function useMessageReactions(
  messageId: string,
  reacts: ReactionType[] = [],
  currentUserId: string,
) {
  const { doDropReaction } = useDropReaction();

  const [listReactionCurrent, setListReactionCurrent] = useState<
    Array<string | number>
  >([]);

  const myReact = useMemo(() => {
    if (!reacts?.length) return undefined;
    return reacts.find((ele) => ele.user?._id === currentUserId);
  }, [reacts, currentUserId]);

  // useEffect(() => {
  //   const unique = new Set<string | number>();
  //   for (const ele of reacts ?? []) unique.add(ele.type);
  //   // setListReactionCurrent(Array.from(unique));
  // }, [reacts]);

  const transferIcon = useCallback((reactionType: string | number) => {
    const parsed = Number.parseInt(String(reactionType), 10);
    if (!Number.isNaN(parsed)) {
      const idx = parsed - 1;
      return DEFAULT_REACTIONS[idx] ?? String(reactionType);
    }
    return String(reactionType);
  }, []);

  const sendReaction = useCallback(
    (reactionType: string | number) => {
      doDropReaction({
        messageId,
        type: String(reactionType),
      });
    },
    [messageId, doDropReaction],
  );

  const handleClickLike = useCallback(() => {
    sendReaction(1);
  }, [sendReaction]);

  const handleClickReaction = useCallback(
    (value: string) => {
      const legacyIdx = DEFAULT_REACTIONS.findIndex(
        (element) => element === value,
      );
      if (legacyIdx >= 0) {
        sendReaction(legacyIdx + 1);
        return;
      }

      if (!value) return;
      sendReaction(value);
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
