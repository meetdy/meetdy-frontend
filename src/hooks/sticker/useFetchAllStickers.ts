import ServiceSticker from '@/api/stickerApi';
import { createQueryKey } from '@/queries/core';
import { useQuery } from '@tanstack/react-query';

export function useFetchAllStickers({
  enabled = true,
}: { enabled?: boolean } = {}) {
  const { data, isFetched, isFetching } = useQuery<any>({
    queryKey: createQueryKey('getAllSticker', {}),
    queryFn: () => ServiceSticker.getAllSticker(),
    enabled,
  });

  return {
    stickers: (data || []) as any,
    isFetched,
    isFetching,
  };
}
