import React from "react";
import { Layout } from "antd";
import { HeartFilled } from "@ant-design/icons";

const { Footer: AntFooter } = Layout;

const Footer: React.FC = () => {
  return (
    <AntFooter style={{ textAlign: "center", background: "#f0f2f5" }}>
      FamilySite ©{new Date().getFullYear()} Created with{" "}
      <HeartFilled style={{ color: "red" }} /> by LongH
    </AntFooter>
  );
};

export default Footer;
