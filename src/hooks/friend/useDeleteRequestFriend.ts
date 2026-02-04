import FriendService from '@/api/friendApi';
import { createQueryKey, queryClient } from '@/queries/core';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useDeleteRequestFriend() {
  return useMutation({
    mutationKey: createQueryKey('deleteRequestFriend', {}),
    mutationFn: async (userId: string) => {
      return await FriendService.deleteRequestFriend(userId);
    },
    onSuccess: () => {
      // Invalidate friend requests list
      queryClient.invalidateQueries({
        queryKey: createQueryKey('fetchListRequestFriend', {}),
      });
      toast.success('Đã từ chối lời mời kết bạn');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Không thể từ chối lời mời');
    },
  });
}
