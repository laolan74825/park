// ===== 通用查询函数 =====

import type { SimulatedDatabase } from '../dataStore';

// 分页参数接口
interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// ========================================
// FilterConfig：关联数据对象类型和查询参数类型
// ========================================

type MatchType = 'exact' | 'includes';

type NestedKeyOf<D> = keyof D | `${string & keyof D}.${string}`;

interface FilterRule<D, V> {
  dataField: NestedKeyOf<D>;
  matchType?: MatchType;
  compare?: (dataValue: unknown, paramValue: V) => boolean;
}

// 使用 Mapped Type 精确绑定 Q 的键和类型
type FilterConfig<D, Q extends Record<string, unknown>> = {
  [K in keyof Q]?: FilterRule<D, Q[K]>;
};

// ========================================
// 查询函数
// ========================================
export function queryData<
  D extends Record<string, unknown> & { id: string },
  Q extends Record<string, unknown> = Record<string, unknown>,
>(
  data: SimulatedDatabase<D>,
  params?: Q & PaginationParams,
  config?: FilterConfig<D, Q>
) {
  const {
    page = 1,
    pageSize = 10,
    ...filterParams
  } = params ?? ({} as unknown as Q & PaginationParams);

  // 提取有效的过滤参数（排除空值）
  const activeFilters = Object.entries(filterParams).filter(
    ([, value]) => value !== undefined && value !== null && value !== ''
  ) as [keyof Q, Q[keyof Q]][];

  // 获取所有数据
  const allData = data.getAll();

  // 无过滤条件时直接返回全量
  if (activeFilters.length === 0) {
    const total = allData.length;
    return {
      data: sliceArray(allData, page, pageSize, total),
      total: total,
    };
  }

  const filteredData = allData.filter((item: D) => {
    // 使用 every：所有过滤条件都必须满足（AND 逻辑）
    return activeFilters.every(([paramKey, paramValue]) => {
      const rule = config?.[paramKey];

      if (!rule) {
        // 无配置时的默认匹配逻辑
        return defaultMatch(item, paramKey as string, paramValue);
      }

      // 有配置时使用规则匹配
      const dataValue = getNestedValue(item, rule.dataField as string);

      if (rule.compare) {
        return rule.compare(dataValue, paramValue);
      }

      const matchType = rule.matchType ?? 'includes';

      if (matchType === 'exact') {
        return dataValue === paramValue;
      }

      return String(dataValue).includes(String(paramValue));
    });
  });

  const total = filteredData.length;

  return {
    data: sliceArray(filteredData, page, pageSize, total),
    total: total,
  };
}

// 默认匹配逻辑：支持字符串 includes、数组 includes、严格相等
function defaultMatch<D extends Record<string, unknown>>(
  item: D,
  key: string,
  paramValue: unknown
): boolean {
  const dataValue = getNestedValue(item, key);

  if (typeof dataValue === 'string' && typeof paramValue === 'string') {
    return dataValue.includes(paramValue);
  }

  if (Array.isArray(dataValue)) {
    return dataValue.includes(paramValue);
  }

  return dataValue === paramValue;
}

// 辅助函数：获取嵌套值（类型安全版本）
function getNestedValue<T = unknown>(
  obj: Record<string, unknown>,
  path: string
): T | undefined {
  return path.split('.').reduce<unknown>((o, key) => {
    if (o === null || o === undefined) return undefined;
    if (typeof o !== 'object') return undefined;
    return (o as Record<string, unknown>)[key];
  }, obj) as T | undefined;
}

// 分页切片（假设已存在）
function sliceArray<T>(
  arr: T[],
  page: number,
  pageSize: number,
  total: number
): T[] {
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  return arr.slice(start, end);
}
