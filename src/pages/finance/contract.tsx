import { Card, Button, Row, Col, Table, Pagination } from 'antd';
import LabelInput from '@/components/labelInput';
import { useState, useEffect, useMemo, useCallback } from 'react';
import type { TableProps } from 'antd';
import type { ContractData, ContractQuery } from '@/types/types.js';
import { useContractStore } from '@/store/index';
import { useNavigate, useSearchParams } from 'react-router-dom';

function Contract() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryData, setQueryData] = useState<ContractQuery>({
    contractName: searchParams.get('contractName') || '',
    contractNo: searchParams.get('contractNo') || '',
    contractEndDate: searchParams.get('contractEndDate') || '',
  });
  const [page, setPage] = useState(
    searchParams.get('page') ? Number(searchParams.get('page')) : 1
  );
  const [pageSize, setPageSize] = useState(
    searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 10
  );
  const { contract, total, loading, loaData } = useContractStore();

  const handleDetail = useCallback(
    (record: ContractData) => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        contractNo: queryData.contractNo,
        contractName: queryData.contractName,
        contractEndDate: queryData.contractEndDate,
      });
      setSearchParams(params);

      navigate(`/finance/surrender/?contractNo=${record.contractNo}`);
    },
    [navigate, page, pageSize, queryData, setSearchParams]
  );

  const columns: TableProps<ContractData>['columns'] = useMemo(
    () => [
      {
        title: '序号',
        key: 'id',
        render: (_text, _record, index) => index + 1 + pageSize * (page - 1),
      },
      {
        title: '合同编号',
        key: 'contractNo',
        dataIndex: 'contractNo',
      },
      {
        title: '合同名称',
        dataIndex: 'contractName',
        key: 'contractName',
      },
      {
        title: '合同类型',
        key: 'contractCategory',
        dataIndex: 'contractCategory',
      },
      {
        title: '合同金额',
        dataIndex: 'contractAmount',
        key: 'contractAmount',
        render: (text) => text + '万元',
      },

      {
        title: '开始时间',
        dataIndex: 'contractStartDate',
        key: 'contractStartDate',
      },
      {
        title: '结束时间',
        dataIndex: 'contractEndDate',
        key: 'contractEndDate',
      },
      {
        title: '合同状态',
        dataIndex: 'contractStatus',
        key: 'contractStatus',
      },
      {
        title: '合同附件',
        dataIndex: 'contractAttachment',
        key: 'contractAttachment',
        render: (_text, record) => (
          <a href={record.contractAttachment} target="_blank">
            查看附件
          </a>
        ),
      },
      {
        title: '签订时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text) => text.split(' ')[0],
      },

      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (_text, record) => (
          <Button
            type="primary"
            size="small"
            onClick={() => handleDetail(record)}
          >
            合同详情
          </Button>
        ),
      },
    ],
    [pageSize, page, handleDetail]
  );

  const loaDataList = useCallback(() => {
    loaData(queryData, page, pageSize);
  }, [queryData, page, pageSize, loaData]);

  useEffect(() => {
    // 清除之前的查询参数
    setSearchParams({});
    loaDataList();
  }, [loaDataList, setSearchParams]);

  // 查询输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQueryData((prev: ContractQuery) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (currentPage: number, currentPageSize: number) => {
    if (currentPageSize !== pageSize) {
      setPage(1); // 如果每页条数改变，重置到第一页
      setPageSize(currentPageSize);
    } else {
      setPage(currentPage);
    }
  };

  const handleQuery = () => {
    setPage(1);
    loaDataList();
    console.log(queryData);
  };

  const handleReset = () => {
    setQueryData({
      contractName: '',
      contractNo: '',
      contractEndDate: '',
    });
    setPage(1);
    setPageSize(10);
  };

  return (
    <div className="contract">
      <Card className="card-Query mb">
        <Row gutter={16}>
          <Col span={7}>
            <LabelInput
              label="合同编号"
              name="contractNo"
              value={queryData.contractNo}
              onChange={handleChange}
            />
          </Col>
          <Col span={7}>
            <LabelInput
              label="合同名称"
              name="contractName"
              value={queryData.contractName}
              onChange={handleChange}
            />
          </Col>

          <Col span={7}>
            <LabelInput
              label="结束时间"
              name="contractEndDate"
              value={queryData.contractEndDate}
              onChange={handleChange}
            />
          </Col>
          <Col span={3}>
            <Button type="primary" onClick={handleQuery}>
              查询
            </Button>
            <Button className="ml" onClick={handleReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Card>
      <Card className="card-table clearfix">
        <Table
          columns={columns}
          dataSource={contract || []}
          pagination={false}
          rowKey="id"
          loading={loading}
        />
        <div className="pagination fr mt mb">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            onChange={handlePageChange}
            showTotal={(total) => `共 ${total} 条`}
            showQuickJumper
          />
        </div>
      </Card>
    </div>
  );
}
export default Contract;
