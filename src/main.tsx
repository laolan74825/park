import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './App.tsx';
import zhCN from 'antd/locale/zh_CN';
import { ConfigProvider } from 'antd';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';

dayjs.locale('zh-cn');

async function bootstrap() {
  if (import.meta.env.DEV) {
    const { initMocks } = await import('@/mocks/index.ts');
    await initMocks();
  }

  createRoot(document.getElementById('root')!).render(
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  );
}

bootstrap();
