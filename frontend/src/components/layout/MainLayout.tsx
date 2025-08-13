import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const { Content } = Layout;

const MainLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />
      <Content style={{ padding: "0 48px", marginTop: 24 }}>
        <div
          style={{
            background: "white",
            minHeight: 280,
            padding: 24,
            borderRadius: 8,
          }}
        >
          {/* Nội dung của Home, About,... sẽ được render ở đây */}
          <Outlet />
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default MainLayout;
