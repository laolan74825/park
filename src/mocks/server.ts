import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// 创建 server（用于测试）
export const server = setupServer(...handlers);
