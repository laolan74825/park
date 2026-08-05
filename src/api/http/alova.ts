import { createAlova, Method } from 'alova';
import ReactHook from 'alova/react';
import adapterFetch from 'alova/fetch';
import { useUserStore } from '@/store/index';
import { toast } from 'sonner';

// 创建 Alova 实例
export const alovaInstance = createAlova({
  baseURL: 'https://www.demo.com', // API 基础 URL
  statesHook: ReactHook, // React 19 状态管理
  requestAdapter: adapterFetch(), // 使用 Fetch API
  timeout: 5000, // 请求超时时间

  // 请求拦截器
  beforeRequest(request: Method) {
    // 确保 headers 对象存在
    request.config.headers ||= {};

    // 默认 Content-Type
    request.config.headers['Content-Type'] ??= 'application/json';

    // 添加认证 Token
    const token = useUserStore.getState().user?.token;
    if (token) {
      request.config.headers.Authorization = `Bearer ${token}`;
    }
  },

  // 响应拦截器（responded 替代 transformResponse）
  responded: {
    // 成功响应处理
    onSuccess: async <T>(response: Response): Promise<T> => {
      // 1. 检查 HTTP 状态
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: 请求失败`);
      }

      // 2. 检查内容类型（可选）
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Expected JSON response');
      }

      // 3. 响应结果为空时返回 undefined
      if (
        response.status === 204 ||
        !contentType?.includes('application/json')
      ) {
        return undefined as T;
      }

      // 4. 解析响应结果为对象
      const result = await response.json();

      // 5. 检查业务状态码
      const SUCCESS_CODES = [0, 200, 201, '0', '200', '201', 'SUCCESS'];
      if (!SUCCESS_CODES.includes(result.code)) {
        throw new Error(result.message || '请求失败');
      }

      // 6. 返回数据
      return result;
    },

    // 错误响应处理
    onError: (error: Error) => {
      console.error('请求错误:', error);

      // 避免重复提示错误信息
      if (error.message?.includes('[handled]')) {
        toast.error(error.message || '网络异常，请稍后重试');
      }
      throw error;
    },

    // 请求完成处理（无论成功与否）
    onComplete: () => {
      // 清理工作
      // setLoading(false); // 假设需要关闭按钮 loading
      // hidePageLoading(); // 假设需要隐藏全屏 loading
    },
  },

  // 全局缓存配置
  cacheFor: {
    // Memory 模式：内存缓存 5 分钟
    GET: {
      mode: 'memory',
      expire: 1000 * 60 * 5,
    },
  },
});
