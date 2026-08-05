import type { RouteObject } from 'react-router-dom';
import type { MenuData } from '@/types/types';
import { componentMap } from '@/router/routersData';

export const generateRoutes = (menuData: MenuData[]): RouteObject[] => {
  return menuData.map((item) => {
    const hasChildren = item.children && item.children.length > 0;
    const routerObj: RouteObject = {
      path: item.key as string,
      element: hasChildren ? null : componentMap[item.key as string],
    };
    if (hasChildren) {
      routerObj.children = generateRoutes(item.children as MenuData[]);
    }
    return routerObj;
  });
};
