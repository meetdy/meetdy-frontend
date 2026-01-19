import { useQuery } from '@tanstack/react-query';
import { createQueryKey } from '@/queries/core';
import { IMessage } from '@/models/message.model';
import ServiceChannel from '@/api/channelApi';

type TFetchMessageInChannel = {
  channelId: string;
  page: number;
  size: number;
};

const fetchMessageInChannelKey = ({
  channelId,
  page,
  size,
}: TFetchMessageInChannel) =>
  createQueryKey('fetchMessageInChannel', { channelId, page, size });

interface UseFetchMessageInChannelProps {
  params: TFetchMessageInChannel;
  enabled?: boolean;
}

export function useGetMessageInChannel({
  params: { channelId, page, size },
  enabled = true,
}: UseFetchMessageInChannelProps) {
  return useQuery<{ data: IMessage[]; total: number }>({
    queryKey: fetchMessageInChannelKey({ channelId, page, size }),
    queryFn: () => ServiceChannel.getMessageInChannel(channelId, page, size),
    enabled,
  });
}
