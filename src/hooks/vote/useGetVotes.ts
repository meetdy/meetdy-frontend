import ServiceVote from '@/api/voteApi';
import { IVote } from '@/models/vote.model';
import { createQueryKey } from '@/queries/core';
import { useQuery } from '@tanstack/react-query';

type TFetchVotes = {
  conversationId: string;
  page: number;
  size: number;
};

interface UseFetchVotesProps {
  params: TFetchVotes;
  enabled?: boolean;
}
export function useGetVotes({
  params: { conversationId, page, size },
  enabled = true,
}: UseFetchVotesProps) {
  return useQuery<IVote>({
    queryKey: createQueryKey('getVotes', { conversationId, page, size }, {}),
    queryFn: () => ServiceVote.getVotes(conversationId, page, size),
    enabled,
  });
}
