# 🚀 Alova 3.x + React 19 + TypeScript 完整教程

## 一、环境准备与项目初始化

### 1. 创建 React 19 项目（使用 Vite）

```bash
# 使用 pnpm 创建项目
pnpm create vite@latest my-alova-app --template react-ts

# 进入项目目录
cd my-alova-app

# 安装依赖
pnpm install     // 新版的vite 创建项目时，安装依赖这个步骤可省略

# 启动开发服务器
pnpm dev
```

### 2. 安装 Alova 3.x 及相关依赖

```bash
# 安装 alova 核心库
pnpm add alova
```

这是唯一必需的包，包含：
核心请求引擎
缓存策略、请求共享、防抖等核心功能
Fetch 适配器（ alova/fetch 子路径导出，无需单独安装）

### 3. 总结对照表

浏览器 + React 19需要的包（有的可能已经内置，有的可能需要额外安装，需测试确认）

| 场景             | 需要安装的包                 |
| :--------------- | :--------------------------- |
| 浏览器 + 原生 JS | 只需 alova                   |
| 浏览器 + React   | alova + @alova/react         |
| 浏览器 + Svelte  | alova + @alova/svelte        |
| 浏览器 + Vue     | alova + @alova/vue           |
| 需要 Axios 功能  | alova + @alova/adapter-axios |
| Mock 数据        | 额外加 @alova/mock           |
| Node.js / 服务端 | alova + @alova/adapter-xhr   |

## 二、Alova 3.x 核心变化（重要！）

根据 Alova 3.0 发布日志，3.x 版本有以下重大结构调整：

### 主要变更点

| 2.x 版本                | 3.x 版本                     | 说明                               |
| :---------------------- | :--------------------------- | :--------------------------------- |
| `@alova/scene-react`    | `alova/client`               | 场景 Hooks 合并到 client 包        |
| `alova/GlobalFetch`     | `alova/fetch` (adapterFetch) | 适配器路径变更，GlobalFetch 已废弃 |
| `VueHook` / `ReactHook` | `alova/react`                | 状态 Hook 路径简化                 |
| `getMethodKey`          | `key` 函数                   | 从 `@alova/shared/function` 导入   |

### 3.x 标准导入方式

```typescript
// ✅ 3.x 正确导入方式
import { createAlova } from 'alova';
import ReactHook from 'alova/react'; // React 状态 Hook
import adapterFetch from 'alova/fetch'; // Fetch 适配器
import { useRequest, useWatcher, usePagination } from 'alova/client'; // 客户端 Hooks
```

## 三、基础配置

### 1. 创建 Alova 实例 (src/api/alova.ts)

```TypeScript
import { createAlova, Method } from 'alova';
import ReactHook from 'alova/react';
import adapterFetch from 'alova/fetch';

// 定义通用响应类型
export interface ApiResponse<T = undefined> {
  code: number;
  data: T;
  message: string;
}

// 创建 Alova 实例
export const alovaInstance = createAlova({
  baseURL: 'https://api.example.com',
  statesHook: ReactHook, // React 19 状态管理
  requestAdapter: adapterFetch(), // 使用 Fetch API

  // 全局请求配置,10秒超时结束请求并报错
  timeout: 10000,

  // 请求拦截器
  beforeRequest(request: Method) {
    // 添加认证 Token
    const token = localStorage.getItem('token');  // 从本地存储获取 Token
    if (token) {
      request.config.headers.Authorization = `Bearer ${token}`;
    }

    // 默认 Content-Type
    request.config.headers ||= {};
    request.config.headers['Content-Type'] ??= 'application/json';

  },

  // 响应拦截器（responded 替代 transformResponse）
  responded: {
    // 成功响应处理
    onSuccess: async <T>(response: Response): Promise<T> => {
      // 1. 检查 HTTP 状态
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // 2. 检查内容类型（可选）
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Expected JSON response');
      }

      // 3. 解析响应结果为对象
      const result = await response.json();

      // 4. 检查业务状态码
      if (result.code !== 200) {
        throw new Error(result.message || '请求失败');
      }

      // 5. 返回数据
      return result.data as T;
    },

    // 错误响应处理
      // 避免重复提示错误信息
      if (error.message?.includes('[handled]')) {
        // 使用 toast 需安装sonner, pnpm add sonner,
        // 导入语句 import { toast } from 'sonner';
        // 在根组件中添加 import { Toaster } from 'sonner'和<Toaster />;
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
      expire: 1000 * 60 * 5
    }
  }
});

// 导出类型安全的请求方法
export const http = {
  get: <T>(url: string, config?: Record<string, unknown>) =>
    alovaInstance.Get<ApiResponse<T>, unknown>(url, config),

  post: <T>(url: string, data?: unknown, config?: Record<string, unknown>) =>
    alovaInstance.Post<ApiResponse<T>, unknown>(url, data, config),

  put: <T>(url: string, data?: unknown, config?: Record<string, unknown>) =>
    alovaInstance.Put<ApiResponse<T>, unknown>(url, data, config),

  delete: <T>(url: string, config?: Record<string, unknown>) =>
    alovaInstance.Delete<ApiResponse<T>, unknown>(url, config),

  patch: <T>(url: string, data?: unknown, config?: Record<string, unknown>) =>
    alovaInstance.Patch<ApiResponse<T>, unknown>(url, data, config),
};
```

