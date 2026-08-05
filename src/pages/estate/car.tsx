import { Button, Card, Col, Input, Row, Table, Tabs, Image } from 'antd';
import type { TableProps, TabsProps } from 'antd';
import carPic from '@/assets/860.jpg';

// 车辆充电信息
interface ChargeData {
  key: string;
  plateNumber: string; // 车牌号
  orderNumber: string; // 订单号
  carType: string; // 车辆类型
  chargeStatus: string; // 充电状态
  chargeStartTime: string; // 充电开始时间
  chargeEndTime: string; // 充电结束时间
  chargeDuration: number; // 充电时长
  chargeAmount: number; // 充电数量
  pricePerKWh: number; // 电费单价
  totalAmount: number; // 金额合计
}

const columns1: TableProps<ChargeData>['columns'] = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    render: (_text, _record, index) => index + 1,
  },
  // 车牌号
  { title: '车牌号', dataIndex: 'plateNumber', key: 'plateNumber' },
  // 订单号
  { title: '订单号', dataIndex: 'orderNumber', key: 'orderNumber' },
  // 车辆类型
  { title: '车辆类型', dataIndex: 'carType', key: 'carType' },
  // 充电状态
  { title: '充电状态', dataIndex: 'chargeStatus', key: 'chargeStatus' },
  // 充电开始时间
  {
    title: '充电开始时间',
    dataIndex: 'chargeStartTime',
    key: 'chargeStartTime',
  },
  // 充电结束时间
  { title: '充电结束时间', dataIndex: 'chargeEndTime', key: 'chargeEndTime' },
  // 充电时长
  { title: '充电时长', dataIndex: 'chargeDuration', key: 'chargeDuration' },
  // 充电数量
  { title: '充电数量', dataIndex: 'chargeAmount', key: 'chargeAmount' },
  // 价格单价
  { title: '电费单价', dataIndex: 'pricePerKWh', key: 'pricePerKWh' },
  // 充电金额
  { title: '充电金额', dataIndex: 'totalAmount', key: 'totalAmount' },
  // 操作
  {
    title: '操作',
    key: 'action',
    render: () => (
      <Button type="primary" size="small">
        详情
      </Button>
    ),
  },
];

const data1 = [
  {
    key: '1',
    plateNumber: '沪A43321',
    orderNumber: 'ORD202605220001',
    carType: '货车',
    chargeStatus: '充电异常',
    chargeStartTime: '2026-05-22 17:05:00',
    chargeEndTime: '2026-05-22 19:23:00',
    chargeDuration: 138,
    chargeAmount: 21.91,
    pricePerKWh: 0.91,
    totalAmount: 19.94,
  },
  {
    key: '2',
    plateNumber: '京T38637',
    orderNumber: 'ORD202605220002',
    carType: '网约车',
    chargeStatus: '已取消',
    chargeStartTime: '2026-05-22 18:17:00',
    chargeEndTime: '2026-05-22 18:48:00',
    chargeDuration: 31,
    chargeAmount: 65.53,
    pricePerKWh: 0.99,
    totalAmount: 64.87,
  },
  {
    key: '3',
    plateNumber: '苏E35116',
    orderNumber: 'ORD202605220003',
    carType: '私家车',
    chargeStatus: '充电异常',
    chargeStartTime: '2026-05-22 03:22:00',
    chargeEndTime: '2026-05-22 05:20:00',
    chargeDuration: 118,
    chargeAmount: 56.22,
    pricePerKWh: 1.77,
    totalAmount: 99.51,
  },
  {
    key: '4',
    plateNumber: '沪N18495',
    orderNumber: 'ORD202605220004',
    carType: '客车',
    chargeStatus: '充电中',
    chargeStartTime: '2026-05-22 18:12:00',
    chargeEndTime: '2026-05-22 18:59:00',
    chargeDuration: 47,
    chargeAmount: 22.75,
    pricePerKWh: 1.07,
    totalAmount: 24.34,
  },
  {
    key: '5',
    plateNumber: '浙D64752',
    orderNumber: 'ORD202605220005',
    carType: 'SUV',
    chargeStatus: '充电异常',
    chargeStartTime: '2026-05-22 11:22:00',
    chargeEndTime: '2026-05-22 12:45:00',
    chargeDuration: 83,
    chargeAmount: 60.21,
    pricePerKWh: 1.64,
    totalAmount: 98.74,
  },
  {
    key: '6',
    plateNumber: '粤T32764',
    orderNumber: 'ORD202605220006',
    carType: '小型轿车',
    chargeStatus: '已完成',
    chargeStartTime: '2026-05-22 20:44:00',
    chargeEndTime: '2026-05-22 23:36:00',
    chargeDuration: 172,
    chargeAmount: 33.18,
    pricePerKWh: 1.19,
    totalAmount: 39.48,
  },
  {
    key: '7',
    plateNumber: '京L64139',
    orderNumber: 'ORD202605220007',
    carType: '私家车',
    chargeStatus: '已完成',
    chargeStartTime: '2026-05-22 10:13:00',
    chargeEndTime: '2026-05-22 12:50:00',
    chargeDuration: 157,
    chargeAmount: 43.74,
    pricePerKWh: 1.9,
    totalAmount: 83.11,
  },
  {
    key: '8',
    plateNumber: '苏E38849',
    orderNumber: 'ORD202605220008',
    carType: '商务车',
    chargeStatus: '充电异常',
    chargeStartTime: '2026-05-22 13:57:00',
    chargeEndTime: '2026-05-22 16:56:00',
    chargeDuration: 179,
    chargeAmount: 43.96,
    pricePerKWh: 1.06,
    totalAmount: 46.6,
  },
];

