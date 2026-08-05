/*import { http, HttpResponse } from 'msw';
import type {
  LoginRequest,
  LoginResponse,
  User,
  Role,
  UserQuery,
} from '../types/type';
import { users, dashboardEchartsData, dataList } from './data';
import { SimulatedDatabase, customersDb, userDb } from './dataStore';
import { getUserInfo, getMenuLists, getUserList } from './myFunction';
// import bcrypt from 'bcryptjs'; // 实际项目中请使用 bcrypt 等库进行密码加密验证

// 模拟网络延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 请求处理器
export const handlers = [
  // GET 请求 - 获取用户列表
  http.get('/users', () => {
    return HttpResponse.json({
      code: 200,
      data: userDb as Omit<User, 'password' | 'token'>[],
      message: '获取用户列表成功',
    });
  }),

  // GET 请求 - 获取单个用户
  http.get('/api/users/:id', ({ params }) => {
    const { id } = params;
    const user = users.find((u) => u.id === id);

    if (!user) {
      return HttpResponse.json(
        { code: 404, message: '用户不存在' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      code: 200,
      data: user,
      message: 'success',
    });
  }),

  // POST 请求 - 登录
  http.post('https://www.demo.com/auth/login', async ({ request }) => {
    await delay(1000);
    const body = (await request.json()) as LoginRequest;
    const { name, password } = body;
    // 模拟用户查询
    const existUser = users.find((user) => user.name === name);

    // 模拟密码验证（测试环境中可以直接比较，实际项目中请使用 bcrypt 等库进行加密验证）
    if (!existUser || !(password === existUser.password)) {
      return HttpResponse.json(
        {
          code: 400,
          message: '用户不存在或密码错误',
        },
        { status: 400 }
      );
    } else {
      const { password: _password, ...userInfo } = existUser;
      return HttpResponse.json<LoginResponse>({
        code: 200,
        data: {
          user: userInfo,
        },
        message: '登录成功',
      });
    }
  }),

  // 菜单项接口
  http.get('https://www.demo.com/menu', async ({ request }) => {
    await delay(1000);
    // 1. 从请求头获取 Token
    const authHeader = request.headers.get('Authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : '';
    // 获取token对应的用户信息
    let user: User | undefined;
    if (!token) {
      user = undefined;
    } else {
      user = getUserInfo(token);
    }

    if (!user) {
      return HttpResponse.json(
        { code: 401, message: '未授权' },
        { status: 401 }
      );
    }
    const items = getMenuLists(user.role as Role);
    return HttpResponse.json({
      code: 200,
      data: items,
      message: '获取菜单成功',
    });
  }),

  // POST 请求 - 注册用户
  http.post('/users', async ({ request }) => {
    const body = (await request.json()) as Omit<User, 'id' | 'createdAt'>;

    const existUser = users.find((user) => user.name === body.name);

    if (existUser) {
      return HttpResponse.json(
        { code: 400, message: '用户已存在' },
        { status: 400 }
      );
    }
    // 密码加密(测试环境中可以不加密，实际项目中请务必加密)
    // const hashedPassword = await bcrypt.hash(body.password, 10);

    // 自动生成安全的 ID 和创建时间
    const newUser: User = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      name: body.name,
      email: body.email,
      role: body.role ?? 'user',
      avatar: body.avatar ?? ' ',
      password: body.password, // 密码直接存储在内存中，实际项目中请使用数据库并加密存储
      token: body.password, // 这里直接使用密码作为 token，实际项目中请使用安全的 token 生成方式
    };
    users.push(newUser);

    return HttpResponse.json(
      {
        code: 201,
        data: newUser as Omit<User, 'password'>,
        message: '用户注册成功',
      },
      { status: 201 }
    );
  }),

  // PUT 请求 - 更新用户
  http.put('/api/users/:id', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Partial<User>;
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return HttpResponse.json(
        { code: 404, message: '用户不存在' },
        { status: 404 }
      );
    }

    users[index] = { ...users[index], ...body };

    return HttpResponse.json({
      code: 200,
      data: users[index] as Omit<User, 'password' | 'token'>,
      message: '更新成功',
    });
  }),

  // DELETE 请求 - 删除用户
  http.delete('/api/users/:id', ({ params }) => {
    const { id } = params;
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return HttpResponse.json(
        { code: 404, message: '用户不存在' },
        { status: 404 }
      );
    }

    users.splice(index, 1);

    return HttpResponse.json({
      code: 200,
      message: '删除成功',
    });
  }),

  // dashboard里的图表接口
  http.get('https://www.demo.com/energy', () => {
    return HttpResponse.json({
      code: 200,
      data: dashboardEchartsData,
      message: '获取菜单成功',
    });
  }),

  // 获取客户户信息
  http.post('https://www.demo.com/user/list', async ({ request }) => {
    const query = await request.json() as UserQuery;
    const { finalData, total } = await getUserList(
      query,
      dataList
    );
    if (finalData) {
      return HttpResponse.json({
        code: 200,
        data: finalData,
        message: '获取客户数据成功',
        total: total,
      });
    } else {
      return HttpResponse.json({
        code: 400,
        message: '获取客户数据失败',
      });
    }
  }),
];

http.delete('https://www.demo.com/delete/user/:id', () => {
  return deleteUser(id);
});*/

