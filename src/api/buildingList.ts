// 获取楼宇列表
import { http } from '@/api/http/http';
import type {
  BuildingQuery,
  BuildingData
} from '@/types/types';

export const getBuildingList = ( params: BuildingQuery) => {
  return http.get<BuildingData[]>('/query/buildings', params);
};

export const updateBuilding = (id: string, data: BuildingData) => {
  return http.put<BuildingData>(`/update/building/${id}`, data);
};

export const addBuilding = (data: BuildingData) => {
  return http.post<BuildingData>('/add/building', data);
};

export const deleteBuilding = (id: string) => {
  return http.delete<void>(`/delete/building/${id}`);
};
