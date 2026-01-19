import ServiceConversation from '@/api/conversationApi';
import { createQueryKey, queryClient } from '@/queries/core';
import { useQuery } from '@tanstack/react-query';

const fetchMemberInConversationKey = (id: string) =>
  createQueryKey('fetchMemberInConversation', { id });

interface UseFetchMemberInConversationProps {
  id: string;
  enabled?: boolean;
}
export function useFetchMemberInConversation({
  id,
  enabled = true,
}: UseFetchMemberInConversationProps) {
  const { data, isFetched } = useQuery<any>({
    queryKey: fetchMemberInConversationKey(id),
    queryFn: () => ServiceConversation.getMemberInConversation(id),
    enabled,
  });
  return {
    member: data,
    isFetched,
  };
}

export async function checkAndFetchMemberInConversation(
  id: string,
): Promise<any> {
  const cachedMember = queryClient.getQueryData<any>(
    fetchMemberInConversationKey(id),
  );
  if (cachedMember) return cachedMember;

  const member = await queryClient.getQuery({
    queryKey: fetchMemberInConversationKey(id),
    queryFn: () => ServiceConversation.getMemberInConversation(id),
    staleTime: Infinity,
  });
  return member;
}
