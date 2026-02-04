import FriendService from '@/api/friendApi';
import { createQueryKey, queryClient } from '@/queries/core';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createKeyGetFriends } from './useGetFriends';

export function useDeleteFriend() {
  return useMutation({
    mutationKey: createQueryKey('deleteFriend', {}),
    mutationFn: async (userId: string) => {
      return await FriendService.deleteFriend(userId);
    },
    onSuccess: () => {
      // Invalidate friends list
      queryClient.invalidateQueries({
        queryKey: createKeyGetFriends({ name: '' }),
      });
      toast.success('Đã xóa bạn bè');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Không thể xóa bạn bè');
    },
  });
}
