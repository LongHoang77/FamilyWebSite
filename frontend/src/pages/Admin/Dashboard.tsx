// src/pages/Admin/Dashboard.tsx
import React from "react";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

const Dashboard: React.FC = () => {
  return (
    <div>
      <Title>Admin Dashboard</Title>
      <Paragraph>
        Welcome to the management area. Select an option from the sidebar to get
        started.
      </Paragraph>
    </div>
  );
};

export default Dashboard;
