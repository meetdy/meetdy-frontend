import ServiceInfoWeb, { IWebInfo } from '@/api/infoWebApi';
import { createQueryKey } from '@/queries/core';
import { useQuery } from '@tanstack/react-query';

export function useGetInfoWeb({
  enabled = true,
}: { enabled?: boolean } = {}) {
  const { data } = useQuery<IWebInfo[]>({
    queryKey: createQueryKey('getInfoWeb', {}),
    queryFn: () => ServiceInfoWeb.getInfoWeb(),
    enabled,
  });

  return {
    infoWeb: data as IWebInfo[],
  };
}
