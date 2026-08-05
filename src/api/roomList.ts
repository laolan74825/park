import { http } from '@/api/http/http.ts';
import type { RoomData } from '@/types/types';

export const getRoomList = (
  id: string,
  params: { page?: number; pageSize?: number },
)=> {
  return http.get<RoomData[]>(`/query/rooms/${id}`, params );
};
