'use client';

import { Layout } from 'antd';
import AppHeader from 'components/DashboardHeader';
import DashboardSideMenu from 'components/DashboardSideMenu';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
import 'antd/dist/reset.css';
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <AppHeader />
      <Layout hasSider>
        <Sider
          width={200}
          theme="light"
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            borderRight: '1px solid #f1f1f1',
            height: 'calc(100vh - 64px)',
          }}
        >
          <DashboardSideMenu />
        </Sider>
        <Layout style={{ marginLeft: 200 }}>
          <Content style={{ padding: '16px', minHeight: 'calc(100vh - 64px)' }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
