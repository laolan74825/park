import { http } from './http/http';
import type { ApiResponse } from './http/http';
import type { EnergyType } from '../types/types';

// 获取能源数据
export const getEnergyData = async (): Promise<ApiResponse<EnergyType[]>> => {
  return await http.get('/energy');
};
