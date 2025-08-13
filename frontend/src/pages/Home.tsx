// frontend/src/pages/Home.tsx
import React from "react";
import { Typography, Row, Col, Card, Button } from "antd";
import {
  TeamOutlined,
  PictureOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography;

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <Card hoverable style={{ textAlign: "center", height: "100%" }}>
    <div style={{ fontSize: "48px", color: "#1677ff" }}>{icon}</div>
    <Title level={4} style={{ marginTop: "16px" }}>
      {title}
    </Title>
    <Paragraph>{description}</Paragraph>
  </Card>
);

const Home: React.FC = () => {
  return (
    <div>
      <Row
        justify="center"
        style={{ textAlign: "center", marginBottom: "48px" }}
      >
        <Col span={24}>
          <Title>Welcome to FamilySite</Title>
          <Paragraph
            style={{ fontSize: "18px", maxWidth: "700px", margin: "auto" }}
          >
            Your private, secure, and beautiful space to share memories, events,
            and stay connected with your loved ones.
          </Paragraph>
          <Link to="/register">
            <Button type="primary" size="large" style={{ marginTop: "20px" }}>
              Get Started for Free
            </Button>
          </Link>
        </Col>
      </Row>

      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} sm={12} md={8}>
          <FeatureCard
            icon={<TeamOutlined />}
            title="Family Tree"
            description="Explore your family history and connections through an interactive family tree."
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <FeatureCard
            icon={<PictureOutlined />}
            title="Shared Albums"
            description="Create and share photo albums from family gatherings, vacations, and special moments."
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <FeatureCard
            icon={<CalendarOutlined />}
            title="Events Calendar"
            description="Never miss a birthday, anniversary, or family event with a shared calendar."
          />
        </Col>
      </Row>
    </div>
  );
};

export default Home;
