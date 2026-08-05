import { Col, Form, Input, Modal, Radio, Row } from 'antd';
import type { BuildingData } from '@/types/types';
import { useEffect } from 'react';

interface BuidingFormProps {
  open: boolean;
  onClose: () => void;
  onOk: (values: BuildingData) => void;
  title: string;
  data: BuildingData | null;
}
function BuidingForm(props: BuidingFormProps) {
  const { open, onClose, onOk, title, data } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data, form]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (data && data.id) values.id = data.id;
        console.log('提交', values);
        onOk(values);
        handleCancel();
      })
      .catch((error) => {
        console.error('验证失败:', error);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      width={800}
      okText="提交"
      cancelText="取消"
    >
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ status: '1' }}
      >
        <Row>
          <Col span={12}>
            <Form.Item
              label="楼宇名称"
              name="buildingName"
              rules={[{ required: true, message: '请输入楼宇名称' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="使用状态"
              name="status"
              rules={[{ required: true, message: '请选择使用状态' }]}
            >
              <Radio.Group
                options={[
                  { label: '正常', value: '1' },
                  { label: '异常', value: '2' },
                  { label: '注销', value: '3' },
                ]}
              />
            </Form.Item>
            <Form.Item
              label="负责人"
              name="manager"
              rules={[
                { required: true, message: '请输入负责人' },
                { min: 2, max: 10, message: '请输入2-10个字符' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="负责人电话"
              name="phone"
              rules={[
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效手机号码' },
                { required: true, message: '请输入负责人电话' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="楼宇面积"
              name="area"
              rules={[
                { required: true, message: '请输入楼宇面积' },
                { pattern: /^\d+(\.\d+)?$/, message: '请输入有效数字' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="空置率"
              name="emptyRate"
              rules={[
                { required: true, message: '请输入空置率' },
                { pattern: /^\d+(\.\d+)?$/, message: '请输入有效数字' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="物业费率"
              name="propertyRate"
              rules={[
                { required: true, message: '请输入物业费率' },
                { pattern: /^\d+(\.\d+)?$/, message: '请输入有效数字' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default BuidingForm;
