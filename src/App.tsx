import { RouterProvider, type RouteObject } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import router from './router';
import { Toaster } from 'sonner';
import { generateRoutes } from '@/utils/generateRoutes';
import type { MenuData } from '@/types/types';
import { useMenuStore, useUserStore } from '@/store/index';
import { useEffect, useState } from 'react';
import { getMenuLists } from './api';
import { Spin } from 'antd';

function App() {
  const setMenuData = useMenuStore((state) => state.setMenuData);
  const menuData = useMenuStore((state) => state.menuData);
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(false);

  const [finalRouter, setFinalRouter] = useState(() =>
    createBrowserRouter(router)
  );

  // 获取菜单数据
  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const res = await getMenuLists();
        if (isMounted) {
          setMenuData(res.data as MenuData[]);
        }
      } catch (err) {
        console.error('菜单请求失败', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMenu();
    return () => {
      isMounted = false;
    };
  }, [user, setMenuData]);

  // 生成动态路由
  useEffect(() => {
    if (!menuData?.length) return;

    const dynamicRoutes = generateRoutes(menuData);

    const routesWithIndex = [...dynamicRoutes];

    const newRouter = { ...routesWithIndex[0] };
    routesWithIndex[0] = {
      ...routesWithIndex[0],
      index: true,
      path: undefined,
    } as RouteObject;
    routesWithIndex.splice(1, 0, newRouter); // 添默认路由新建一个带路径的路由

    const newBaseRouters: RouteObject[] = [
      { ...router[0], children: routesWithIndex },
      ...router.slice(1),
    ];
    const rootRouter = newBaseRouters[0];

    if (rootRouter) {
      if (rootRouter.children?.length) {
        rootRouter.children[0].index = true;
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFinalRouter(createBrowserRouter(newBaseRouters));
  }, [menuData]);

  if (loading) {
    return (
      <div
        className="app-loading"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" />
        <div style={{ marginLeft: 10 }}>页面加载中...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <Toaster position="top-right" richColors />
      <RouterProvider router={finalRouter} />
    </div>
  );
}

export default App;
