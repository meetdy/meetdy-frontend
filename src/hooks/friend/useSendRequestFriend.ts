import { useMutation } from '@tanstack/react-query';
import { createQueryKey, queryClient } from '@/queries/core';
import { toast } from 'sonner';
import FriendService from '@/api/friendApi';

export function useSendRequestFriend() {
  return useMutation({
    mutationKey: createQueryKey('sendRequestFriend', {}),
    mutationFn: async (userId: string) => {
      return await FriendService.sendRequestFriend(userId);
    },
    onSuccess: () => {
      // Invalidate my sent requests list
      queryClient.invalidateQueries({
        queryKey: createQueryKey('fetchMyRequestFriend', {}),
      });
      // Invalidate suggest friends to update UI
      queryClient.invalidateQueries({
        queryKey: createQueryKey('fetchSuggestFriend', {}),
        exact: false,
      });
      toast.success('Đã gửi lời mời kết bạn');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Không thể gửi lời mời kết bạn');
    },
  });
}
