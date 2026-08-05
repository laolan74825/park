import './index.scss';
import logo from '@/assets/logo.png';
import bg from '@/assets/bg.jpg';
import lgbg from '@/assets/lgbg.jpg';
import { Button, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { apiLogin } from '@/api/index';
import { useUserStore } from '@/store/index';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
function Login() {
  const [form] = Form.useForm();
  const { setUserInfo } = useUserStore.getState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleLogin = () => {
    form
      .validateFields()
      .then(async (requestData) => {
        setLoading(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const responseData: any = await apiLogin(requestData);
        setUserInfo({
          id: responseData.data.user.id,
          name: responseData.data.user.name,
          token: responseData.data.user.token,
        });
        navigate('/');
        message.success('登录成功');
        console.log('✅登录成功', responseData);
      })
      .catch((error) => {
        message.error('登录失败，请检查输入并重试');
        console.log('❌表单登录错误', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login" style={{ backgroundImage: `url("${bg}")` }}>
      <div className="lgbg" style={{ backgroundImage: `url("${lgbg}")` }}>
        <div className="part">
          <div className="title">
            <div className="logo">
              <img src={logo} alt="logo" width={100} />
            </div>
            <h1>鹏远智慧园区管理平台</h1>
          </div>
          <Form form={form}>
            <Form.Item
              name="name"
              validateTrigger="onBlur"
              rules={[{ min: 2, max: 20, message: '用户名必须是2-20位字符!' }]}
            >
              <Input placeholder="请输入您的用户名" prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item
              name="password"
              validateTrigger="onBlur"
              rules={[
                {
                  pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)(?![^0-9a-zA-Z]+$).{6,}$/,
                  message:
                    '密码不能少于6位，且需包含数字、字母、特殊字符中的两种以上',
                },
              ]}
            >
              <Input.Password
                placeholder="请输入您的密码"
                prefix={<LockOutlined />}
              />
            </Form.Item>

            <Form.Item label={null}>
              <Button
                type="primary"
                style={{ width: '100%' }}
                onClick={handleLogin}
                loading={loading}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
export default Login;