// 停车场车辆信息接口
interface CarData {
  id: string;
  carNumber: string; // 车牌号
  carType: string; // 车辆类型
  carColor: string; // 车辆颜色
  carOwner: string; // 车主姓名
  carOwnerPhone: string; // 车主手机号
  carOwnerIdCard: string; // 车主身份证
  carOwnerAddress: string; // 车主地址
  carOwnerEmail: string; // 车主邮箱
  carPic: string; // 车辆图片
}

const columns2: TableProps<CarData>['columns'] = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    render: (_text, _record, index) => index + 1,
  },
  { title: '车牌号', dataIndex: 'carNumber', key: 'carNumber' },
  { title: '车辆类型', dataIndex: 'carType', key: 'carType' },
  { title: '车辆颜色', dataIndex: 'carColor', key: 'carColor' },
  { title: '车主姓名', dataIndex: 'carOwner', key: 'carOwner' },
  { title: '车主手机号', dataIndex: 'carOwnerPhone', key: 'carOwnerPhone' },
  { title: '车主身份证', dataIndex: 'carOwnerIdCard', key: 'carOwnerIdCard' },
  { title: '车主地址', dataIndex: 'carOwnerAddress', key: 'carOwnerAddress' },
  { title: '车主邮箱', dataIndex: 'carOwnerEmail', key: 'carOwnerEmail' },
  {
    title: '入场照片',
    dataIndex: 'carPic',
    key: 'carPic',
    render: () => (
      <Image
        width={50}
        src={carPic}
        placeholder={<Image preview={false} width={150} src={carPic} />}
      />
    ),
  },
];