## 四、React Hooks 实战

### 1. useRequest - 自动管理请求状态

useRequest 是 Alova 最常用的 Hook，用于组件加载时自动获取数据 。

```typescript
// src/hooks/useUser.ts
import { useRequest } from 'alova/client';
import { http } from '../api/alova';

interface User {
  id: number;
  name: string;
  email: string;
}

// 获取用户信息
export const useUser = (userId: number) => {
  const {
    data: user,
    loading,
    error,
    send: refresh, // 手动刷新
    abort // 中断请求
  } = useRequest(
    () => http.get<User>(`/users/${userId}`),
    {
      // 依赖变化时重新请求
      refreshDeps: [userId],

      // 初始数据
      initialData: undefined as User | undefined,

      // 立即执行
      immediate: true,

      // 强制请求（穿透缓存）
      force: false,
    }
  );

  return {
    user,
    loading,
    error,
    refresh,
    abort
  };
};

// 组件中使用
import { FC } from 'react';
import { useUser } from './hooks/useUser';

const UserProfile: FC<{ userId: number }> = ({ userId }) => {
  const { user, loading, error, refresh } = useUser(userId);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;
  if (!user) return <div>无数据</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={refresh}>刷新</button>
    </div>
  );
};
```

### 2. 手动触发请求（表单提交场景）

```TypeScript
import { useState } from 'react';
import { useRequest } from 'alova/client';
import { http } from '../api/alova';

interface LoginForm {
  username: string;
  password: string;
}

const LoginComponent = () => {
  const [form, setForm] = useState<LoginForm>({ username: '', password: '' });

  // immediate: false 禁止自动发送
  const {
    send: login,
    loading,
    error,
    data
  } = useRequest(
    (formData: LoginForm) => http.post('/auth/login', formData),
    {
      immediate: false // 手动触发
    }
  ).onSuccess((event) => {
    // 3.x 新特性：链式调用绑定事件
    console.log('登录成功:', event.data);
    localStorage.setItem('token', event.data.token);
  }).onError((event) => {
    console.error('登录失败:', event.error);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // send 函数传入参数，会传递给 method handler
      await login(form);
    } catch (err) {
      // 错误已在 onError 中处理
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={form.username}
        onChange={e => setForm({ ...form, username: e.target.value })}
      />
      <input
        type="password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit" disabled={loading}>
        {loading ? '登录中...' : '登录'}
      </button>
      {error && <span style={{ color: 'red' }}>{error.message}</span>}
    </form>
  );
};
```

### 3. useWatcher - 监听状态变化请求

适用于搜索、筛选、分页等场景 ：

```TypeScript
import { useState } from 'react';
import { useWatcher } from 'alova/client';
import { http } from '../api/alova';

interface SearchParams {
  keyword: string;
  page: number;
  pageSize: number;
}

interface SearchResult {
  list: Array<{ id: number; title: string }>;
  total: number;
}

const SearchComponent = () => {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);

  const {
    data: result,
    loading
  } = useWatcher(
    () => http.get<SearchResult>('/search', {
      params: { keyword, page, pageSize: 10 }
    }),
    [keyword, page], // 监听这些状态变化
    {
      immediate: false, // 初始不执行，等待变化
      debounce: 300, // 防抖 300ms
      abortLast: true // 自动中断上一次未完成的请求
    }
  );

  return (
    <div>
      <input
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        placeholder="搜索..."
      />
      {loading && <div>搜索中...</div>}
      <ul>
        {result?.list.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
      <button onClick={() => setPage(p => p + 1)}>下一页</button>
    </div>
  );
};
```

### 4. usePagination - 分页策略（推荐）

