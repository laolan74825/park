import { factory, primaryKey } from '@mswjs/data';
import type {
  User,
  Role,
  MenuData,
  EnergyType,
  CustomerData,
  BuildingData,
  RoomData,
  Status,
} from '../types/types';
import { fakerZH_CN } from '@faker-js/faker';

// 定义一个用户表
const db = factory({
  user: {
    id: primaryKey(String),
    name: String,
    email: String,
    avatar: String,
    role: String,
    createdAt: String,
    updatedAt: String,
    password: String,
    token: String,
  },
});

// 初始化用户固定数据
db.user.create({
  id: '2026-1',
  name: '张大发',
  email: fakerZH_CN.internet.email(),
  avatar: 'https://avatars.githubusercontent.com/u/12345678?v=4',
  role: 'superAdmin',
  createdAt: '2021-01-01',
  updatedAt: '2021-01-01',
  password: 'pass123',
  token: 'token123_superAdmin',
});
db.user.create({
  id: '2026-2',
  name: '牛得很',
  email: fakerZH_CN.internet.email(),
  avatar: fakerZH_CN.image.avatar(),
  role: 'admin',
  createdAt: '2021-01-01',
  updatedAt: '2021-01-01',
  password: 'pass123',
  token: 'token123_admin',
});
db.user.create({
  id: '2026-3',
  name: '王小红',
  email: fakerZH_CN.internet.email(),
  avatar: fakerZH_CN.image.avatar(),
  role: 'user',
  createdAt: '2021-01-01',
  updatedAt: '2021-01-01',
  password: 'pass123',
  token: 'token123_user',
});
db.user.create({
  id: '2026-4',
  name: '赵小绿',
  email: fakerZH_CN.internet.email(),
  avatar: fakerZH_CN.image.avatar(),
  role: 'guest',
  createdAt: '2021-01-01',
  updatedAt: '2021-01-01',
  password: 'pass123',
  token: 'token123_guest',
});

Array.from({ length: 10 }).forEach((_, index) => {
  db.user.create({
    id: fakerZH_CN.string.uuid(),
    name: fakerZH_CN.person.fullName(),
    email: fakerZH_CN.internet.email(),
    avatar: fakerZH_CN.image.avatar(),
    role: fakerZH_CN.helpers.arrayElement(['admin', 'user', 'guest', 'superAdmin'] as Role[]),
    createdAt: fakerZH_CN.date.past().toISOString(),
    updatedAt: fakerZH_CN.date.past().toISOString(),
    password: `pass0${index + 1}`,
    token: crypto.randomUUID(),
  });
});

export const users: User[] = db.user.getAll() as unknown as User[];

// 超级管理员菜单
const menuList: MenuData[] = [
  {
    icon: 'DashboardOutlined',
    label: '工作台(超级)',
    key: '/dashboard', //dashboard
  },
  {
    icon: 'TeamOutlined',
    label: '租户管理',
    key: '/users',
    children: [
      {
        icon: 'UnorderedListOutlined',
        label: '租户列表',
        key: '/users/list',
      },
      {
        icon: 'UserAddOutlined',
        label: '新增租户',
        key: '/users/add',
      },
    ],
  },
  {
    icon: 'LaptopOutlined',
    label: '物业管理',
    key: '/estate',
    children: [
      {
        icon: 'InsertRowLeftOutlined',
        label: '楼宇管理',
        key: '/estate/tenement',
      },
      {
        icon: 'BankOutlined',
        label: '房间管理',
        key: '/estate/room',
      },
      {
        icon: 'TruckOutlined',
        label: '车辆信息',
        key: '/estate/car',
      },
    ],
  },
  {
    icon: 'ToolOutlined',
    label: '报修管理',
    key: '/repair',
  },
  {
    icon: 'DollarOutlined',
    label: '财务管理',
    key: '/finance',
    children: [
      {
        icon: 'ProfileOutlined',
        label: '合同管理',
        key: '/finance/contract',
      },
      {
        icon: 'FrownOutlined',
        label: '合同详情',
        key: '/finance/surrender',
        show: false,
      },
      {
        icon: 'FileTextOutlined',
        label: '账单管理',
        key: '/finance/bill',
      },
    ],
  },
  {
    icon: 'TransactionOutlined',
    label: '招商管理',
    key: '/merchants',
  },
  {
    icon: 'FundProjectionScreenOutlined',
    label: '运营管理',
    key: '/operation',
    children: [
      {
        icon: 'FundViewOutlined',
        label: '运营总览',
        key: '/operation/all',
      },
      {
        icon: 'ReadOutlined',
        label: '文章发布',
        key: '/operation/article',
      },
      {
        icon: 'CommentOutlined',
        label: '内容评论',
        key: '/operation/comments',
      },
    ],
  },
  {
    icon: 'ToolOutlined',
    label: '设备管理',
    key: '/equipment',
  },
  {
    icon: 'ThunderboltOutlined',
    label: '能源消耗',
    key: '/energy',
  },
  {
    icon: 'SettingOutlined',
    label: '系统设置',
    key: '/settings',
  },
  {
    icon: 'UserOutlined',
    label: '个人中心',
    key: '/personal',
  },
];