// mocks/handlers.ts - MSW 请求处理器
import { http, HttpResponse } from 'msw';
import type { PathParams } from 'msw';
import type { User, UserRegister, ApiResponse, RoomData } from '@/types/types';
import type { Role, DeleteResult, BatchDeleteResult } from '@/types/types';
import type { ErrorDetail, CustomerQuery, CustomerData } from '@/types/types';
import type { BuildingData, BuildingQuery } from '@/types/types';
import type { ContractData, ContractQuery } from '@/types/types';
import { userDb, customerDb, energyDb, buildingDb, getRoomlist, contractDb } from './dataStore';
import { getMenuLists } from './myFunction';
import { queryData } from './utils/queryFunc';

// 模拟网络延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 辅助函数：构建 JSON 响应
const jsonResponse = <T>(
  payload: T,
  status: number = 200,
  message: string = '成功',
  total?: number
): HttpResponse<ApiResponse<T>> => {
  const body: ApiResponse<T> = {
    code: status,
    data: payload,
    message: message,
    total: total ?? 0,
  };
  return HttpResponse.json(body, { status });
};

// 辅助函数：错误响应
const errorResponse = (
  message: string,
  status: number,
  details?: ErrorDetail[]
): HttpResponse<ApiResponse<null>> => {
  const body: ApiResponse<null> = {
    code: status,
    data: null,
    message,
    errors: details, // 如果 ApiResponse 支持扩展
  };
  return HttpResponse.json(body, { status });
};

