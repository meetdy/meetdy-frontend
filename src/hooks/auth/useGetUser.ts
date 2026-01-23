import { useQuery } from '@tanstack/react-query';
import ServiceAuth from '@/api/authApi';
import { createQueryKey, queryClient } from '@/queries/core';
import { IUser } from '@/models/auth.model';

type TFetchUser = {
  username: string;
};

const createKeyGetUser = ({ username }: TFetchUser) =>
  createQueryKey('user', { username });

interface UseFetchUserProps {
  params: TFetchUser;
  enabled?: boolean;
}

export function useGetUser({
  params: { username },
  enabled = true,
}: UseFetchUserProps) {
  return useQuery<IUser>({
    queryKey: createKeyGetUser({ username }),
    queryFn: () => ServiceAuth.getUser(username),
    enabled,
  });
}

export async function checkAndFetchUser(
  username: string,
): Promise<IUser | null> {
  const cachedUser = queryClient.getQueryData<IUser>(
    createKeyGetUser({ username }),
  );
  if (cachedUser) return cachedUser;

  const user = await queryClient.fetchQuery<IUser>({
    queryKey: createKeyGetUser({ username }),
    queryFn: () => ServiceAuth.getUser(username),
    staleTime: Infinity,
  });

  return user;
}
