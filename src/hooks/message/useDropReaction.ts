import ServiceMessages, { TDropReactionPayload } from '@/api/messageApi';
import { createQueryKey } from '@/queries/core';
import { useMutation } from '@tanstack/react-query';

export function useDropReaction() {
  const { mutate, isPending } = useMutation({
    mutationKey: createQueryKey('dropReaction', {}),
    mutationFn: ServiceMessages.dropReaction,
  });

  const doDropReaction = async (payload: TDropReactionPayload) => {
    mutate(payload);
  };

  return { doDropReaction, isPending };
}
