/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react';
import RequireAuth from '@/utils/requireAuth';
import { Spin } from 'antd';

const Home = lazy(() => import('@/pages/home'));
const Login = lazy(() => import('@/pages/login'));
const NotFound = lazy(() => import('@/pages/notFound'));

const router = [
  {
    path: '/',
    element: (
      <RequireAuth allowed={true} redirectTo="/login">
        <Home />
      </RequireAuth>
    ),
  },
  {
    path: '/login',
    element: (
      <RequireAuth allowed={false} redirectTo="/dashboard">
        <Login />
      </RequireAuth>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense
        fallback={
          <div style={{ padding: 40 }}>
            <Spin size="large" />
          </div>
        }
      >
        <NotFound />
      </Suspense>
    ),
  },
];

export default router;
