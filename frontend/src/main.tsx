// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "antd/dist/reset.css"; // Quan trọng: Reset CSS của Ant Design
import "./assets/scss/main.scss"; // Import file SCSS chính

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
