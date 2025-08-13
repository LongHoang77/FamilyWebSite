// src/utils/getIcon.tsx
import React from "react";
import * as AntdIcons from "@ant-design/icons";

type AntdIconType = keyof typeof AntdIcons;

export const getIcon = (iconName?: string): React.ReactNode => {
  if (!iconName || typeof iconName !== "string") {
    return null;
  }
  const IconComponent = AntdIcons[iconName as AntdIconType];
  if (IconComponent) {
    return React.createElement(IconComponent as React.ElementType);
  }
  // Trả về một icon mặc định nếu không tìm thấy
  return <AntdIcons.QuestionCircleOutlined />;
};
