import { DownOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Dropdown, message, Space, type MenuProps } from 'antd';
import { useUserStore, useMenuStore } from '@/store/index';
import { useNavigate } from 'react-router-dom';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: <a target="_blank">个人中心</a>,
    icon: <UserOutlined />,
  },
  {
    key: '2',
    label: <a target="_blank">退出登录</a>,
    icon: <LogoutOutlined />,
  },
];
function MyHeader() {
  const { user, clearUserInfo } = useUserStore.getState();
  const { clearMenuData } = useMenuStore.getState();

  const navigate = useNavigate();
  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === '1') {
      navigate('/personal');
    } else if (key === '2') {
      clearUserInfo();
      clearMenuData();
      message.success('退出登录成功');
    }
  };
  return (
    <Dropdown menu={{ items, onClick }}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          欢迎您 •{user?.name || 'User'}
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  );
}

export default MyHeader;