export const handlers = [
  // ===== POST /auth/login - 登录 =====
  http.post<
    PathParams,
    UserRegister,
    ApiResponse<{ user: User; token: string }> | ApiResponse<null>
  >('https://www.demo.com/auth/login', async ({ request }) => {
    await delay(1000);
    const body = (await request.json()) as UserRegister;

    const user = userDb.getByField('name', body.name);

    if (!user) {
      return errorResponse('用户不存在', 401);
    }
    if (user.password !== body.password) {
      return errorResponse('密码错误', 401);
    }
    return jsonResponse<{ user: User; token: string }>(
      { user, token: user.token },
      200,
      '登录成功'
    );
  }),

  // 菜单项接口
  http.get('https://www.demo.com/menu', async ({ request }) => {
    await delay(1000);
    // 1. 从请求头获取 Token
    const authHeader = request.headers.get('Authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : '';
    // 获取token对应的用户信息
    let user: User | null;
    if (!token) {
      user = null;
    } else {
      user = userDb.getByField('token', token);
    }

    if (!user) {
      return HttpResponse.json(
        { code: 401, message: '未授权' },
        { status: 401 }
      );
    }
    const items = getMenuLists(user.role as Role);
    return HttpResponse.json({
      code: 200,
      data: items,
      message: '获取菜单成功',
    });
  }),

  // ===== GET /api/users/:id - 查询单个 =====
  http.get<
    PathParams<'id'>,
    never,
    ApiResponse<{ user: User }> | ApiResponse<null>
  >('https://www.demo.com/query/user/:id', ({ params }) => {
    const { id } = params;

    if (!id || Array.isArray(id)) {
      return errorResponse('无效的用户ID', 400);
    }
    const userId = typeof id === 'string' ? id : id.toString();
    const user = userDb.getById(userId);

    if (!user) {
      return errorResponse('用户不存在', 404);
    }

    return jsonResponse<{ user: User }>({ user }, 200, '查询成功');
  }),

  // ===== POST /add/users - 创建 =====
  http.post<
    PathParams, // 路径参数
    UserRegister, // 请求体类型
    ApiResponse<User> | ApiResponse<null> // 响应体类型（联合类型）
  >('https://www.demo.com/auth/register', async ({ request }) => {
    const body = (await request.json()) as UserRegister;

    if (!body.name?.trim() || !body.email?.trim()) {
      return errorResponse('姓名和邮箱为必填项', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return errorResponse('邮箱格式不正确', 400);
    }
    // 生成token
    const token = body.name + body.email;

    const newUser: User = userDb.create({
      name: body.name.trim(),
      email: body.email.trim(),
      password: body.password,
      token: token,
      role: body.role ?? 'user',
      avatar: '',
    });

    return jsonResponse(newUser, 201, '用户创建成功');
  }),

  // ===== PUT /updata/users/:id - 全量更新 =====
  http.put<PathParams<'id'>>(
    'https://www.demo.com/updata/user/:id',
    async ({
      request,
      params,
    }: {
      request: Request;
      params: PathParams<'id'>;
    }) => {
      const { id } = params;
      if (!id || Array.isArray(id)) {
        return errorResponse('无效的用户ID', 400);
      }
      const userId = typeof id === 'string' ? id : id.toString();
      const body = (await request.json()) as Partial<UserRegister>;
      const updated = userDb.update(userId, body);

      if (!updated) {
        return errorResponse('用户不存在，无法更新', 404);
      }

      return jsonResponse<{ user: typeof updated }>(
        { user: updated },
        200,
        '更新成功'
      );
    }
  ),

  // ===== PATCH /api/users/:id - 部分更新 =====
  http.patch<PathParams<'id'>>(
    'https://www.demo.com/patch/user/:id',
    async ({
      request,
      params,
    }: {
      request: Request;
      params: PathParams<'id'>;
    }) => {
      const { id } = params;

      if (!id || Array.isArray(id)) {
        return errorResponse('无效的用户ID', 400);
      }
      const userId = typeof id === 'string' ? id : id.toString();

      const body = (await request.json()) as Partial<UserRegister>;
      const updated = userDb.update(userId, body);

      if (!updated) {
        return errorResponse('用户不存在，无法更新', 404);
      }

      return jsonResponse<{ user: typeof updated }>({ user: updated }, 200);
    }
  ),

  // ===== DELETE /api/users/:id - 单条删除 =====
  http.delete<PathParams<'id'>>(
    'https://www.demo.com/del/user/:id',
    ({ params }: { params: PathParams<'id'> }) => {
      const { id } = params;

      if (!id || Array.isArray(id)) {
        return errorResponse('无效的用户ID', 400);
      }
      const userId = typeof id === 'string' ? id : id.toString();

      const deletedUser = userDb.delete(userId);

      if (!deletedUser) {
        return errorResponse('用户不存在或已被删除', 404);
      }

      const result: DeleteResult = {
        deleted: deletedUser,
        remainingCount: userDb.getStats().total,
      };

      return jsonResponse<DeleteResult>(result, 204, '删除成功');
    }
  ),

  // ===== DELETE /del/users - 批量删除用户 =====
  http.delete<
    PathParams,
    { ids?: Array<string | number> },
    ApiResponse<BatchDeleteResult> | ApiResponse<null>
  >('https://www.demo.com/del/users', async ({ request }) => {
    const body = (await request.json()) as { ids?: Array<string | number> };

    if (!Array.isArray(body.ids) || body.ids.length === 0) {
      return errorResponse('请提供有效的 ID 数组', 400);
    }

    const deletedRecords = userDb.deleteMany(body.ids);

    const result: BatchDeleteResult = {
      deletedIds: deletedRecords.map((r) => r.id),
      failedIds: body.ids
        .map(String)
        .filter((id) => !deletedRecords.find((r) => r.id === id)),
      remainingCount: userDb.getStats().total,
    };

    return jsonResponse<BatchDeleteResult>(
      result,
      204,
      `成功删除 ${deletedRecords.length} 条记录`
    );
  }),

  // ===== GET /users/stats/debug - 调试统计 =====
  http.get('https://www.demo.com/users/stats/debug', () => {
    return jsonResponse<{ stats: ReturnType<typeof userDb.getStats> }>(
      { stats: userDb.getStats() },
      200
    );
  }),

  // ===== 获取客户列表 =====
  http.get<
    PathParams,
    CustomerQuery,
    ApiResponse<CustomerData[]> | ApiResponse<null>
  >('https://www.demo.com/query/customers', ({ request }) => {
    const url = new URL(request.url);
    const params: CustomerQuery = {
      companyName: url.searchParams.get('companyName') || undefined,
      legalPerson: url.searchParams.get('legalPerson') || undefined,
      phone: url.searchParams.get('phone') || undefined,
      page: Number(url.searchParams.get('page')) || 1,
      pageSize: Number(url.searchParams.get('pageSize')) || 10,
    };
    const { data: finalData, total } = queryData<CustomerData, CustomerQuery>(customerDb, params);
    return jsonResponse<CustomerData[]>(finalData, 200, '查询成功', total);
  }),

  // ===== 删除客户 =====
  http.delete<PathParams<'id'>>(
    'https://www.demo.com/delete/customer/:id',
    ({ params }) => {
      const { id } = params;
      console.log('后端删除的ID：', id);
      if (!id || Array.isArray(id)) {
        return errorResponse('无效的客户ID', 400);
      }
      const customerId = typeof id === 'string' ? id : id.toString();
      const deletedCustomer = customerDb.delete(customerId);
      if (!deletedCustomer) {
        return errorResponse('客户不存在或已被删除', 404);
      }

      return jsonResponse<CustomerData>(deletedCustomer, 200, '删除成功');
    }
  ),

  // ===== 批量删除客户 =====
  http.post<
    PathParams,
    { ids?: Array<string> },
    ApiResponse<BatchDeleteResult> | ApiResponse<null>
  >('https://www.demo.com/delete/customers/batch', async ({ request }) => {
    const body = (await request.json()) as { ids?: Array<string | number> };
    if (!Array.isArray(body.ids) || body.ids.length === 0) {
      return errorResponse('请提供有效的 ID 列表', 400);
    }

    const deletedRecords = customerDb.deleteMany(body.ids);
    if (deletedRecords.length === 0) {
      return errorResponse('没有找到匹配的记录', 404);
    }
    const result: BatchDeleteResult = {
      deletedIds: deletedRecords.map((r) => r.id),
      failedIds: body.ids
        .map(String)
        .filter((id) => !deletedRecords.find((r) => r.id === id)),
      remainingCount: customerDb.getStats().total,
    };
    return jsonResponse<BatchDeleteResult>(
      result,
      200,
      `成功删除 ${deletedRecords.length} 条记录`
    );
  }),

  // ===== 更新客户信息 =====
  http.put<
    PathParams<'id'>,
    CustomerData,
    ApiResponse<CustomerData> | ApiResponse<null>
  >('https://www.demo.com/update/customer/:id', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as CustomerData;
    if (!id || Array.isArray(id)) {
      return errorResponse('无效的客户ID', 400);
    }
    const customerId = typeof id === 'string' ? id : String(id);
    const updatedCustomer = customerDb.update(customerId, body);
    if (!updatedCustomer) {
      return errorResponse('客户不存在或已被删除', 404);
    }
    return jsonResponse<CustomerData>(updatedCustomer, 200, '更新成功');
  }),

  // ===== 新增客户 =====
  http.post<
    PathParams,
    CustomerData,
    ApiResponse<CustomerData> | ApiResponse<null>
  >('https://www.demo.com/add/customer', async ({ request }) => {
    const body = (await request.json()) as CustomerData;
    const newCustomer = customerDb.create(body);
    if (!newCustomer) {
      return errorResponse('创建客户失败', 500);
    }
    console.log('后端创建的数据：', newCustomer);
    return jsonResponse<CustomerData>(newCustomer, 201, '创建成功');
  }),

  // ===== 获取能源数据 =====
  // dashboard里的图表接口
  http.get('https://www.demo.com/energy', () => {
    return jsonResponse(energyDb.getAll(), 200, '获取菜单成功');
  }),

  // ===== 根据楼宇名称、联系人、楼宇状态返回楼宇列表或返回完整楼宇列表 =====
  http.get<
    PathParams,
    BuildingQuery,
    ApiResponse<BuildingData[]> | ApiResponse<null>
  >('https://www.demo.com/query/buildings', ({ request }) => {
    const url = new URL(request.url);
    console.log('后端的参数：', url);
    const params: BuildingQuery = {
      buildingName: url.searchParams.get('buildingName') || undefined,
      manager: url.searchParams.get('manager') || undefined,
      status: url.searchParams.get('status') || undefined,
      page: Number(url.searchParams.get('page')) || 1,
      pageSize: Number(url.searchParams.get('pageSize')) || 10,
    };
    console.log('后端的查询参数：', params);
    const { data: finalData, total } = queryData<BuildingData, BuildingQuery>(buildingDb, params);
    if (!finalData) {
      return errorResponse('没有找到匹配的楼宇', 404);
    }

    return jsonResponse<BuildingData[]>(finalData, 200, '查询成功', total);
  }),

    // ===== 更新楼宇信息 =====
  http.put<
    PathParams<'id'>,
    BuildingData,
    ApiResponse<BuildingData> | ApiResponse<null>
  >('https://www.demo.com/update/building/:id', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as BuildingData;
    if (!id || Array.isArray(id)) {
      return errorResponse('无效的楼宇ID', 400);
    }
    const buildingId = typeof id === 'string' ? id : String(id);
    const updatedBuilding = buildingDb.update(buildingId, body);
    if (!updatedBuilding) {
      return errorResponse('楼宇不存在或已被删除', 404);
    }
    return jsonResponse<BuildingData>(updatedBuilding, 200, '更新成功');
  }),
  // ===== 新增楼宇 =====
  http.post<
    PathParams,
    BuildingData,
    ApiResponse<BuildingData> | ApiResponse<null>
  >('https://www.demo.com/add/building', async ({ request }) => {
    const body = (await request.json()) as BuildingData;
    const newBuilding = buildingDb.create(body);
    if (!newBuilding) {
      return errorResponse('创建楼宇失败', 500);
    }
    console.log('后端创建的数据：', newBuilding);
    return jsonResponse<BuildingData>(newBuilding, 201, '创建成功');
  }),

  // ===== 删除楼宇 =====
  http.delete<
    PathParams<'id'>,
    ApiResponse<string> | ApiResponse<null>
  >('https://www.demo.com/delete/building/:id', async ({ params }) => {
    const { id } = params;
    if (!id || Array.isArray(id)) {
      return errorResponse('无效的楼宇ID', 400);
    }
    const myId = typeof id === 'string' ? id : String(id);
    const deletedBuilding = buildingDb.delete(myId);
    if (!deletedBuilding) {
      return errorResponse('楼宇不存在或已被删除', 404);
    }
    return jsonResponse<string>(`成功删除楼宇: ${deletedBuilding.buildingName}`, 200, '删除成功');
  }),

  // ===== 获取房间数据 =====
  http.get<
    PathParams<'id'>,
    { page?: number, pageSize?: number },
    ApiResponse<RoomData[]> | ApiResponse<null>
  >('https://www.demo.com/query/rooms/:id', async ({ params, request }) => {
    // 模拟网络延迟
    await delay(1000);
    const {id} = params;
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 12;
    console.log('后端的参数：', page, pageSize);
    console.log('后端的参数：', id);
    if (!id || Array.isArray(id)) {
      return errorResponse('无效的楼宇ID', 400);
    }
    const buildingId = typeof id === 'string' ? id : String(id);
    const roomDb = getRoomlist(buildingId);//第一次获取数据后，用相同的buildingId再次获取时，会报错
    if (!roomDb) {
      return errorResponse('没有找到匹配的楼宇', 404);
    }
    const {data,total} = queryData<RoomData>(roomDb, { page, pageSize });
    return jsonResponse<RoomData[]>(data, 200, '查询成功', total);
  }),

  // ===== 获取合同数据 =====
  http.post<
    PathParams,
    ContractQuery,
    ApiResponse<ContractData[]> | ApiResponse<null>
    >('https://www.demo.com/query/contracts', async ({ request })=>{
    const body = (await request.json()) as ContractQuery;
    console.log('后端的参数：', body);
    const {data, total} = queryData<ContractData, ContractQuery>(contractDb, body);
    if (!data) {
      return errorResponse('没有找到匹配的合同', 404);
    }
    return jsonResponse<ContractData[]>(data, 200, '查询成功', total);
  })

];
