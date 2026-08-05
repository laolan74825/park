import { Button, Card, Col, Form, Input } from 'antd';
import { message, Popconfirm, Row, Table, Tag } from 'antd';
import { Pagination, type PaginationProps, type TableProps } from 'antd';
import type { CustomerData, CustomerQuery } from '@/types/types';
import { useCallback, useEffect, useState } from 'react';
import { getCustomerList, deleteCustomer, deleteItems } from '@/api/index';
import UserForm from './userForm';
import React from 'react';
import {useCustomerStore} from '@/store/index';


function Users() {
  const [dataList, setDataList] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [showUserForm, setShowUserForm] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const  setCustomerInfo = useCustomerStore((state) => state.setCustomerInfo);
  const clearCustomerInfo = useCustomerStore((state) => state.clearCustomerInfo);

  const columns: TableProps<CustomerData>['columns'] = [
    {
      title: '序号',
      key: 'id',
      render: (_text, _record, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: '企业名称',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: '经营状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        return text === '1' ? (
          <Tag color="green">正常</Tag>
        ) : text === '2' ? (
          <Tag color="red">异常</Tag>
        ) : (
          <Tag color="orange">注销</Tag>
        );
      },
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '所属行业',
      dataIndex: 'industry',
      key: 'industry',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '信用代码',
      dataIndex: 'creditCode',
      key: 'creditCode',
    },
    {
      title: '工商注册号',
      dataIndex: 'registerCode',
      key: 'registerCode',
    },
    {
      title: '法定代表',
      dataIndex: 'legalPerson',
      key: 'legalPerson',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="primary" size="small" onClick={()=>edit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="删除确认"
            description="你确定要删除吗?"
            onConfirm={() => confirm(record.id)}
            onCancel={() => message.error('取消删除')}
            okText="确认"
            cancelText="取消"
          >
            <Button className="ml" danger type="primary" size="small">
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];
  const edit = (record: CustomerData) => {
    setShowUserForm(true);
    setTitle('编辑客户信息');
    setCustomerInfo(record);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], _selectedRows: CustomerData[]) => {
      console.log('选中记录的key', selectedRowKeys);
      setSelectedRowKeys(selectedRowKeys);
    },
    // onSelect: (
    //   record: UserData,
    //   selected: boolean,
    //   selectedRows: UserData[]
    // ) => {
    //   console.log(record, selected, selectedRows);
    // },
  };
  const loadData = useCallback(
    async (valuse?: CustomerQuery) => {
      setLoading(true);
      try {
        const queryParams = form.getFieldsValue();

        // 确保分布参数存在
        const fialaQuery = {
          ...queryParams,
          ...valuse,
          page: valuse?.page ?? page,
          pageSize: valuse?.pageSize ?? pageSize,
          _t: Date.now(),
        };
        const res = await getCustomerList(fialaQuery);

        if (res.code === 200) {
          setDataList(res.data);
          setTotal(res.total || 0);
        }
      } catch (error) {
        message.error('数据加载失败');
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [form, page, pageSize] //form依赖是没有影响的
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 查询函数
  const handleSearch = () => {
    setPage(1);
    setPageSize(10);
    loadData({ page: 1, pageSize: 10 }); // 显式传入，避免闭包旧值
  };

  // 复位查询条件
  const handleReset = () => {
    setSelectedRowKeys([]);
    setPage(1);
    setPageSize(10);
    form.resetFields();
    loadData({
      // 直接传默认值，以防读到旧值
      page: 1,
      pageSize: 10,
    });
  };

  // 分页函数
  const handleTableChange: PaginationProps['onChange'] = async (
    current,
    size
  ) => {
    const newPageSize = size || 10;
    const newPage = pageSize !== newPageSize ? 1 : current || 1;
    setPage(newPage || 1);
    setPageSize(newPageSize || 10);
    await loadData({
      page: newPage,
      pageSize: newPageSize,
    });
  };

  // 删除一条客户数据
  async function confirm(id: string) {
    const res = await deleteCustomer(id);
    if (res.code !== 200) return message.error('删除失败');
    const isLastItem = dataList.length === 1;
    const targetPage = isLastItem && page > 1 ? page - 1 : page;

    if (targetPage !== page) setPage(targetPage);

    await loadData({
      page: targetPage,
      pageSize: pageSize,
    });

    message.success(`ID号为 ${id} 的记录删除成功`);
  }

  // 批量删除客户数据
  async function batchDelete() {
    const ids = selectedRowKeys.map((key) => String(key));
    const res = await deleteItems(ids);
    if (res.code !== 200) return message.error('删除失败');

    setSelectedRowKeys([]);

    // 计算删除后应该停留在哪一页
    const remaining = total - ids.length; // 剩余总条数
    const maxPage = Math.ceil(remaining / pageSize) || 1;
    const targetPage = Math.min(page, maxPage); // 当前页如果超界就回退

    if (targetPage !== page) setPage(targetPage);
    await loadData({
      page: targetPage,
      pageSize: pageSize,
    });
    message.success(res.message);
  }

  // 新增企业
  const addCustomer = () => {
    setShowUserForm(true);
    setTitle('新增客户信息');
    clearCustomerInfo();
  };

  // 关闭用户表单
  const closeUserForm = useCallback(() => {
    setShowUserForm(false);
  },[]);
  return (
    <div className="users">
      <MyUserForm visible={showUserForm} onClose={closeUserForm} title={title} loadData={loadData}/>
      <Card className="mb">
        <Form layout="horizontal" form={form}>
          <Row gutter={16}>
            <Col span={7}>
              <Form.Item label="企业名称" name="companyName">
                <Input />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="联系人" name="contactPerson">
                <Input />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="联系电话" name="phone">
                <Input />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Button type="primary" onClick={handleSearch}>
                查询
              </Button>
              <Button className="ml" onClick={handleReset}>
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card className="mb tr">
        <Button type="primary" onClick={addCustomer}>新增企业</Button>
        <Button
          className="ml"
          danger
          type="primary"
          disabled={selectedRowKeys.length === 0}
          onClick={batchDelete}
        >
          批量删除
        </Button>
      </Card>
      <Card className="clearfix">
        <Table
          columns={columns}
          dataSource={dataList}
          rowKey="id"
          loading={loading}
          rowSelection={rowSelection}
          pagination={false}
          locale={{
            emptyText: '暂无数据',
          }}
        />
        <Pagination
          className="mt mb fr"
          total={total}
          current={page}
          pageSize={pageSize}
          showTotal={(total) => `共有${total}条数据`}
          showSizeChanger={true}
          showQuickJumper={true}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
}

const MyUserForm = React.memo(UserForm);
export default Users;
