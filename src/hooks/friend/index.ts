import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import FriendService from '@/api/friendApi';
import { queryClient } from '@/queries/core';

import {
  TFetchFriends,
  IFriend,
  IRequestFriend,
  ISuggestFriend,
  IContact,
} from '@/models/friend.model';
import ServiceContacts from '@/api/contactsApi';

export const FRIEND_QUERY_KEY = {
  ROOT: 'friend',
  LIST: 'list',
  REQUEST: 'request',
  MY_REQUEST: 'my-request',
  SUGGEST: 'suggest',
  CONTACT: 'contact',
};

export const friendFactory = {
  all: () => [FRIEND_QUERY_KEY.ROOT],

  list: (params?: TFetchFriends) => [
    FRIEND_QUERY_KEY.ROOT,
    FRIEND_QUERY_KEY.LIST,
    params,
  ],

  request: () => [FRIEND_QUERY_KEY.ROOT, FRIEND_QUERY_KEY.REQUEST],

  myRequest: () => [FRIEND_QUERY_KEY.ROOT, FRIEND_QUERY_KEY.MY_REQUEST],

  suggest: () => [FRIEND_QUERY_KEY.ROOT, FRIEND_QUERY_KEY.SUGGEST],

  contact: () => [FRIEND_QUERY_KEY.ROOT, FRIEND_QUERY_KEY.CONTACT],
};

export function useGetFriends(params?: TFetchFriends) {
  return useQuery<IFriend[]>({
    queryKey: friendFactory.list(params),
    queryFn: () => FriendService.getFriends(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useGetListRequestFriend() {
  return useQuery<IRequestFriend[]>({
    queryKey: friendFactory.request(),
    queryFn: FriendService.getListRequestFriend,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  });
}

export function useGetMyRequestFriend(enabled = true) {
  return useQuery<IRequestFriend[]>({
    queryKey: friendFactory.myRequest(),
    queryFn: FriendService.getMyRequestFriend,
    enabled,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  });
}

export function useGetSuggestFriend() {
  return useQuery<ISuggestFriend[]>({
    queryKey: friendFactory.suggest(),
    queryFn: FriendService.getSuggestFriend,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
}

/* ------------------------------- Get Contacts ------------------------------ */

export function useGetContacts() {
  return useQuery<IContact[]>({
    queryKey: friendFactory.contact(),
    queryFn: () => ServiceContacts.getContacts(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
}

/* -------------------------------------------------------------------------- */
/*                                  Mutations                                 */
/* -------------------------------------------------------------------------- */

function invalidateFriendCore() {
  queryClient.invalidateQueries({
    queryKey: friendFactory.all(),
  });
}

/* --------------------------- Accept Friend Request ------------------------- */

export function useAcceptRequestFriend() {
  return useMutation({
    mutationFn: (userId: string) => FriendService.acceptRequestFriend(userId),

    onSuccess: () => {
      invalidateFriendCore();
      toast.success('Đã chấp nhận lời mời kết bạn');
    },

    onError: (error: any) => {
      toast.error(error?.message || 'Không thể chấp nhận lời mời kết bạn');
    },
  });
}

/* --------------------------- Reject Friend Request ------------------------- */

export function useRejectRequestFriend() {
  return useMutation({
    mutationFn: (userId: string) => FriendService.rejectRequestFriend(userId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: friendFactory.request(),
      });
      toast.success('Đã từ chối lời mời kết bạn');
    },

    onError: (error: any) => {
      toast.error(error?.message || 'Không thể từ chối lời mời');
    },
  });
}

/* --------------------------- Send Friend Request --------------------------- */

export function useSendRequestFriend() {
  return useMutation({
    mutationFn: (userId: string) => FriendService.sendRequestFriend(userId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: friendFactory.myRequest(),
      });
      queryClient.invalidateQueries({
        queryKey: friendFactory.suggest(),
      });
      toast.success('Đã gửi lời mời kết bạn');
    },

    onError: (error: any) => {
      toast.error(error?.message || 'Không thể gửi lời mời kết bạn');
    },
  });
}

/* ------------------------ Cancel Sent Friend Request ----------------------- */

export function useCancelSentRequestFriend() {
  return useMutation({
    mutationFn: (userId: string) =>
      FriendService.cancelSentRequestFriend(userId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: friendFactory.myRequest(),
      });
      toast.success('Đã hủy lời mời kết bạn');
    },

    onError: (error: any) => {
      toast.error(error?.message || 'Không thể hủy lời mời');
    },
  });
}

/* ------------------------------- Delete Friend ----------------------------- */

export function useDeleteFriend() {
  return useMutation({
    mutationFn: (userId: string) => FriendService.deleteFriend(userId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: friendFactory.list(),
      });
      toast.success('Đã xóa bạn bè');
    },

    onError: (error: any) => {
      toast.error(error?.message || 'Không thể xóa bạn bè');
    },
  });
}
