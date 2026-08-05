import { useUserStore, useMenuStore } from './user';
import { useCustomerStore } from './customers';
import { useContractStore } from './contract';

export * from './counter';
export * from './user';
export * from './customers';
export * from './contract';

if (import.meta.env.DEV) {
  window.zustandStore = {
    useUserStore,
    useMenuStore,
    useCustomerStore,
    useContractStore,
  };
}
