import ServiceClassify from '@/api/classifyApi';
import { IColor } from '@/models/classify.model';
import { createQueryKey } from '@/queries/core';
import { useQuery } from '@tanstack/react-query';

export function useGetListColor() {
  const { data, isFetched, isFetching } = useQuery<IColor[]>({
    queryKey: createQueryKey('colors', {}),
    queryFn: async () => {
      return await ServiceClassify.getColors();
    },
  });
  return {
    colors: (data || []) as IColor[],
    isFetched,
    isFetching,
  };
}
