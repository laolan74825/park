import {
  useUserStore,
  useMenuStore,
  useCustomerStore,
  useContractStore,
} from '@/store/index';

// 如果不想引入具体类型，可以使用 any，但推荐明确类型
declare global {
  interface Window {
    zustandStore?: {
      useUserStore: typeof useUserStore;
      useMenuStore: typeof useMenuStore;
      useCustomerStore: typeof useCustomerStore;
      useContractStore: typeof useContractStore;
    };
  }
}

// 确保这是一个模块，以便 declare global 生效
export {};
