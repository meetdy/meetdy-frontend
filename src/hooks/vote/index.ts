import { useQuery, useMutation } from '@tanstack/react-query';

import ServiceVote from '@/api/voteApi';
import { queryClient } from '@/queries/core';

import { IVote } from '@/models/vote.model';

/* -------------------------------------------------------------------------- */
/*                                  Query Key                                 */
/* -------------------------------------------------------------------------- */

export const VOTE_QUERY_KEY = {
  ROOT: 'vote',
  LIST: 'list',
};

export const voteFactory = {
  all: () => [VOTE_QUERY_KEY.ROOT],
  list: (conversationId: string, page: number, size: number) => [
    VOTE_QUERY_KEY.ROOT,
    VOTE_QUERY_KEY.LIST,
    conversationId,
    page,
    size,
  ],
};

interface UseGetVotesProps {
  conversationId: string;
  page: number;
  size: number;
}

export function useGetVotes(params: UseGetVotesProps) {
  return useQuery<IVote>({
    queryKey: voteFactory.list(params.conversationId, params.page, params.size),
    queryFn: () =>
      ServiceVote.getVotes(params.conversationId, params.page, params.size),
    enabled: !!params.conversationId,
  });
}

/* ------------------------------- Create Vote ------------------------------- */

export function useCreateVote(conversationId: string) {
  return useMutation({
    mutationFn: ({
      content,
      options,
    }: {
      content: string;
      options: string[];
    }) => ServiceVote.createVote(content, options, conversationId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: voteFactory.all(),
      });
    },
  });
}

/* -------------------------------- Add Vote -------------------------------- */

export function useAddVote() {
  return useMutation({
    mutationFn: ({
      messageId,
      options,
    }: {
      messageId: string;
      options: string[];
    }) => ServiceVote.addVote(messageId, options),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: voteFactory.all(),
      });
    },
  });
}

/* ------------------------------- Select Vote ------------------------------- */

export function useSelectVote() {
  return useMutation({
    mutationFn: ({
      messageId,
      options,
    }: {
      messageId: string;
      options: string[];
    }) => ServiceVote.selectVote(messageId, options),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: voteFactory.all(),
      });
    },
  });
}

/* ----------------------------- Delete Selection ---------------------------- */

export function useDeleteSelect() {
  return useMutation({
    mutationFn: ({
      messageId,
      options,
    }: {
      messageId: string;
      options: string[];
    }) => ServiceVote.deleteSelect(messageId, options),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: voteFactory.all(),
      });
    },
  });
}