const data2: CarData[] = [
  {
    id: '1',
    carNumber: '闽D04332',
    carType: 'SUV',
    carColor: '绿色',
    carOwner: '张平',
    carOwnerPhone: '18800133890',
    carOwnerIdCard: '330106200511235586',
    carOwnerAddress: '重庆市渝中区胜利街829号',
    carOwnerEmail: '张平116@sohu.com',
    carPic: 'https://example.com/car/闽D04332.jpg',
  },
  {
    id: '2',
    carNumber: '渝F65423',
    carType: '出租车',
    carColor: '白色',
    carOwner: '张杰',
    carOwnerPhone: '13755940781',
    carOwnerIdCard: '370102196509108494',
    carOwnerAddress: '重庆市渝中区中山路722号',
    carOwnerEmail: '张杰1149@qq.com',
    carPic: 'https://example.com/car/渝F65423.jpg',
  },
  {
    id: '3',
    carNumber: '闽H41316',
    carType: '客车',
    carColor: '金色',
    carOwner: '孙丽',
    carOwnerPhone: '18653419283',
    carOwnerIdCard: '440106198907099478',
    carOwnerAddress: '南京市鼓楼区幸福街787号',
    carOwnerEmail: '孙丽926@163.com',
    carPic: 'https://example.com/car/闽H41316.jpg',
  },
  {
    id: '4',
    carNumber: '津B56413',
    carType: '面包车',
    carColor: '灰色',
    carOwner: '赵桂英',
    carOwnerPhone: '13067242388',
    carOwnerIdCard: '320106199707194085',
    carOwnerAddress: '广州市天河区朝阳街506号',
    carOwnerEmail: '赵桂英1499@sohu.com',
    carPic: 'https://example.com/car/津B56413.jpg',
  },
  {
    id: '5',
    carNumber: '京D22691',
    carType: '网约车',
    carColor: '棕色',
    carOwner: '高明',
    carOwnerPhone: '13148018451',
    carOwnerIdCard: '320106198703150031',
    carOwnerAddress: '西安市雁塔区光明路109号',
    carOwnerEmail: '高明4899@sohu.com',
    carPic: 'https://example.com/car/京D22691.jpg',
  },
  {
    id: '6',
    carNumber: '闽S93252',
    carType: '跑车',
    carColor: '绿色',
    carOwner: '王刚',
    carOwnerPhone: '15970154303',
    carOwnerIdCard: '310101196512168357',
    carOwnerAddress: '青岛市市南区人民路132号',
    carOwnerEmail: '王刚7797@outlook.com',
    carPic: 'https://example.com/car/闽S93252.jpg',
  },
  {
    id: '7',
    carNumber: '粤J89638',
    carType: '货车',
    carColor: '蓝色',
    carOwner: '马华',
    carOwnerPhone: '18678713315',
    carOwnerIdCard: '110101199709086023',
    carOwnerAddress: '苏州市工业园区工业大道61号',
    carOwnerEmail: '马华3760@qq.com',
    carPic: 'https://example.com/car/粤J89638.jpg',
  },
  {
    id: '8',
    carNumber: '皖B51834',
    carType: '私家车',
    carColor: '红色',
    carOwner: '林静',
    carOwnerPhone: '15597376311',
    carOwnerIdCard: '370102198207144789',
    carOwnerAddress: '上海市浦东新区建设大街413号',
    carOwnerEmail: '林静5569@sohu.com',
    carPic: 'https://example.com/car/皖B51834.jpg',
  },
  {
    id: '9',
    carNumber: '津D33387',
    carType: '商务车',
    carColor: '棕色',
    carOwner: '杨军',
    carOwnerPhone: '18931781080',
    carOwnerIdCard: '310101197503144977',
    carOwnerAddress: '成都市锦江区光明路61号',
    carOwnerEmail: '杨军2707@gmail.com',
    carPic: 'https://example.com/car/津D33387.jpg',
  },
  {
    id: '10',
    carNumber: '京N47468',
    carType: '私家车',
    carColor: '银色',
    carOwner: '赵洋',
    carOwnerPhone: '15109805009',
    carOwnerIdCard: '410105199209060588',
    carOwnerAddress: '广州市天河区解放路610号',
    carOwnerEmail: '赵洋1123@sina.com',
    carPic: 'https://example.com/car/京N47468.jpg',
  },
  {
    id: '11',
    carNumber: '津H61939',
    carType: '面包车',
    carColor: '黑色',
    carOwner: '高娜',
    carOwnerPhone: '18899854353',
    carOwnerIdCard: '320106198503226604',
    carOwnerAddress: '长沙市芙蓉区创业路959号',
    carOwnerEmail: '高娜1198@qq.com',
    carPic: 'https://example.com/car/津H61939.jpg',
  },
  {
    id: '12',
    carNumber: '豫V91183',
    carType: '跑车',
    carColor: '蓝色',
    carOwner: '陈秀英',
    carOwnerPhone: '18613542784',
    carOwnerIdCard: '110101200209109541',
    carOwnerAddress: '杭州市西湖区解放路912号',
    carOwnerEmail: '陈秀英1763@sina.com',
    carPic: 'https://example.com/car/豫V91183.jpg',
  },
  {
    id: '13',
    carNumber: '湘E44935',
    carType: '货车',
    carColor: '蓝色',
    carOwner: '何超',
    carOwnerPhone: '15701640052',
    carOwnerIdCard: '320106197012155640',
    carOwnerAddress: '上海市浦东新区光明路708号',
    carOwnerEmail: '何超2452@outlook.com',
    carPic: 'https://example.com/car/湘E44935.jpg',
  },
  {
    id: '14',
    carNumber: '京M98262',
    carType: '小型轿车',
    carColor: '蓝色',
    carOwner: '孙玉兰',
    carOwnerPhone: '13953315869',
    carOwnerIdCard: '44010619750326830X',
    carOwnerAddress: '广州市天河区科技路947号',
    carOwnerEmail: '孙玉兰5452@sohu.com',
    carPic: 'https://example.com/car/京M98262.jpg',
  },
  {
    id: '15',
    carNumber: '皖P34216',
    carType: '小型轿车',
    carColor: '金色',
    carOwner: '黄强',
    carOwnerPhone: '18954330365',
    carOwnerIdCard: '320106196405126568',
    carOwnerAddress: '厦门市思明区朝阳街340号',
    carOwnerEmail: '黄强462@qq.com',
    carPic: 'https://example.com/car/皖P34216.jpg',
  },
];

const items: TabsProps['items'] = [
  {
    key: '1',
    label: '充电记录',
    children: <Table columns={columns1} dataSource={data1} />,
  },
  {
    key: '2',
    label: '园内车辆信息',
    children: <Table columns={columns2} dataSource={data2} />,
  },
];
function Car() {
  return (
    <div className="car">
      <Card>
        <Row gutter={16}>
          <Col span={8}>
            <Input placeholder="请输入车牌号、手机号或联系人其中一项信息" />
          </Col>
          <Col span={8}>
            <Button type="primary">查询</Button>
          </Col>
        </Row>
      </Card>
      <Card className="mt">
        <Row>
          <Tabs defaultActiveKey="1" items={items}></Tabs>
        </Row>
      </Card>
    </div>
  );
}
export default Car;
