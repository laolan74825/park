import {http} from '@/api/http/http';
import type { ContractData, ContractQuery } from '@/types/types';


export const getContractList = (data?: ContractQuery) =>
  http.post<ContractData[]>('/query/contracts', data);
