import { Layout, theme } from 'antd';
import { Suspense, useState } from 'react';
import NavLeft from '@/components/navLeft/index';
import MyBreadCrumb from '@/components/breadCrumb/index';
import MyHeader from '@/components/header';
import { Outlet } from 'react-router-dom';

const { Content, Footer, Header, Sider } = Layout;

function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <NavLeft />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: '0 20px',
              background: colorBgContainer,
              textAlign: 'right',
            }}
          >
            <MyHeader />
          </Header>
          <Content style={{ margin: '0 16px', height:'90vh', overflowY:'auto' ,overflowX:'hidden'}}>
            <MyBreadCrumb />
            <div>
              <Outlet />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </Suspense>
  );
}

export default Home;
