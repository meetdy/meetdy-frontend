import ServiceClassify from '@/api/classifyApi';
import { IClassify } from '@/models/classify.model';
import { createQueryKey } from '@/queries/core';
import { useQuery } from '@tanstack/react-query';

export function useGetListClassify() {
  const { data, isFetched, isFetching } = useQuery<IClassify[]>({
    queryKey: createQueryKey('classifies', {}),
    queryFn: async () => {
      return await ServiceClassify.getClassifies();
    },
  });
  return {
    classifies: (data || []) as IClassify[],
    isFetched,
    isFetching,
  };
}