// 用户菜单
const userMenuList: MenuData[] = [
  {
    icon: 'DashboardOutlined',
    label: '工作台(用户)',
    key: '/dashboard',
  },
  {
    icon: 'TeamOutlined',
    label: '租户管理',
    key: '/users',
    children: [
      {
        icon: 'UnorderedListOutlined',
        label: '租户列表',
        key: '/users/list',
      },
      {
        icon: 'UserAddOutlined',
        label: '新增租户',
        key: '/users/add',
      },
    ],
  },
  {
    icon: 'LaptopOutlined',
    label: '物业管理',
    key: '/estate',
    children: [
      {
        icon: 'InsertRowLeftOutlined',
        label: '楼宇管理',
        key: '/estate/tenement',
      },
      {
        icon: 'BankOutlined',
        label: '房间管理',
        key: '/estate/room',
      },
      {
        icon: 'TruckOutlined',
        label: '车辆信息',
        key: '/estate/car',
      },
    ],
  },
  {
    icon: 'ToolOutlined',
    label: '报修管理',
    key: '/repair',
  },
  {
    icon: 'ToolOutlined',
    label: '设备管理',
    key: '/equipment',
  },
  {
    icon: 'ThunderboltOutlined',
    label: '能源消耗',
    key: '/energy',
  },
  {
    icon: 'UserOutlined',
    label: '个人中心',
    key: '/personal',
  },
];

// 管理员菜单
const managerMenuList: MenuData[] = [
  {
    icon: 'DashboardOutlined',
    label: '工作台(管理员)',
    key: '/dashboard',
  },
  {
    icon: 'TeamOutlined',
    label: '租户管理',
    key: '/users',
    children: [
      {
        icon: 'UnorderedListOutlined',
        label: '租户列表',
        key: '/users/list',
      },
      {
        icon: 'UserAddOutlined',
        label: '新增租户',
        key: '/users/add',
      },
    ],
  },
  {
    icon: 'LaptopOutlined',
    label: '物业管理',
    key: '/estate',
    children: [
      {
        icon: 'InsertRowLeftOutlined',
        label: '楼宇管理',
        key: '/estate/tenement',
      },
      {
        icon: 'BankOutlined',
        label: '房间管理',
        key: '/estate/room',
      },
      {
        icon: 'TruckOutlined',
        label: '车辆信息',
        key: '/estate/car',
      },
    ],
  },
  {
    icon: 'ToolOutlined',
    label: '报修管理',
    key: '/repair',
  },
  {
    icon: 'TransactionOutlined',
    label: '招商管理',
    key: '/merchants',
  },
  {
    icon: 'FundProjectionScreenOutlined',
    label: '运营管理',
    key: '/operation',
    children: [
      {
        icon: 'FundViewOutlined',
        label: '运营总览',
        key: '/operation/all',
      },
      {
        icon: 'ReadOutlined',
        label: '文章发布',
        key: '/operation/article',
      },
      {
        icon: 'CommentOutlined',
        label: '内容评论',
        key: '/operation/comments',
      },
    ],
  },
  {
    icon: 'ToolOutlined',
    label: '设备管理',
    key: '/equipment',
  },
  {
    icon: 'ThunderboltOutlined',
    label: '能源消耗',
    key: '/energy',
  },
  {
    icon: 'SettingOutlined',
    label: '系统设置',
    key: '/settings',
  },
  {
    icon: 'UserOutlined',
    label: '个人中心',
    key: '/personal',
  },
];

// 定制菜单
const customizeMenuList: MenuData[] = [
  {
    icon: 'DashboardOutlined',
    label: '工作台(定制)',
    key: '/dashboard',
  },
  {
    icon: 'TeamOutlined',
    label: '租户管理',
    key: '/users',
    children: [
      {
        icon: 'UnorderedListOutlined',
        label: '租户列表',
        key: '/users/list',
      },
    ],
  },
  {
    icon: 'LaptopOutlined',
    label: '物业管理',
    key: '/estate',
    children: [
      {
        icon: 'InsertRowLeftOutlined',
        label: '楼宇管理',
        key: '/estate/tenement',
      },
    ],
  },
  {
    icon: 'ToolOutlined',
    label: '报修管理',
    key: '/repair',
  },
  {
    icon: 'ToolOutlined',
    label: '设备管理',
    key: '/equipment',
  },
  {
    icon: 'ThunderboltOutlined',
    label: '能源消耗',
    key: '/energy',
  },
  {
    icon: 'UserOutlined',
    label: '个人中心',
    key: '/personal',
  },
];

