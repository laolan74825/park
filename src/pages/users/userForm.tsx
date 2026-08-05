import { Col, Form, Modal, Row, Input, Radio, message } from 'antd';
import { useCustomerStore } from '../../store/index';
import { useEffect } from 'react';
import { updateCustomer, addCustomer } from '@/api/index';

interface UserFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  title: string;
  loadData: () => void;
}
function UserForm(props: UserFormProps) {
  const customer = useCustomerStore((state) => state.customer);
  const { clearCustomerInfo } = useCustomerStore();
  const { visible, onClose, title } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if (customer && title === '编辑客户信息') {
      form.setFieldsValue(customer);
    }
  }, [customer, form, title]);

  const handleCancel = () => {
    onClose();
    setTimeout(() => {
      // 延迟执行，等待可能的关闭动画
      form.resetFields();
      clearCustomerInfo();
    }, 200);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const id = customer?.id;
        if (id) {
          const res = await updateCustomer(id, values);
          if (res.code === 200) {
            message.success('更新成功');
            console.log('更新成功记录：', res.data);
            handleCancel();
          }
        } else {
          const res = await addCustomer(values);
          if (res.code === 201) {
            message.success('添加成功');
            console.log('添加成功记录：', res.data);
            handleCancel();
          }
        }
        props.loadData();
      })
      .catch((error) => message.error('数据验证失败:' + error.message));
  };

  return (
    <>
      <Modal
        title={title}
        open={visible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        width={800}
      >
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ status: '1' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="客户名称"
                name="companyName"
                rules={[{ required: true, message: '请输入客户名称' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="经营状态"
                name="status"
                rules={[{ required: true, message: '状态不能为空' }]}
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
                label="邮箱"
                name="email"
                rules={[
                  { required: true, message: '邮箱不能为空' },
                  {
                    type: 'email',
                    message: '请输入正确的邮箱',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="法定代表人"
                name="legalPerson"
                rules={[{ required: true, message: '请输入法定代表人' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="联系电话"
                name="phone"
                rules={[
                  { required: true, message: '联系电话不能为空' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="所属行业"
                name="industry"
                rules={[{ required: true, message: '请输入所属行业' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="统一信用代码"
                name="creditCode"
                rules={[{ required: true, message: '请输入统一信用代码' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="注册号"
                name="registerCode"
                rules={[{ required: true, message: '请输入注册号' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default UserForm;
