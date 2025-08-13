/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/layout/AdminLayout.tsx
import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, message, Spin } from "antd";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import api from "../../api";
import { getIcon } from "../../utils/getIcon";
import { authService } from "../../services/auth.service";
import styles from "./AdminLayout.module.scss";

const { Header, Content, Sider } = Layout;

interface MenuItem {
  _id: string;
  label: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
}

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    message.success("Logged out successfully");
    navigate("/");
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/navigation", {
          params: { type: "sidebar" },
        });
        const formatMenu = (items: MenuItem[]): any[] => {
          return items.map((item) => ({
            key: item.path,
            icon: getIcon(item.icon),
            label: item.children?.length ? (
              item.label
            ) : (
              <Link to={item.path}>{item.label}</Link>
            ),
            children: item.children?.length ? formatMenu(item.children) : null,
          }));
        };
        setMenuItems(formatMenu(data));
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  const getSelectedKeys = () => [location.pathname];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
        <div className={styles.siderLogo} onClick={() => navigate("/")}>
          {collapsed ? "FS" : "FamilySite"}
        </div>
        {loading ? (
          <Spin style={{ marginTop: 20 }} />
        ) : (
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={getSelectedKeys()}
            items={menuItems}
          />
        )}
      </Sider>
      <Layout>
        <Header className={styles.header}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: styles.trigger,
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