export const { superAdminMenu, adminMenu, userMenu, customizeMenu } = {
  superAdminMenu: menuList,
  adminMenu: managerMenuList,
  userMenu: userMenuList,
  customizeMenu: customizeMenuList,
};

// 定义能源数据表
export const echartsData: EnergyType[] = [
  {
    id: 'data01',
    name: '煤炭',
    data: [120, 132, 101, 134, 90, 230, 210],
  },
  {
    id: 'data02',
    name: '燃气',
    data: [220, 182, 191, 234, 290, 330, 310],
  },
  {
    id: 'data03',
    name: '燃油',
    data: [150, 232, 201, 154, 190, 330, 410],
  },
  {
    id: 'data04',
    name: '电能',
    data: [120, 120, 301, 334, 390, 260, 160],
  },
  {
    id: 'data05',
    name: '热能',
    data: [820, 932, 901, 934, 1290, 1330, 1320],
  },
];

// 定义客户列表
const customerDb = factory({
  dataList: {
    id: primaryKey(String),
    companyName: String,
    status: String,
    phone: String,
    industry: String,
    email: String,
    creditCode: String,
    registerCode: String,
    legalPerson: String,
  },
});

// 生成客户信息
Array.from({ length: 75 }).forEach(() => {
  customerDb.dataList.create({
    id: fakerZH_CN.string.uuid(),
    companyName: fakerZH_CN.company.name(),
    status: fakerZH_CN.helpers.arrayElement([
      '1',
      '1',
      '1',
      '1',
      '2',
      '3',
      '3',
    ]),
    phone: fakerZH_CN.helpers.arrayElement(['18985221111', '18985223333']),
    industry: fakerZH_CN.helpers.arrayElement([
      '互联网/IT',
      '金融',
      '教育培训',
      '医疗健康',
      '制造业',
      '房地产/建筑',
      '零售电商',
      '文化传媒',
      '能源化工',
      '物流运输',
    ]),
    email: fakerZH_CN.internet.email(),
    creditCode: fakerZH_CN.string.uuid().substring(0, 16),
    registerCode: fakerZH_CN.string.uuid().substring(0, 16),
    legalPerson: fakerZH_CN.person.fullName(),
  });
});

// 房间数据表
export const roomDb = factory({
  dataList: {
    id: primaryKey(String),
    roomNumber: String,
    status: String,
    type: String,
    buildingId: String,
    area: Number,
    price: Number,
  },
});
export const getRoomData = (buildingId: string): Array<Omit<RoomData, 'id'>> => {
  return Array.from({ length: 114 }, (_, index) => {
    const floor = String((Math.floor(index / 6) + 2)).padStart(2, '0');
    const roomNum = String((index % 6) + 1).padStart(2, '0');

    return {
      roomNumber: floor + roomNum,
      status: fakerZH_CN.helpers.arrayElement([
        '1',
        '1',
        '1',
        '1',
        '2',
        '3',
      ]) as Status,
      type: fakerZH_CN.helpers.arrayElement([
        '1',
        '1',
        '1',
        '1',
        '2',
        '3',
      ]) as Status,
      buildingId: buildingId,
      area: fakerZH_CN.number.int({ min: 120, max: 280 }),
      price: fakerZH_CN.number.int({ min: 40, max: 100 }),
    };
  });
};

export const customerData: CustomerData[] =
  customerDb.dataList.getAll() as unknown as CustomerData[];

