import FriendService from '@/api/friendApi';
import { createQueryKey, queryClient } from '@/queries/core';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createKeyGetFriends } from './useGetFriends';

export function useAcceptRequestFriend() {
  return useMutation({
    mutationKey: createQueryKey('acceptRequestFriend', {}),
    mutationFn: async (userId: string) => {
      return await FriendService.acceptRequestFriend(userId);
    },
    onSuccess: () => {
      // Invalidate and refetch friend requests
      queryClient.invalidateQueries({
        queryKey: createQueryKey('fetchListRequestFriend', {}),
      });
      // Invalidate and refetch friends list
      queryClient.invalidateQueries({
        queryKey: createKeyGetFriends({ name: '' }),
      });
      toast.success('Đã chấp nhận lời mời kết bạn');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Không thể chấp nhận lời mời kết bạn');
    },
  });
}
