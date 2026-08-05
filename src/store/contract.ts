import { getContractList } from '@/api';
import type { ContractData, ContractQuery } from '@/types/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface ContractState {
  contract: ContractData[] | null;
  total: number;
  loading: boolean;
  loaData: (
    queryData: ContractQuery,
    page: number,
    pageSize: number
  ) => Promise<void>;
}

export const useContractStore = create<ContractState>()(
  devtools(
    (set) => ({
      contract: null,
      total: 0,
      loading: false,
      loaData: async (queryData, page, pageSize) => {
        set({ loading: true });
        try {
          const res = await getContractList({ ...queryData, page, pageSize });
          set({ contract: res.data || null, total: res.total || 0 });
        } finally {
          set({ loading: false });
        }
      },
    }),
    { name: 'contract-store' }
  )
);
