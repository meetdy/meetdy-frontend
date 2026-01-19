import ServiceConversation from '@/api/conversationApi';
import { createQueryKey, queryClient } from '@/queries/core';
import { useQuery } from '@tanstack/react-query';

const fetchLastViewOfMembersKey = (conversationId: string) =>
  createQueryKey('fetchLastViewOfMembers', { conversationId });

interface UseFetchLastViewOfMembersProps {
  conversationId: string;
  enabled?: boolean;
}
export function useGetLastViewOfMembers({
  conversationId,
  enabled = true,
}: UseFetchLastViewOfMembersProps) {
  const { data, isFetched } = useQuery<any>({
    queryKey: fetchLastViewOfMembersKey(conversationId),
    queryFn: () => ServiceConversation.getLastViewOfMembers(conversationId),
    enabled,
  });
  return {
    lastViewOfMembers: data,
    isFetched,
  };
}

export async function checkAndFetchLastViewOfMembers(
  conversationId: string,
): Promise<any> {
  const cachedLastViewOfMembers = queryClient.getQueryData<any>(
    fetchLastViewOfMembersKey(conversationId),
  );
  if (cachedLastViewOfMembers) return cachedLastViewOfMembers;

  const lastViewOfMembers = await queryClient.getQuery({
    queryKey: fetchLastViewOfMembersKey(conversationId),
    queryFn: () => ServiceConversation.getLastViewOfMembers(conversationId),
    staleTime: Infinity,
  });
  return lastViewOfMembers;
}
