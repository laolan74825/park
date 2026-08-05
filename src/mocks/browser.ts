import { setupWorker, type SetupWorker } from 'msw/browser';
import { handlers } from './handlers';

// 创建 worker
export const worker: SetupWorker = setupWorker(...handlers);

// export const startWorker = async () => {
//   await worker.start({
//     onUnhandledRequest: 'bypass',
//   });
// };
