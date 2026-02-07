import { useQuery, useMutation } from '@tanstack/react-query';

import ServiceAuth from '@/api/authApi';
import { queryClient } from '@/queries/core';

import {
  IUser,
  TConfirmAccount,
  TConfirmPassword,
  TLogin,
  TLoginResponse,
  TRegister,
} from '@/models/auth.model';

export const AUTH_QUERY_KEY = {
  ROOT: 'auth',
  USER: 'user',
};

export const authFactory = {
  all: () => [AUTH_QUERY_KEY.ROOT],

  user: (username: string) => [
    AUTH_QUERY_KEY.ROOT,
    AUTH_QUERY_KEY.USER,
    username,
  ],
};

export function useGetUser(username: string, enabled = true) {
  return useQuery<IUser>({
    queryKey: authFactory.user(username),
    queryFn: () => ServiceAuth.getUser(username),
    enabled: !!username && enabled,
  });
}

/* -------------------------------------------------------------------------- */
/*                                  Mutations                                 */
/* -------------------------------------------------------------------------- */

/* --------------------------------- Login --------------------------------- */

export function useLogin() {
  return useMutation<TLoginResponse, unknown, TLogin>({
    mutationFn: ServiceAuth.login,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authFactory.all(),
      });
    },
  });
}

/* ------------------------------- Register -------------------------------- */

export function useRegister() {
  return useMutation<void, unknown, TRegister>({
    mutationFn: ServiceAuth.register,
  });
}

/* ---------------------------- Confirm Account ----------------------------- */

export function useConfirmAccount() {
  return useMutation<void, unknown, TConfirmAccount>({
    mutationFn: ServiceAuth.confirmAccount,
  });
}

/* --------------------------- Confirm Password ----------------------------- */

export function useConfirmPassword() {
  return useMutation<void, unknown, TConfirmPassword>({
    mutationFn: ServiceAuth.confirmPassword,
  });
}

/* ---------------------------- Forgot Password ----------------------------- */

export function useForgotPassword() {
  return useMutation<void, unknown, string>({
    mutationFn: ServiceAuth.forgot,
  });
}
