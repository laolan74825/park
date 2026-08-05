import { alovaInstance } from './alova';
import type { ApiResponse } from '@/types/types';

// 匹配 Alova 的 RequestBody 类型
type RequestBody =
  | Record<string, unknown>
  | FormData
  | URLSearchParams
  | Blob
  | ArrayBuffer
  | ReadableStream
  | string;

interface HttpConfig {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  timeout?: number;
  [key: string]: unknown;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// 统一参数合并：GET 和 DELETE 将 data 合并到 params
const mergeConfig = <D extends RequestBody>(
  method: HttpMethod,
  data?: D,
  config?: HttpConfig
): HttpConfig | undefined => {
  if (method !== 'GET' && method !== 'DELETE') return config;

  return {
    ...config,
    params: { ...config?.params, ...(data as Record<string, unknown>) }
  };
};

const request = <T, D extends RequestBody = Record<string, unknown>>(
  method: HttpMethod,
  url: string,
  data?: D,
  config?: HttpConfig
) => {
  const mergedConfig = mergeConfig(method, data, config);

  switch (method) {
    case 'GET':
      return alovaInstance.Get<ApiResponse<T>>(url, mergedConfig);
    case 'POST':
      return alovaInstance.Post<ApiResponse<T>>(url, data , config);
    case 'PUT':
      return alovaInstance.Put<ApiResponse<T>>(url, data, config);
    case 'DELETE':
      return alovaInstance.Delete<ApiResponse<T>>(url, mergedConfig);
    case 'PATCH':
      return alovaInstance.Patch<ApiResponse<T>>(url, data, config);
    default:
      throw new Error(`Unsupported method: ${method}`);
  }
};

export const http = {
  get: <T>(url: string, params?: Record<string, unknown>, config?: HttpConfig) =>
    request<T>('GET', url, params, config),

  post: <T, D extends RequestBody = Record<string, unknown>>(url: string, data?: D, config?: HttpConfig) =>
    request<T, D>('POST', url, data, config),

  put: <T, D extends RequestBody = Record<string, unknown>>(url: string, data?: D, config?: HttpConfig) =>
    request<T, D>('PUT', url, data, config),

  delete: <T>(url: string, params?: Record<string, unknown>, config?: HttpConfig) =>
    request<T>('DELETE', url, params, config),

  patch: <T, D extends RequestBody = Record<string, unknown>>(url: string, data?: D, config?: HttpConfig) =>
    request<T, D>('PATCH', url, data, config),

  request: <T, D extends RequestBody = Record<string, unknown>>(method: HttpMethod, url: string, data?: D, config?: HttpConfig) =>
    request<T, D>(method, url, data, config),
};

// 防止 http 对象被篡改
Object.freeze(http);
