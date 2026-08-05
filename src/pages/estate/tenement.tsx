import { Card, Col, Row, Button, Table, Space, Progress, message } from 'antd';
import { Tag, Pagination, Popconfirm } from 'antd';
import type { TableProps } from 'antd';
import LabelInput from '@/components/labelInput/index';
import type { BuildingData } from '@/types/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getBuildingList } from '@/api/buildingList';
import LabelSelect from '@/components/labelSelect';
import {
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import BuidingForm from './buidingForm';
import { updateBuilding, deleteBuilding, addBuilding } from '@/api/index';

function Tenement() {
  const [dataSource, setDataSource] = useState<BuildingData[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [queryData, setQueryData] = useState({
    buildingName: '',
    manager: '',
    status: '',
  });
  const [record, setRecord] = useState<BuildingData | null>(null);
  const [myQueryData, setMyQueryData] = useState({ ...queryData });
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getBuildingList({
        ...myQueryData,
        page,
        pageSize,
        _timestamp: Date.now(), // 添加时间戳参数，强制后端不使用缓存
      });

      const { data, total, code } = response;
      if (code === 200 && data) {
        setDataSource(data);
        setTotal(total || 0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [myQueryData, page, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  // 编辑楼宇信息
  const handleEdit = useCallback((record: BuildingData) => {
    setRecord(record);
    setTitle('编辑楼宇信息');
    setFormOpen(true);
  }, []);

  // 新增楼宇信息
  const handleAdd = () => {
    setRecord(null);
    setTitle('新增楼宇信息');
    setFormOpen(true);
  };

  // 删除楼宇信息
  const handleDelete = useCallback(
    async (id: string) => {
      // 这里向后端发送删除请求，成功后刷新数据
      try {
        const res = await deleteBuilding(id);
        console.log('删除成功记录：', res);
        if (dataSource.length === 1 && page > 1) {
          setPage(page - 1);
        }
        await loadData();
      } catch (error) {
        console.error('删除失败：', error);
        return message.error('删除失败');
      }
    },
    [loadData, dataSource.length, page]
  );

  const columns: TableProps<BuildingData>['columns'] = useMemo(
    () => [
      {
        title: '序号',
        key: 'id',
        render: (_text, _record, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: '楼宇名称',
        key: 'buildingName',
        dataIndex: 'buildingName',
      },
      {
        title: '负责人',
        key: 'manager',
        dataIndex: 'manager',
      },
      {
        title: '负责人电话',
        key: 'phone',
        dataIndex: 'phone',
      },
      {
        title: '楼宇面积',
        key: 'area',
        dataIndex: 'area',
      },
      {
        title: '使用状态',
        key: 'status',
        dataIndex: 'status',
        render: (text) => {
          switch (text) {
            case '1':
              return <Tag color="green">建设中</Tag>;
            case '2':
              return <Tag color="red">已竣工</Tag>;
            case '3':
              return <Tag color="orange">使用中</Tag>;
          }
        },
      },
      {
        title: '空置率',
        key: 'emptyRate',
        dataIndex: 'emptyRate',
        render: (text) => <Progress percent={text} status="active" />,
      },
      {
        title: '物业费率',
        key: 'propertyRate',
        dataIndex: 'propertyRate',
      },
      {
        title: '操作',
        key: 'action',
        render: (_text, record) => (
          <Space size="middle">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
            <Popconfirm
              title="确定要删除这个楼宇吗？"
              description="删除后无法恢复，请谨慎操作！"
              okText="确定"
              onConfirm={() => {
                handleDelete(record.id);
              }}
              cancelText="取消"
              onCancel={() => {
                console.log(`取消id为: ${record.id}的楼宇进行删除`);
              }}
            >
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [handleEdit, handleDelete, page, pageSize]
  );

  const options = [
    { label: '建设中', value: '1' },
    { label: '已竣工', value: '2' },
    { label: '使用中', value: '3' },
  ];


  const onChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | string
  ) => {
    let name = '';
    let value = '';
    if (typeof e === 'string') {
      name = 'status';
      value = e;
    } else {
      name = e.target.name;
      value = e.target.value;
    }
    setQueryData({
      ...queryData,
      [name]: value,
    });
  };
  const handleQuery = () => {
    setMyQueryData({ ...queryData });
    setPage(1);
    setPageSize(10);
  };
  // 重置查询条件
  const handleReset = () => {
    setQueryData({
      buildingName: '',
      manager: '',
      status: '',
    });
    setMyQueryData({
      buildingName: '',
      manager: '',
      status: '',
    });
    setPage(1);
    setPageSize(10);
  };

  const handleFormSubmit = async (values: BuildingData) => {
    // 这里根据record是否存在来判断是编辑还是新增
    if (values && values?.id) {
      // 向后端发送更新请求
      const ren = await updateBuilding(values.id, values);

      console.log('更新成功', ren.message);
      setRecord(null);
    } else {
      // 向后端发送新增请求
      const res = await addBuilding(values);
      console.log('新增楼宇信息', res.message);
    }
    loadData();
    setFormOpen(false);
    setRecord(null);
  };

  const handleClose = () => {
    setFormOpen(false);
    setRecord(null);
  };

  return (
    <div className="tenement">
      <BuidingForm
        open={formOpen}
        onClose={handleClose}
        title={title}
        data={record}
        onOk={handleFormSubmit}
      />
      <Card className="mb" style={{ width: '100%' }}>
        <Row gutter={16}>
          <Col span={4}>
            <LabelInput
              label="楼宇名称"
              name="buildingName"
              value={queryData.buildingName}
              onChange={onChange}
            />
          </Col>
          <Col span={4}>
            <LabelInput
              label="联系人"
              name="manager"
              value={queryData.manager}
              onChange={onChange}
            />
          </Col>
          <Col span={3}>
            <LabelSelect
              label="使用状态"
              options={options}
              value={queryData.status}
              onChange={onChange}
            />
          </Col>
          <Col span={4}>
            <Button
              type="primary"
              onClick={handleQuery}
              icon={<SearchOutlined />}
            >
              查询
            </Button>
            <Button
              className="ml"
              onClick={handleReset}
              icon={<ReloadOutlined />}
            >
              重置
            </Button>
          </Col>
          <Col span={9} className="tr">
            <Button type="primary" onClick={handleAdd}>
              新增楼宇信息
            </Button>
          </Col>
        </Row>
      </Card>
      <Card>
        <Table
          dataSource={dataSource}
          columns={columns}
          loading={loading}
          rowKey="id"
          pagination={false}
          locale={{
            emptyText: '暂无数据',
          }}
        />
        <div className="mt clearfix">
          <Pagination
            className="fr"
            current={page}
            pageSize={pageSize}
            total={total}
            showTotal={() => `共计 ${total} 条`}
            showSizeChanger={true}
            showQuickJumper={true}
            onChange={(page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            }}
          />
        </div>
      </Card>
    </div>
  );
}
export default Tenement;
