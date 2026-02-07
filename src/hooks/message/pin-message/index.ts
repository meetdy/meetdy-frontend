import { useMutation, useQuery } from '@tanstack/react-query';

import ServicePinMessage, {
  IPinMessage,
  TPinMessageParams,
} from '@/api/pinMessageApi';
import { queryClient } from '@/queries/core';
import { toast } from 'sonner';

/* -------------------------------------------------------------------------- */
/*                                  Query Key                                 */
/* -------------------------------------------------------------------------- */

export const PIN_MESSAGE_QUERY_KEY = {
  ROOT: 'pin-message',
  LIST: 'list',
};

/* -------------------------------------------------------------------------- */
/*                               Query Factory                                */
/* -------------------------------------------------------------------------- */

export const pinMessageFactory = {
  all: () => [PIN_MESSAGE_QUERY_KEY.ROOT],
  list: (conversationId: string) => [
    PIN_MESSAGE_QUERY_KEY.ROOT,
    PIN_MESSAGE_QUERY_KEY.LIST,
    conversationId,
  ],
};

/* -------------------------------------------------------------------------- */
/*                                   Queries                                  */
/* -------------------------------------------------------------------------- */

interface UseGetPinMessagesProps {
  conversationId: string;
  enabled?: boolean;
}

export function useGetPinMessages({
  conversationId,
  enabled = true,
}: UseGetPinMessagesProps) {
  return useQuery<IPinMessage[]>({
    queryKey: pinMessageFactory.list(conversationId),
    queryFn: () => ServicePinMessage.getPinMessages({ conversationId }),
    enabled: !!conversationId && enabled,
  });
}

/* -------------------------------------------------------------------------- */
/*                                  Mutations                                 */
/* -------------------------------------------------------------------------- */

/* -------------------------------- Pin ------------------------------------ */

export function usePinMessage() {
  const { mutate, isPending } = useMutation({
    mutationFn: ServicePinMessage.pinMessage,
    onSuccess: (_, variables) => {
      toast.success('Ghim tin nhắn thành công');
      queryClient.invalidateQueries({
        queryKey: pinMessageFactory.list(variables.messageId),
      });
    },
    onError: () => {
      toast.error('Ghim tin nhắn thất bại');
    },
  });

  const doPinMessage = (params: TPinMessageParams) => {
    mutate(params);
  };

  return { doPinMessage, isPending };
}

/* ------------------------------- Unpin ----------------------------------- */

export function useUnpinMessage() {
  const { mutate, isPending } = useMutation({
    mutationFn: ServicePinMessage.unpinMessage,
    onSuccess: (_, variables) => {
      toast.success('Xóa thành công');

      queryClient.invalidateQueries({
        queryKey: pinMessageFactory.list(variables.messageId),
      });
    },

    onError: () => {
      toast.error('Xóa thất bại');
    },
  });

  const doUnpinMessage = (params: TPinMessageParams) => {
    mutate(params);
  };

  return { doUnpinMessage, isPending };
}
