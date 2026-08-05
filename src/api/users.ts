import { http } from '@/api/http/http';
import type {
  // User,
  // UserRegister,
  // LoginRequest,
  LoginResponse,
  // MenuData,
  // DeleteResult,
  // BatchDeleteResult,
  LoginData,
} from '@/types/types';

//=======认证相关==========

// 用户登录接口
export const apiLogin = async (values: LoginData) => {
  const { name, password } = values;
  return await http.post<LoginResponse['data']>('/auth/login', {
    name,
    password,
  });
};

// 获取用户信息
export const getUserInfo = async () => {
  try {
    const res = await http.get('/auth/user');
    console.log('✅获取用户信息成功', res);
    return res;
  } catch (err) {
    console.log('❌获取用户信息失败：', err);
    throw err;
  }
};

// 获取菜单列表
export const getMenuLists = async () => {
  return await http.get('/menu');
};