// 楼宇列表数据
export const buildingData: Array<Omit<BuildingData, 'id'>> = [
  {
    buildingName: '科技大厦',
    manager: '张伟',
    phone: '135810732999',
    area: 11280.48,
    status: '2',
    emptyRate: 73.16,
    propertyRate: 9.3,
  },
  {
    buildingName: '创新广场',
    manager: '李娜',
    phone: '139855676194',
    area: 13321.44,
    status: '1',
    emptyRate: 69.5,
    propertyRate: 10.18,
  },
  {
    buildingName: '金融中心',
    manager: '王强',
    phone: '138377972874',
    area: 42912.21,
    status: '3',
    emptyRate: 82.05,
    propertyRate: 9.78,
  },
  {
    buildingName: '商务中心',
    manager: '刘洋',
    phone: '135304728050',
    area: 31828.12,
    status: '3',
    emptyRate: 69.86,
    propertyRate: 3.2,
  },
  {
    buildingName: '时代广场',
    manager: '陈静',
    phone: '137598791353',
    area: 10423.87,
    status: '1',
    emptyRate: 29.12,
    propertyRate: 4.79,
  },
  {
    buildingName: '财富大厦',
    manager: '杨帆',
    phone: '137751391559',
    area: 40348.94,
    status: '3',
    emptyRate: 83.74,
    propertyRate: 7.47,
  },
  {
    buildingName: '国际中心',
    manager: '赵敏',
    phone: '135261567026',
    area: 36061.97,
    status: '3',
    emptyRate: 55.34,
    propertyRate: 7.75,
  },
  {
    buildingName: '科技园',
    manager: '黄磊',
    phone: '138132999219',
    area: 44414.57,
    status: '3',
    emptyRate: 80.5,
    propertyRate: 10.41,
  },
  {
    buildingName: '创业大厦',
    manager: '周杰',
    phone: '137643161436',
    area: 45907.62,
    status: '1',
    emptyRate: 43.06,
    propertyRate: 12.71,
  },
  {
    buildingName: '未来中心',
    manager: '吴倩',
    phone: '137845919880',
    area: 47767.28,
    status: '1',
    emptyRate: 76.66,
    propertyRate: 13.21,
  },
  {
    buildingName: '云端大厦',
    manager: '徐鹏',
    phone: '135303009110',
    area: 3614.57,
    status: '2',
    emptyRate: 93.4,
    propertyRate: 2.73,
  },
  {
    buildingName: '数字港',
    manager: '孙丽',
    phone: '135579641992',
    area: 8995.87,
    status: '3',
    emptyRate: 87.1,
    propertyRate: 14.98,
  },
  {
    buildingName: '智慧广场',
    manager: '马超',
    phone: '133651653798',
    area: 35908.09,
    status: '2',
    emptyRate: 92.6,
    propertyRate: 5.13,
  },
  {
    buildingName: '星河中心',
    manager: '朱琳',
    phone: '138196204744',
    area: 48380.37,
    status: '3',
    emptyRate: 69.71,
    propertyRate: 7.63,
  },
  {
    buildingName: '银河大厦',
    manager: '胡军',
    phone: '137219892069',
    area: 19841.16,
    status: '2',
    emptyRate: 48.64,
    propertyRate: 13.06,
  },
  {
    buildingName: '阳光大厦',
    manager: '郭明',
    phone: '133590062849',
    area: 29694.58,
    status: '1',
    emptyRate: 60.07,
    propertyRate: 2.45,
  },
  {
    buildingName: '绿洲中心',
    manager: '林峰',
    phone: '135661329754',
    area: 22565.92,
    status: '2',
    emptyRate: 63.3,
    propertyRate: 11.26,
  },
  {
    buildingName: '蓝海大厦',
    manager: '何芳',
    phone: '135198622262',
    area: 12417.89,
    status: '2',
    emptyRate: 38.54,
    propertyRate: 3.21,
  },
  {
    buildingName: '紫金大厦',
    manager: '高翔',
    phone: '135258559416',
    area: 11863.0,
    status: '3',
    emptyRate: 76,
    propertyRate: 3.55,
  },
  {
    buildingName: '钻石中心',
    manager: '罗丹',
    phone: '138603165804',
    area: 1256.49,
    status: '3',
    emptyRate: 50.8,
    propertyRate: 13.39,
  },
  {
    buildingName: '翡翠大厦',
    manager: '郑宇',
    phone: '138821416494',
    area: 28062.73,
    status: '2',
    emptyRate: 50.6,
    propertyRate: 9.41,
  },
  {
    buildingName: '明珠中心',
    manager: '梁辉',
    phone: '137433247741',
    area: 38882.37,
    status: '3',
    emptyRate: 48.6,
    propertyRate: 10.7,
  },
  {
    buildingName: '锦绣大厦',
    manager: '宋佳',
    phone: '135514531543',
    area: 20693.48,
    status: '1',
    emptyRate: 32.9,
    propertyRate: 14.49,
  },
  {
    buildingName: '华贸中心',
    manager: '唐勇',
    phone: '137573340875',
    area: 8195.77,
    status: '3',
    emptyRate: 91.16,
    propertyRate: 12.5,
  },
  {
    buildingName: '鼎盛大厦',
    manager: '韩梅',
    phone: '138900353362',
    area: 39026.86,
    status: '1',
    emptyRate: 86.8,
    propertyRate: 6.15,
  },
];
