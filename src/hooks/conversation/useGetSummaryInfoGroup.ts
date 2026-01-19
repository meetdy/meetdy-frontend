import ServiceConversation from '@/api/conversationApi';
import { createQueryKey } from '@/queries/core';
import { useQuery } from '@tanstack/react-query';

const fetchSummaryInfoGroupKey = (conversationId: string) =>
  createQueryKey('fetchSummaryInfoGroup', { conversationId });

interface UseFetchSummaryInfoGroupProps {
  id: string;
  enabled?: boolean;
}
export function useGetSummaryInfoGroup({
  id,
  enabled = true,
}: UseFetchSummaryInfoGroupProps) {
  return useQuery<any>({
    queryKey: fetchSummaryInfoGroupKey(id),
    queryFn: () => ServiceConversation.getMemberInConversation(id),
    enabled,
  });
}
