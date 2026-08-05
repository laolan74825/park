import { useLocation } from 'react-router-dom';
import { useMenuStore } from '@/store';
import { Breadcrumb } from 'antd';

interface MenuItem {
  key: string;
  label: string;
  children?: MenuItem[];
}

function findBreadcrumbPath(Path: string, menuItems: MenuItem[]): string[] {
  const pathSegments: string[] = [];
  function findPath(currentPath: string, items: MenuItem[]) {
    for (const item of items) {
      if (currentPath.startsWith(item.key)) {
        pathSegments.push(item.label);
        if (item.children) {
          findPath(currentPath, item.children);
        }
        break; // 找到匹配项后退出循环
      }
    }
    if (pathSegments.length == 0) pathSegments.push(items[0].label);
    return pathSegments;
  }

  return findPath(Path, menuItems);
}

function MyBreadCrumb() {
  const location = useLocation();
  const menuList = useMenuStore((state) => state.menuData);

  const breadcrumbPath = findBreadcrumbPath(location.pathname, menuList).map(
    (item) => ({ title: item })
  );

  return <Breadcrumb items={breadcrumbPath} className="breadcrumb mt mb" />;
}

export default MyBreadCrumb;
