import _httpsAxios from '@/api/instance/_httpsAxios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export type HttpMethod =
  | 'get'
  | 'delete'
  | 'head'
  | 'options'
  | 'post'
  | 'put'
  | 'patch';
export type QueryParams = Record<string, any> | null | undefined;
export type RequestPayload = Record<string, any> | null | undefined;
type GetRequestData<T> = Partial<T> & { query: any };

async function get<T>(
  url: string,
  params?: QueryParams,
  config?: GetRequestData<AxiosRequestConfig>,
): Promise<AxiosResponse<T, any>> {
  const mergedConfig = { ...config, params };
  return _httpsAxios.get(url, mergedConfig);
}

async function post<T>(
  url: string,
  data?: RequestPayload,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T, any>> {
  return _httpsAxios.post(url, data, config);
}

async function patch<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T, any>> {
  return _httpsAxios.patch(url, data, config);
}

async function put<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T, any>> {
  return _httpsAxios.put(url, data, config);
}

async function del<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T, any>> {
  const mergedConfig = { ...config, data };
  return _httpsAxios.delete(url, mergedConfig);
}

export { get, del, patch, post, put };
