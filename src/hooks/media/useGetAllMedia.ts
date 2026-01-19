import { useQuery } from '@tanstack/react-query';
import { createQueryKey } from '@/queries/core';
import ServiceMedia, { IMedia, TFetchMediaParams } from '@/api/mediaApi';

interface UseFetchAllMediaProps {
  params: TFetchMediaParams;
  enabled?: boolean;
}
export function useGetAllMedia({
  params,
  enabled = true,
}: UseFetchAllMediaProps) {
  return useQuery<IMedia[]>({
    queryKey: createQueryKey('fetchAllMedia', params, {}),
    queryFn: () => ServiceMedia.getAllMedia(params),
    enabled,
  });
}
