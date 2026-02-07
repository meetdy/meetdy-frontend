import ServiceCaptcha, { ICaptcha } from '@/api/captchaApi';
import { createQueryKey } from '@/queries/core';
import { useQuery } from '@tanstack/react-query';

export function useGetCaptcha({
  enabled = true,
}: { enabled?: boolean } = {}) {
  const { data, error, isFetched } = useQuery<ICaptcha>({
    queryKey: createQueryKey('fetchCaptcha', {}),
    queryFn: () => ServiceCaptcha.getCaptcha(),
    enabled,
  });

  return { captcha: data as ICaptcha, error, isFetched };
}
