import type { CustomerData } from '@/types/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface CustomerState {
  customer: CustomerData | null;
  setCustomerInfo: (customer: CustomerData) => void;
  clearCustomerInfo: () => void;
}

export const useCustomerStore = create<CustomerState>()(
  devtools(
    (set) => ({
      customer: null,
      setCustomerInfo: (customer) => set({ customer }),
      clearCustomerInfo: () => set({ customer: null }),
    }),
    { name: 'customer-store'}
  )
);

// if (import.meta.env.DEV) {
//   window.zustandStore = { ...window.zustandStore, useCustomerStore };
// }
