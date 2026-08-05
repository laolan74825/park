import {
  DollarOutlined,
  LaptopOutlined,
  RadarChartOutlined,
  SnippetsOutlined,
} from '@ant-design/icons';
import { Col, Row, Card, Progress, Statistic, Timeline, Tag } from 'antd';
import './index.scss';
import ReactECharts from 'echarts-for-react';
import { getEnergyData } from '../../api/index';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { EnergyType } from '@/types/types';

const option = {
  title: {
    text: '企业资质情况（家）',
    left: '0%',
    top: '0%',
  },

  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    // data: ['企业资质情况'],
    top: '5%',
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      data: ['2014', '2016', '2018', '2020', '2022', '2024', '2026'],
      axisTick: {
        alignWithLabel: true,
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
    },
  ],
  series: [
    {
      name: '科技企业',
      type: 'bar',
      data: [120, 210, 200, 334, 390, 330, 220],
    },
    {
      name: '高新技术企业',
      type: 'bar',
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: '国营企业',
      type: 'bar',
      data: [220, 182, 191, 234, 290, 330, 310],
    },
  ],
};
const option1 = {
  legend: {
    // data: ['在营', '已租', '出租', '闲置', '续签', '注销', '停业'],
    top: 'top',
  },

  toolbox: {
    show: false,
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  series: [
    {
      name: 'Nightingale Chart',
      type: 'pie',
      radius: [30, 120],
      center: ['50%', '50%'],
      roseType: 'area',
      itemStyle: {
        borderRadius: 8,
      },
      data: [
        { value: 40, name: '在营' },
        { value: 38, name: '已租' },
        { value: 32, name: '待租' },
        { value: 30, name: '待售' },
        { value: 28, name: '售出' },
        { value: 26, name: '闲置' },
        { value: 22, name: '续签' },
      ],
    },
  ],
};

const items = [
  {
    content: (
      <>
        <Tag color="green">进场</Tag>'08:05:01 车辆：京A00001'
      </>
    ),
  },
  {
    content: (
      <>
        <Tag color="green">进场</Tag>'08:15:30 车辆：贵C88881'
      </>
    ),
  },
  {
    content: (
      <>
        <Tag color="red">出场</Tag>'09:43:09 车辆：京A00001'
      </>
    ),
    color: 'red',
  },
  {
    content: (
      <>
        <Tag color="green">进场</Tag>'10:15:30 车辆：贵C99991'
      </>
    ),
  },
  {
    content: (
      <>
        <Tag color="red">出场</Tag>'10:58:30 车辆：贵C99991'
      </>
    ),
    color: 'red',
  },
  {
    content: (
      <>
        <Tag color="green">进场</Tag>'08:05:01 车辆：京A00001'
      </>
    ),
  },
  {
    content: (
      <>
        <Tag color="green">进场</Tag>'08:15:30 车辆：贵C88881'
      </>
    ),
  },
  {
    content: (
      <>
        <Tag color="red">出场</Tag>'09:43:09 车辆：京A00001'
      </>
    ),
    color: 'red',
  },
  {
    content: (
      <>
        <Tag color="green">进场</Tag>'10:15:30 车辆：贵C99991'
      </>
    ),
  },
  {
    content: (
      <>
        <Tag color="red">出场</Tag>'10:58:30 车辆：贵C99991'
      </>
    ),
    color: 'red',
  },
];
function Dashboard() {
  const baseOption = useMemo(
    () => ({
      title: {
        text: '当日能源消耗',
        left: '0%',
        top: '0%',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['煤炭', '燃气', '燃油', '电能', '热能'],
        left: 'center',
        top: '7%',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true,
      },

      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['0:00', '4:00', '8:00', '12:00', '16:00', '20:00', '24:00'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '煤炭',
          type: 'line',
          stack: 'Total',
          data: [100, 100, 100, 100, 100, 100, 100],
        },
        {
          name: '燃气',
          type: 'line',
          stack: 'Total',
          data: [200, 200, 200, 200, 200, 200, 200],
        },
        {
          name: '燃油',
          type: 'line',
          stack: 'Total',
          data: [300, 300, 300, 300, 300, 300, 300],
        },
        {
          name: '电能',
          type: 'line',
          stack: 'Total',
          data: [400, 400, 400, 400, 400, 400, 400],
        },
        {
          name: '热能',
          type: 'line',
          stack: 'Total',
          data: [500, 500, 500, 500, 500, 500, 500],
        },
      ],
    }),
    []
  );
  const [data, setData] = useState(baseOption);
  const loadData = useCallback(async () => {
    try {
      const { data: apiData } = await getEnergyData();
      console.log('能源数据', apiData);
      const dataList = apiData.map((item: EnergyType) => {
        return {
          name: item.name,
          type: 'line',
          stack: 'Total',
          data: item.data,
        };
      });
      const newOption = {
        ...baseOption,
        legend: {
          ...baseOption.legend,
          data: apiData.map((item: EnergyType) => item.name),
        },
        series: dataList,
      };
      setData(newOption);
      console.log('echarts数据', newOption);
    } catch (err) {
      console.error('获取能源数据出错', err);
    }
  }, [baseOption]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);
  return (
    <div className="dashboard">
      <Row gutter={16}>
        <Col span={6}>
          <Card className="card-content">
            <div className="area">
              <h2>12345</h2>
              <p>园区总面积（平方米）</p>
            </div>

            <RadarChartOutlined className="icon" style={{ color: '#5aaeed' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="card-content">
            <div className="area">
              <h2>12345</h2>
              <p>总租赁面积（平方米）</p>
            </div>

            <SnippetsOutlined className="icon" style={{ color: '#0ac232' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="card-content">
            <div className="area">
              <h2>12345</h2>
              <p>园区总产值（万元）</p>
            </div>

            <DollarOutlined className="icon" style={{ color: '#aaa807' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="card-content">
            <div className="area">
              <h2>12345</h2>
              <p>入驻企业数（家）</p>
            </div>

            <LaptopOutlined className="icon" style={{ color: '#ed5ab2' }} />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} className="mt">
        <Col span={12}>
          <Card className="card-echarts" title="能源消耗情况">
            <ReactECharts
              option={data}
              style={{ height: '100%', width: '100%' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card className="card-echarts" title="企业资质情况">
            <ReactECharts
              option={option}
              style={{ height: '100%', width: '100%' }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} className="mt">
        <Col span={12}>
          <Card className="card-echarts" title="企业入驻情况">
            <ReactECharts
              option={option1}
              style={{ height: '100%', width: '100%' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="card-echarts" title="充电桩空闲统计">
            <div className="wrapper ">
              <Progress type="circle" percent={75} />
              <Statistic
                title="Active Users"
                value={75}
                suffix="/100"
                className="mt"
              />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="card-echarts" title="实时车辆信息">
            <div className="timeline">
              <Timeline items={items} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
export default Dashboard;
