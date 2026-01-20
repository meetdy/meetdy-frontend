import ServiceInfoWeb, { IWebInfo } from '@/api/infoWebApi';
import { createQueryKey } from '@/queries/core';
import { useQuery } from '@tanstack/react-query';

const findValue = (data = [], name: string) => {
  if (!Array.isArray(data)) return null;
  return data.find((ele: any) => ele.name === name)?.value ?? null;
};

export function useGetInfoWeb({ enabled = true }: { enabled?: boolean } = {}) {
  const { data } = useQuery<IWebInfo[]>({
    queryKey: createQueryKey('getInfoWeb', {}),
    queryFn: () => ServiceInfoWeb.getInfoWeb(),
    enabled,
  });

  return {
    data: {
      general: findValue(data, 'infoweb') || {},
      developers: findValue(data, 'developers') || [],
      infoApp: findValue(data, 'infoapp') || {},
      features: findValue(data, 'features') || [],
    },
  };
}
