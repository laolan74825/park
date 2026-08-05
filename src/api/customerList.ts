import { http } from './http/http';
import type { ApiResponse, CustomerData, CustomerQuery, BatchDeleteResult } from '@/types/types';

export const getCustomerList = (
  data: CustomerQuery
): Promise<ApiResponse<CustomerData[]>> => {
  return http.get('/query/customers', data);
};

// 1. 删除单条
export const deleteCustomer = (id: string) =>
  http.delete<void>(`/delete/customer/${id}`);

// 2. 批量删除
export const deleteItems = (ids: string[]) =>
  http.post<ApiResponse<BatchDeleteResult>>('/delete/customers/batch', {ids} );

export const updateCustomer = (id: string, data: CustomerData) =>
  http.put<ApiResponse<CustomerData>>(`/update/customer/${id}`, data);

export const addCustomer = (data: CustomerData) =>
  http.post<ApiResponse<CustomerData>>('/add/customer', data);


// 3. 清空某分类下的所有项目(未使用)
export const clearItemsByCategory = (categoryId: string) =>
  http.delete<void>('/delete/users', { categoryId, action: 'clear' });
