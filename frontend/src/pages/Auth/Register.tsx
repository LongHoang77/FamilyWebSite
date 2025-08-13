// src/pages/Auth/Register.tsx
import React from "react";
import { Card, Typography, Col } from "antd";
import { Link } from "react-router-dom";
import RegisterForm from "../../components/auth/RegisterForm";
import styles from "./Login.module.scss"; // Tái sử dụng style của trang Login

const { Title } = Typography;

const Register: React.FC = () => {
  return (
    <div className={styles.loginPage}>
      <Col>
        <Card className={styles.loginCard}>
          <Title level={2} className={styles.loginTitle}>
            Create Account
          </Title>
          <RegisterForm />
          <div className={styles.registerLink}>
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </Card>
      </Col>
    </div>
  );
};

export default Register;
