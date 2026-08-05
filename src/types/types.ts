// 定义 Mock 数据的类型

// 定义基本数据类型
interface BaseData {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

// 用户登录请求类型
export interface LoginData {
  name: string;
  password: string;
}

// 角色类型
export type Role = 'admin' | 'user' | 'guest' | 'superAdmin';

// 用户信息类型
export interface User extends BaseData {
  name: string;
  email: string;
  avatar: string;
  role: Role;
  password: string;
  token: string;
}

// 用户输入类型
export interface UserRegister {
  name: string;
  email: string;
  role?: Role;
  password: string;
}

// 删除用户类型
export interface DeletedUser extends User {
  deletedAt: string;
}

// 返回数据的通用格式
export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
  total?: number;
  errors?: ErrorDetail[]; // 在返回错误时使用
}

// 错误响应
export interface ErrorDetail {
  message: string;
  field?: string;
  code?: string;
  [key: string]: unknown;
}

// 删除结果类型
export interface DeleteResult {
  deleted: DeletedUser;
  remainingCount: number;
}

// 批量删除结果类型
export interface BatchDeleteResult {
  deletedIds: string[];
  failedIds: string[];
  remainingCount: number;
}

// 数据库统计数据类型
export interface DbStats {
  total: number;
  ids: string[];
}

// 登录请求参数类型
export interface LoginRequest {
  name: string;
  password: string;
}

// 登录响应数据类型
export interface LoginResponse {
  code: number;
  message: string;
  data: { user: Omit<User, 'password'> };
}

// 菜单数据类型（菜单数据是string, 组件中使用React.ReactNode）
export type MenuData = {
  key: string;
  label: string;
  icon?: string;
  children?: MenuData[];
  show?: boolean; // 新增属性，控制菜单项是否显示
};

// 能源数据类型
export interface EnergyType {
  id: string;
  name: string;
  data: number[];
}

// 客户数据类型
export interface CustomerData extends BaseData {
  companyName: string;
  status: string;
  phone: string;
  industry: string;
  email: string;
  creditCode: string;
  registerCode: string;
  legalPerson: string;
  [key: string]: unknown;
}

// 客户查询类型
export interface CustomerQuery {
  companyName?: string;
  legalPerson?: string;
  phone?: string;
  page?: number;
  pageSize?: number;
  [key: string]: unknown;
}

// 楼宇数据类型
export interface BuildingData extends BaseData {
  // 继承了ID、createdAt和updatedAt属性
  buildingName: string; // 楼宇名称
  manager: string; // 负责人
  phone: string; // 负责人电话
  area: number; // 楼宇面积
  status: '1' | '2' | '3'; // 使用状态
  emptyRate: number; // 空置率
  propertyRate: number; // 物业费率
  [key: string]: unknown; // 允许其他未知属性
}

// 楼宇查询类型
export interface BuildingQuery {
  buildingName?: string;
  manager?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  [key: string]: unknown;
}

// 房间数据类型
export interface RoomData extends BaseData {
  // 继承了ID、createdAt和updatedAt属性
  roomNumber: string; // 房间号
  status: Status; // 使用状态
  type: Status; // 住宅类型
  buildingId: string; // 所属楼宇ID
  area: number; // 房间面积
  price: number; // 出租单价
  [key: string]: unknown; // 允许其他未知属性
}

export type Status = '1' | '2' | '3';

// 合同信息结构
export interface ContractData extends BaseData {
  contractNo: string;
  contractName: string;
  contractCategory: string;
  contractAmount: number;
  contractStartDate: string;
  contractEndDate: string;
  contractStatus: string;
  contractAttachment: string;
  createTime: string;
  updateTime: string;
  approvalStatus: string;
  [key: string]: unknown;
}

export interface ContractQuery {
  contractName: string; // 合同名称
  contractNo: string; // 合同编号
  contractEndDate: string; // 结束时间
  page?: number;
  pageSize?: number;
  [key: string]: unknown;
}
