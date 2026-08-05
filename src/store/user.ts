import type { MenuData } from '@/types/types';
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  token: string; // 登录凭证不建议存在前端
}

export interface UserState {
  user: User | null;
  setUserInfo: (user: User) => void;
  clearUserInfo: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUserInfo: (user) => set({ user }),
        clearUserInfo: () => {
          set({ user: null });
          localStorage.removeItem('user-storage');
        },
      }),
      {
        name: 'user-storage',
      }
    ),
    {
      name: 'user2-storage',
    }
  )
);

export interface MenuState {
  menuData: MenuData[];
  setMenuData: (data: MenuData[]) => void;
  clearMenuData: () => void;
}
export const useMenuStore = create<MenuState>()(
  devtools(
    persist(
      (set) => ({
        menuData: [],
        setMenuData: (data) => set({ menuData: data }),
        clearMenuData: () => {
          set({ menuData: [] });
          localStorage.removeItem('menu-storage');
        },
      }),
      {
        name: 'menu-storage',
      }
    ),
    {
      name: 'menu2-storage',
    }
  )
);



export const useIsLogin = () => useUserStore((state) => !!state.user);
