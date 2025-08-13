/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/auth/LoginForm.tsx
import React from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { authService } from "../../services/auth.service";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      // Gọi API đăng nhập
      const { data } = await api.post("/auth/login", {
        identifier: values.identifier,
        password: values.password,
      });

      // Lưu thông tin đăng nhập (token và user)
      authService.login(data.token, data);

      message.success("Login successful!");

      // --- LOGIC CHUYỂN HƯỚNG ĐỘNG ---
      // Kiểm tra xem trong mảng vai trò của người dùng có 'admin' hoặc 'moderator' không
      const isAdminOrModerator =
        data.roles.includes("admin") || data.roles.includes("moderator");

      if (isAdminOrModerator) {
        // Nếu là admin hoặc mod, chuyển hướng đến trang quản trị
        navigate("/dashboard");
      } else {
        // Nếu là user thông thường, chuyển hướng về trang chủ
        navigate("/");
      }
      // ------------------------------------
    } catch (error: any) {
      message.error(error.response?.data?.message || "Login failed!");
    }
  };

  // ... phần JSX của Form giữ nguyên
  return (
    <Form form={form} name="normal_login" onFinish={onFinish}>
      <Form.Item
        name="identifier"
        rules={[
          { required: true, message: "Please input your Username or Email!" },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username or Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your Password!" }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
