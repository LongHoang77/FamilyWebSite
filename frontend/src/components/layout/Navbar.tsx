// frontend/src/components/layout/Navbar.tsx
import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Space, Avatar, Dropdown, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import api from "../../api";
import { authService } from "../../services/auth.service";

const { Header } = Layout;

interface MenuItem {
  _id: string;
  label: string;
  path: string;
}

const Navbar: React.FC = () => {
  const [navItems, setNavItems] = useState<MenuProps["items"]>([]);
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ service
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  // Kiểm tra vai trò của người dùng
  const isAdminOrModerator =
    user?.roles.includes("admin") || user?.roles.includes("moderator");

  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        const { data } = await api.get("/navigation", {
          params: { type: "navbar" },
        });

        const formattedItems = data.map((item: MenuItem) => ({
          key: item.path,
          label: <Link to={item.path}>{item.label}</Link>,
        }));
        setNavItems(formattedItems);
      } catch (error) {
        console.error("Failed to fetch navbar items:", error);
      }
    };

    fetchNavItems();
  }, []);

  const handleLogout = () => {
    authService.logout();
    message.success("Logged out successfully");
    navigate("/login");
    // Tải lại trang để đảm bảo mọi trạng thái được reset
    window.location.reload();
  };

  // --- XÂY DỰNG MENU DROPDOWN ĐỘNG ---
  const buildUserMenu = () => {
    const menuItems: MenuProps["items"] = [];

    // Thêm mục "My Profile" (ví dụ) cho tất cả người dùng đã đăng nhập
    // menuItems.push({
    //   key: 'profile',
    //   label: 'My Profile',
    //   icon: <ProfileOutlined />,
    //   onClick: () => navigate('/profile') // Sẽ cần tạo trang này trong tương lai
    // });

    // Chỉ thêm mục "Go to Dashboard" nếu là admin hoặc moderator
    if (isAdminOrModerator) {
      menuItems.push({
        key: "dashboard",
        label: "Go to Dashboard",
        icon: <DashboardOutlined />,
        onClick: () => navigate("/dashboard"),
      });
    }

    // Thêm dấu gạch ngang nếu có các mục khác ngoài Logout
    if (menuItems.length > 0) {
      menuItems.push({ type: "divider" });
    }

    // Luôn thêm mục "Logout"
    menuItems.push({
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    });

    return menuItems;
  };

  const userMenuItems = buildUserMenu();
  // ------------------------------------

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "white",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link
          to="/"
          style={{ fontSize: "20px", fontWeight: "bold", color: "#1677ff" }}
        >
          FamilySite
        </Link>
        <Menu
          theme="light"
          mode="horizontal"
          items={navItems}
          style={{
            flex: 1,
            minWidth: 0,
            marginLeft: "50px",
            borderBottom: "none",
          }}
          disabledOverflow
        />
      </div>

      <div>
        {isAuthenticated && user ? (
          // Sử dụng mảng menu đã được xây dựng động
          <Dropdown
            menu={{ items: userMenuItems }}
            trigger={["hover"]}
            placement="bottomRight"
            overlayStyle={{ paddingTop: "12px" }}
          >
            <a
              onClick={(e) => e.preventDefault()}
              style={{ cursor: "pointer" }}
            >
              <Space>
                <Avatar icon={<UserOutlined />} />
                {user.username}
              </Space>
            </a>
          </Dropdown>
        ) : (
          <Space>
            <Button onClick={() => navigate("/login")}>Log In</Button>
            <Button type="primary" onClick={() => navigate("/register")}>
              Sign Up
            </Button>
          </Space>
        )}
      </div>
    </Header>
  );
};

export default Navbar;