```TypeScript
import { usePagination } from 'alova/client';
import { http } from '../api/alova';

interface Item {
  id: number;
  title: string;
}

const PaginationComponent = () => {
  const {
    data,
    loading,
    page,
    pageSize,
    pageCount,
    total,
    isLastPage,
    fetching,
    onFetchError,

    // 页码操作
    refresh,
    insert,
    remove,
    replace,
    reload,

    // 翻页
    toPreviousPage,
    toNextPage,
    toLastPage,
    toFirstPage,
    toPage
  } = usePagination(
    (page, pageSize) =>
      http.get<{ list: Item[]; total: number }>('/list', {
        params: { page, pageSize }
      }),
    {
      initialPage: 1,
      initialPageSize: 10,
      preloadPreviousPage: true, // 预加载上一页
      preloadNextPage: true, // 预加载下一页
      total: response => response.total,
      data: response => response.list
    }
  );

  return (
    <div>
      <ul>
        {data?.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>

      <div>
        <button onClick={toPreviousPage} disabled={page === 1}>
          上一页
        </button>
        <span>第 {page} / {pageCount} 页，共 {total} 条</span>
        <button onClick={toNextPage} disabled={isLastPage}>
          下一页
        </button>
      </div>
    </div>
  );
};
```

## 五、高级功能

### 1. 缓存策略详解

Alova 3.x 支持两种缓存模式 ：

```TypeScript
// 1. Memory 模式（内存缓存）
const getUser = alovaInstance.Get('/user/1', {
cacheFor: {
mode: 'memory',
expire: 1000 * 60 * 5 // 5分钟过期
}
});

// 2. Restore 模式（内存 + Storage）
const getConfig = alovaInstance.Get('/config', {
cacheFor: {
mode: 'restore',
expire: 1000 * 60 * 60 * 24 // 24小时
}
});
```

### 2. 请求共享（自动合并相同请求）

Alova 自动合并相同 URL 和参数的请求，减少服务器压力 ：

```TypeScript
// 组件 A
const { data: dataA } = useRequest(alovaInstance.Get('/shared-data'));

// 组件 B（同时渲染）
const { data: dataB } = useRequest(alovaInstance.Get('/shared-data'));

// 实际只发送 1 个请求，两个组件共享结果
```

### 3. 数据预拉取（useFetcher）

```TypeScript
import { useFetcher } from 'alova/client';
import { alovaInstance } from '../api/alova';

const PrefetchComponent = () => {
  const { fetch, loading } = useFetcher();

  // 鼠标悬停时预加载详情数据
  const handleMouseEnter = (id: number) => {
    fetch(alovaInstance.Get(`/detail/${id}`));
  };

  return (
    <div>
      {list.map(item => (
        <div
          key={item.id}
          onMouseEnter={() => handleMouseEnter(item.id)}
        >
          {item.title}
        </div>
      ))}
    </div>
  );
};
```

### 4. 中间件（Middleware）

3.x 中间件使用 proxyStates 替代直接访问状态 ：

```TypeScript
useRequest(method, {
  middleware: async ({
    method,
    cachedResponse,
    proxyStates, // 3.x 使用代理状态
    args,
    send,
    abort,
    controlLoading
  }, next) => {
    // 自定义 loading 控制
    controlLoading(true);

    // 修改状态（通过代理）
    proxyStates.loading.v = true;

    // 继续请求
    await next();

    // 请求后处理
    console.log('请求完成，数据:', proxyStates.data.v);
  }
});
```

## 六、TypeScript 类型最佳实践

### 1. 全局类型声明 (src/types/alova.d.ts)

````TypeScript
import { AlovaGenerics, Method } from 'alova';

// 扩展 Alova 实例类型
declare module 'alova' {
interface AlovaGenerics {
 // 自定义全局配置
 meta?: {
   auth?: boolean;
   loading?: boolean;
 };
}

### 2. 接口 API 管理 (src/api/modules/user.ts)

```TypeScript
import { alovaInstance } from '../alova';

export interface User {
id: number;
name: string;
email: string;
}

export const userApi = {
// 获取用户详情
getById: (id: number) =>
 alovaInstance.Get<User>(`/users/${id}`),

// 更新用户
update: (id: number, data: Partial<User>) =>
 alovaInstance.Put<User>(`/users/${id}`, data),

// 删除用户
delete: (id: number) =>
 alovaInstance.Delete<void>(`/users/${id}`)
};
````

## 七、完整项目结构

```plain
src/
├── api/
│ ├── alova.ts # Alova 实例配置
│ ├── modules/ # 按模块划分 API
│ │ ├── user.ts
│ │ └── post.ts
│ └── types/ # 全局类型
├── hooks/ # 封装业务 Hooks
│ ├── useUser.ts
│ └── useAuth.ts
├── components/
└── App.tsx
```

## 八、与 React 19 的兼容性说明

React 19 完全兼容 Alova 3.x 的 ReactHook
支持 React 19 的 Compiler 优化
Hooks 遵循 React 规则，可在 Server Components 中使用（需配合 alova/server）
这份教程涵盖了 Alova 3.x 在 React 19 + TypeScript 环境下的核心用法。关键记住 3.x 的导入路径变化：alova/react 和 alova/client 是新的标准入口。
