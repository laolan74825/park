import React, { useMemo, useState, useCallback } from 'react';
import icons from './iconList';
import { Menu } from 'antd';
import logo from '@/assets/logo.png';
import './index.scss';
import type { MenuData } from '@/types/types';
import { useMenuStore } from '@/store/user';
import { useNavigate, useLocation } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';

type MenuItemFromData = {
  key: React.Key;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItemFromData[];
};

function mapMenuItems(
  items: MenuData[],
  icons: Record<string, React.ReactNode>
): MenuItemFromData[] {
  return items
    .filter((item) => item.show !== false)
    .map((item) => {
      const IconComponent = item.icon && icons[item.icon];
      return {
        key: item.key,
        label: item.label,
        icon: IconComponent ? IconComponent : null,
        children:
          item.children && item.children.length > 0
            ? mapMenuItems(item.children, icons)
            : undefined,
      };
    });
}

function NavLeft() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuData = useMenuStore(useShallow((state) => state.menuData));

  const menuFromData = useMemo(() => {
    if (!menuData || menuData.length === 0) {
      return [];
    }
    return mapMenuItems(menuData, icons);
  }, [menuData]);

  // 路由推导的默认展开项
  const routeOpenKey = useMemo(() => {
    const pathParts = location.pathname.split('/');
    if (pathParts.length > 1 && pathParts[1]) {
      return `/${pathParts[1]}`;
    }
    return '';
  }, [location.pathname]);

  // 用户手动展开的 keys（用 Set 去重）
  const [userOpenKeys, setUserOpenKeys] = useState<Set<string>>(new Set());

  // 路由变化时，自动展开当前路由对应的父菜单
  useState(() => {
    if (routeOpenKey) {
      setUserOpenKeys((prev) => new Set([...prev, routeOpenKey]));
    }
  });

  // 合并：路由推导的 + 用户手动展开的
  const openKeys = useMemo(() => {
    const keys = new Set(userOpenKeys);
    if (routeOpenKey) {
      keys.add(routeOpenKey);
    }
    return Array.from(keys);
  }, [userOpenKeys, routeOpenKey]);

  // 默认选项处理
  const selectedKeys = useMemo(() => {
    // 根路径或空路径时，默认选中 /dashboard
    if (location.pathname === '/' || location.pathname === '') {
      return ['/dashboard'];
    }
    return [location.pathname];
  }, [location.pathname]);

  const handleOpenChange = useCallback((keys: string[]) => {
    setUserOpenKeys(new Set(keys));
  }, []);

  // 点击菜单项跳转路由
  const handleClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <div className="navleft">
      <div className="logo">
        <img src={logo} alt="logo" width={20} />
        <h1>鹏远智慧园区</h1>
      </div>
      <Menu
        mode="inline"
        theme="dark"
        items={menuFromData}
        onClick={handleClick}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        selectedKeys={selectedKeys}
      />
    </div>
  );
}

export default NavLeft;
