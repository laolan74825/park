import {
  superAdminMenu,
  adminMenu,
  userMenu,
  customizeMenu,
} from '../mocks/data';
import type {
  Role,
  CustomerData,
  CustomerQuery,
  BuildingQuery,
  BuildingData,
} from '../types/types';
import { SimulatedDatabase } from '@/mocks/dataStore';

export function getMenuLists(role: Role) {
  switch (role) {
    case 'superAdmin':
      return superAdminMenu;
    case 'admin':
      return adminMenu;
    case 'user':
      return userMenu;
    default:
      return customizeMenu;
  }
}

// 辅助函数：数组分页切片
function sliceArray<T>(
  data: T[],
  page: number,
  pageSize: number,
  total: number
): T[] {
  let startIndex = (page - 1) * pageSize;
  let endIndex = startIndex + pageSize;
  if (startIndex >= total && total > 0) {
    startIndex = total - pageSize;
    endIndex = total;
  }
  return data.slice(startIndex, endIndex);
}

// 用户列表查询
export function getCustomers(
  params: CustomerQuery,
  data: SimulatedDatabase<CustomerData>
) {
  const { companyName, legalPerson, phone, page = 1, pageSize = 10 } = params;

  // 1. 先进行数据过滤
  const filteredData = data.getAll().filter((customer) => {
    if (companyName || legalPerson || phone) {
      // 使用括号明确优先级，只有当参数存在时才进行匹配
      const matchCompany = companyName
        ? customer.companyName.includes(companyName)
        : false;
      const matchLegal = legalPerson
        ? customer.legalPerson.includes(legalPerson)
        : false;
      const matchPhone = phone ? customer.phone.includes(phone) : false;

      // 任一满足则返回查询结果
      return matchCompany || matchLegal || matchPhone;
    } else {
      return true; // 没有参数时所有记录都是true，返回所有数据
    }
  });

  // 3. 获取总条数
  const total = filteredData.length;

  // 2. 再进行分页切片
  const finalData = sliceArray(filteredData, page, pageSize, total);
  return {
    finalData: finalData,
    total,
  };
}

// 楼宇列表查询
export function getBuildings(
  params: BuildingQuery,
  data: SimulatedDatabase<BuildingData>
) {
  const { buildingName, manager, status, page = 1, pageSize = 10 } = params;

  // 1. 先进行数据过滤
  const filteredData = data.getAll().filter((building) => {
    if (buildingName || manager || status) {
      // 使用括号明确优先级，只有当参数存在时才进行匹配
      const matchBuildingName = buildingName
        ? building.buildingName.includes(buildingName)
        : false;
      const matchManager = manager ? building.manager.includes(manager) : false;
      const matchStatus = status ? building.status === status : false;

      // 任一满足则返回查询结果
      return matchBuildingName || matchManager || matchStatus;
    } else {
      return true; // 没有参数时所有记录都是true，返回所有数据
    }
  });

  // 3. 获取总条数
  const total = filteredData.length;

  // 2. 再进行分页切片
  const finalData = sliceArray(filteredData, page, pageSize, total);
  return {
    finalData: finalData,
    total,
  };
}

// ===== 通用查询函数 =====

// 分页通用
interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// ========================================
// FilterConfig：关联数据对象类型和查询参数类型
// ========================================

interface FilterRule<D, V> {
  dataField: keyof D;
  matchType: 'exact' | 'includes';
  compare?: (dataValue: D[keyof D], paramValue: V) => boolean;
}

// 使用 Mapped Type 精确绑定 Q 的键和类型
type FilterConfig<
  D,
  Q extends Record<string, unknown> = Record<string, unknown>,
> = {
  [K in keyof Q]?: FilterRule<D, Q[K]>;
};
// ========================================
// queryData：双泛型
// ========================================

export function queryData<
  D extends Record<string, unknown> & { id: string },
  Q extends Record<string, unknown> = Record<string, unknown>,
>(
  params: Q & PaginationParams, // Q: 查询参数类型
  data: SimulatedDatabase<D>, // D: 数据类型
  config?: FilterConfig<D, Q> // 同时关联 D 和 Q
) {
  const { page = 1, pageSize = 10, ...filterParams } = params;

  const filteredData = data.getAll().filter((item: D) => {
    // item 明确为 D 类型
    const hasFilters = Object.keys(filterParams).some(
      (key) =>
        filterParams[key] !== undefined &&
        filterParams[key] !== null &&
        filterParams[key] !== ''
    );

    if (!hasFilters) return true;
    if (!config) {// 没有配置时默认使用 includes 模式匹配所有参数
      // 查找成功标志
      let isSuccess = false;
      Object.entries(filterParams).forEach(([paramKey, paramValue]) => {
        const dataValue = item[paramKey as keyof D];
        if (typeof dataValue === 'string' && typeof paramValue === 'string') {
          if (dataValue.includes(paramValue)) {
            isSuccess = true;
          }
        } else if (Array.isArray(dataValue)) {
          if (dataValue.includes(paramValue)) {
            isSuccess = true;
          }
        }else {
          if (dataValue === paramValue) {
            isSuccess = true;
          }
        }
      });
      return isSuccess;}
    return Object.entries(config).some(([paramKey, rule]) => {
      const paramValue = filterParams[paramKey];
      if (
        paramValue === undefined ||
        paramValue === null ||
        paramValue === ''
      ) {
        return false;
      }
      // 获取数据对象中的字段值（支持嵌套路径）
      const dataValue = getNestedValue(item, rule.dataField as string);

      if (rule.compare) {
        return rule.compare(dataValue, paramValue);
      }

      if (rule.matchType === 'exact') {
        return dataValue === paramValue;
      }
      if (rule.matchType === 'includes') {
        return String(dataValue).includes(String(paramValue));
      }

      return false;
    });
  });

  const total = filteredData.length;
  const finalData = sliceArray(filteredData, page, pageSize, total);

  return { finalData, total };
}

// 辅助函数：获取嵌套值
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((o, key) => o?.[key], obj);
}
