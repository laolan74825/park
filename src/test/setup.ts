import { beforeAll, afterAll, afterEach } from 'vitest';
import { server } from '../mocks/server';

// 在所有测试前启动 MSW
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// 每个测试后重置 handler，避免状态污染
afterEach(() => server.resetHandlers());

// 所有测试后关闭
afterAll(() => server.close());
