import { useMutation, useQuery } from '@tanstack/react-query';

import ServiceAdmin from '@/api/adminApi';
import ServiceSticker from '@/api/stickerApi';
import { queryClient } from '@/queries/core';

import { IUser } from '@/models/auth.model';

/* -------------------------------------------------------------------------- */
/*                                  Query Key                                 */
/* -------------------------------------------------------------------------- */

export const ADMIN_QUERY_KEY = {
  ROOT: 'admin',

  USER: 'user',
  USERS: 'users',

  STICKER: 'sticker',
  GROUP_STICKER: 'group-sticker',
};

/* -------------------------------------------------------------------------- */
/*                               Query Factory                                */
/* -------------------------------------------------------------------------- */

export const adminFactory = {
  all: () => [ADMIN_QUERY_KEY.ROOT],

  users: (params: { username: string; page: number; size: number }) => [
    ADMIN_QUERY_KEY.ROOT,
    ADMIN_QUERY_KEY.USERS,
    params,
  ],

  groupStickers: () => [ADMIN_QUERY_KEY.ROOT, ADMIN_QUERY_KEY.GROUP_STICKER],

  stickers: () => [ADMIN_QUERY_KEY.ROOT, ADMIN_QUERY_KEY.STICKER],
};

/* -------------------------------------------------------------------------- */
/*                                User Queries                                */
/* -------------------------------------------------------------------------- */

interface UseGetUsersByUsernameProps {
  params: {
    username: string;
    page: number;
    size: number;
  };
  enabled?: boolean;
}

export function useGetUsersByUsername({
  params,
  enabled = true,
}: UseGetUsersByUsernameProps) {
  return useQuery<{
    data: IUser[];
    total: number;
  }>({
    queryKey: adminFactory.users(params),
    queryFn: () =>
      ServiceAdmin.getUsersByUsername(
        params.username,
        params.page,
        params.size,
      ),
    enabled,
  });
}

/* -------------------------------------------------------------------------- */
/*                               User Mutations                               */
/* -------------------------------------------------------------------------- */

export function useActiveUser() {
  return useMutation({
    mutationFn: ({ id, isActived }: { id: string; isActived: boolean }) =>
      ServiceAdmin.active(id, isActived),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminFactory.users({ username: '', page: 1, size: 10 }),
      });
    },
  });
}

export function useDeleteUser() {
  return useMutation({
    mutationFn: ({ id, isDeleted }: { id: string; isDeleted: boolean }) =>
      ServiceAdmin.delete(id, isDeleted),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminFactory.users({ username: '', page: 1, size: 10 }),
      });
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                              Sticker Queries                               */
/* -------------------------------------------------------------------------- */

export function useGetAllGroupSticker(enabled = true) {
  return useQuery({
    queryKey: adminFactory.groupStickers(),
    queryFn: ServiceAdmin.getAllGroupSticker,
    enabled,
  });
}

export function useGetAllStickers(enabled = true) {
  return useQuery({
    queryKey: adminFactory.stickers(),
    queryFn: ServiceSticker.getAllSticker,
    enabled,
  });
}

/* -------------------------------------------------------------------------- */
/*                             Sticker Mutations                              */
/* -------------------------------------------------------------------------- */

export function useAddSticker() {
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      ServiceAdmin.addSticker(id, file),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminFactory.stickers(),
      });
    },
  });
}

export function useDeleteSticker() {
  return useMutation({
    mutationFn: ({ id, url }: { id: string; url: string }) =>
      ServiceAdmin.deleteSticker(id, url),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminFactory.stickers(),
      });
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                          Group Sticker Mutations                            */
/* -------------------------------------------------------------------------- */

export function useCreateGroupSticker() {
  return useMutation({
    mutationFn: ({
      name,
      description,
    }: {
      name: string;
      description: string;
    }) => ServiceAdmin.createGroupSticker(name, description),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminFactory.groupStickers(),
      });
    },
  });
}

export function useUpdateGroupSticker() {
  return useMutation({
    mutationFn: ({
      id,
      name,
      description,
    }: {
      id: string;
      name: string;
      description: string;
    }) => ServiceAdmin.updateGroupSticker(id, name, description),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminFactory.groupStickers(),
      });
    },
  });
}

export function useDeleteGroupSticker() {
  return useMutation({
    mutationFn: (id: string) => ServiceAdmin.deleteGroupSticker(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminFactory.groupStickers(),
      });
    },
  });
}
