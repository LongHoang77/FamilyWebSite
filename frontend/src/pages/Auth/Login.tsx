// frontend/src/pages/Auth/Login.tsx
import React from "react";
import { Card, Typography, Row, Col } from "antd";
import { Link } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm"; // Import form đăng nhập

const { Title } = Typography;

const Login: React.FC = () => {
  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: "100vh", background: "#f0f2f5" }}
    >
      <Col xs={22} sm={16} md={12} lg={8} xl={6}>
        <Card>
          <Title
            level={2}
            style={{ textAlign: "center", marginBottom: "2rem" }}
          >
            Login to FamilySite
          </Title>
          <LoginForm /> {/* Component chứa form của AntD */}
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            Don't have an account? <Link to="/register">Register now!</Link>
          </div>
          <div style={{ marginTop: "0.5rem", textAlign: "center" }}>
            <Link to="/">← Back to Home</Link>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
