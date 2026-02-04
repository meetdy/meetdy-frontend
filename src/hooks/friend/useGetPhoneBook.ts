import { useQuery } from '@tanstack/react-query';
import { createQueryKey } from '@/queries/core';
import { IContact } from '@/models/friend.model';
import ServiceContacts from '@/api/contactsApi';

export const createKeyPhoneBook = () => createQueryKey('fetchPhoneBook', {});

interface UseGetPhoneBookProps {
  enabled?: boolean;
}

export function useGetPhoneBook({ enabled = true }: UseGetPhoneBookProps = {}) {
  const { data, isFetched, isFetching, isError, error } = useQuery<IContact[]>({
    queryKey: createKeyPhoneBook(),
    queryFn: () => ServiceContacts.getContacts(),
    enabled,
    staleTime: 1000 * 60 * 30, // 30 minutes - contacts don't change often
    gcTime: 1000 * 60 * 60, // 1 hour
  });

  return {
    phoneBook: (data || []) as IContact[],
    isFetched,
    isFetching,
    isError,
    error,
  };
}
