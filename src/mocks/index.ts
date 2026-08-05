// 根据环境导出
export async function initMocks() {
  if (typeof window === 'undefined') {
    // Node 环境（测试）
    const { server } = await import('./server');
    await server.listen();
  } else {
    // 浏览器环境

    // 延迟启动 MSW，避免在页面加载期间拦截根请求。
    await new Promise((resolve) => setTimeout(resolve, 100));

    const { worker } = await import('./browser');
    await worker.start({
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
      onUnhandledRequest: 'bypass', // 未处理的请求直接透传
    });
  }
}
