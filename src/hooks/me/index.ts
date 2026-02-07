import { useQuery, useMutation } from '@tanstack/react-query';

import ServiceMe from '@/api/meApi';
import { queryClient } from '@/queries/core';

import { IUserProfile } from '@/models/auth.model';
import {
  IAvatarResponse,
  IChangePassword,
  ICoverImageResponse,
  IRevokeTokenResponse,
  TRevokeToken,
  TUpdateProfile,
} from '@/models/me.model';

export const ME_QUERY_KEY = {
  ROOT: 'me',
  PROFILE: 'profile',
};

export const meFactory = {
  all: () => [ME_QUERY_KEY.ROOT],

  profile: () => [ME_QUERY_KEY.ROOT, ME_QUERY_KEY.PROFILE],
};

/* -------------------------------------------------------------------------- */
/*                                   Queries                                  */
/* -------------------------------------------------------------------------- */

export function useGetProfile({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery<IUserProfile>({
    queryKey: meFactory.profile(),
    queryFn: ServiceMe.getProfile,
    enabled,
  });
}

/**
 * Used outside React (app bootstrap, auth restore, guards)
 */
export async function fetchUserProfile(): Promise<IUserProfile> {
  return queryClient.fetchQuery<IUserProfile>({
    queryKey: meFactory.profile(),
    queryFn: ServiceMe.getProfile,
    staleTime: 5 * 60 * 1000,
  });
}

/* -------------------------------------------------------------------------- */
/*                                  Mutations                                 */
/* -------------------------------------------------------------------------- */

function invalidateProfile() {
  queryClient.invalidateQueries({
    queryKey: meFactory.profile(),
  });
}

/* ----------------------------- Update Profile ----------------------------- */

export function useUpdateProfile() {
  return useMutation<void, unknown, TUpdateProfile>({
    mutationFn: ServiceMe.updateProfile,
    onSuccess: invalidateProfile,
  });
}

/* ----------------------------- Update Avatar ------------------------------ */

export function useUpdateAvatar() {
  return useMutation<IAvatarResponse, unknown, FormData>({
    mutationFn: ServiceMe.updateAvatar,
    onSuccess: invalidateProfile,
  });
}

/* --------------------------- Update Cover Image --------------------------- */

export function useUpdateCoverImage() {
  return useMutation<ICoverImageResponse, unknown, FormData>({
    mutationFn: ServiceMe.updateCoverImage,
    onSuccess: invalidateProfile,
  });
}

/* ---------------------------- Change Password ----------------------------- */

export function useChangePassword() {
  return useMutation<void, unknown, IChangePassword>({
    mutationFn: ServiceMe.changePassword,
  });
}

/* ------------------------------ Revoke Token ------------------------------ */

export function useRevokeToken() {
  return useMutation<IRevokeTokenResponse, unknown, TRevokeToken>({
    mutationFn: ServiceMe.revokeToken,

    onSuccess: () => {
      /**
       * Token revoked → user session may change
       * Safe choice: clear all "me" cache
       */
      queryClient.invalidateQueries({
        queryKey: meFactory.all(),
      });
    },
  });
}
