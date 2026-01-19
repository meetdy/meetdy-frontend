import { useQuery } from '@tanstack/react-query';
import { IContact } from '@/models/friend.model';
import ServiceContacts from '@/api/contactsApi';
import { createQueryKey } from '@/queries/core';

export function useGetContacts({ enabled = true }: { enabled?: boolean } = {}) {
  const { data, isFetched, isFetching } = useQuery<IContact[]>({
    queryKey: createQueryKey('contacts', {}),
    queryFn: () => ServiceContacts.getContacts(),
    enabled,
  });

  return {
    contacts: (data || []) as IContact[],
    isFetched,
    isFetching,
  };
}
