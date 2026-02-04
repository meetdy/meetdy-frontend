import FriendService from '@/api/friendApi';
import { createQueryKey, queryClient } from '@/queries/core';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useDeleteSentRequestFriend() {
  return useMutation({
    mutationKey: createQueryKey('deleteSentRequestFriend', {}),
    mutationFn: async (userId: string) => {
      return await FriendService.deleteSentRequestFriend(userId);
    },
    onSuccess: () => {
      // Invalidate my sent requests list
      queryClient.invalidateQueries({
        queryKey: createQueryKey('fetchMyRequestFriend', {}),
      });
      toast.success('Đã hủy lời mời kết bạn');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Không thể hủy lời mời');
    },
  });
}
