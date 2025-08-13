/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Tag,
  Space,
  InputNumber,
  Typography,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import api from "../../../api"; // Import instance Axios đã cấu hình

const { Option } = Select;
const { Title, Paragraph } = Typography;

// Định nghĩa kiểu dữ liệu cho một mục menu
interface NavigationItem {
  _id: string;
  label: string;
  path: string;
  icon?: string;
  type: "navbar" | "sidebar";
  roles: string[];
  order: number;
  parent?: string | null;
}

const NavigationManagement: React.FC = () => {
  // State quản lý danh sách các mục menu
  const [items, setItems] = useState<NavigationItem[]>([]);
  // State quản lý trạng thái hiển thị của Modal (form thêm/sửa)
  const [isModalVisible, setIsModalVisible] = useState(false);
  // State lưu trữ mục menu đang được chỉnh sửa
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  // State quản lý trạng thái loading của bảng và các nút
  const [loading, setLoading] = useState(true);
  // AntD Form instance để có thể reset, set giá trị cho form
  const [form] = Form.useForm();

  // Hàm gọi API để lấy tất cả các mục menu
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      // Sử dụng `api` đã có sẵn token
      const { data } = await api.get<NavigationItem[]>("/navigation/all");
      setItems(data);
    } catch (error) {
      message.error("Failed to fetch navigation items. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Gọi hàm fetchItems lần đầu khi component được render
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Hàm xử lý khi nhấn nút "Add New Menu Item"
  const handleAdd = () => {
    setEditingItem(null); // Không có item nào đang sửa
    form.resetFields(); // Xóa các giá trị cũ trong form
    setIsModalVisible(true); // Hiển thị Modal
  };

  // Hàm xử lý khi nhấn nút "Edit" trên một hàng của bảng
  const handleEdit = (record: NavigationItem) => {
    setEditingItem(record); // Lưu lại item đang sửa
    form.setFieldsValue(record); // Điền thông tin của item vào form
    setIsModalVisible(true); // Hiển thị Modal
  };

  // Hàm xử lý khi nhấn nút "Delete"
  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await api.delete(`/navigation/${id}`);
      message.success("Menu item deleted successfully!");
      fetchItems(); // Tải lại danh sách sau khi xóa
    } catch (error) {
      message.error("Failed to delete item.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi nhấn nút "OK" trên Modal
  const handleModalSubmit = async () => {
    try {
      // Validate các trường trong form
      const values = await form.validateFields();
      setLoading(true);

      if (editingItem) {
        // Nếu đang sửa -> gọi API PUT
        await api.put(`/navigation/${editingItem._id}`, values);
        message.success("Item updated successfully!");
      } else {
        // Nếu thêm mới -> gọi API POST
        await api.post("/navigation", values);
        message.success("Item created successfully!");
      }

      setIsModalVisible(false); // Đóng Modal
      fetchItems(); // Tải lại danh sách
    } catch (error: any) {
      // Lỗi có thể do validation hoặc từ API
      if (error.errorFields) {
        message.error("Please fill in all required fields correctly.");
      } else {
        message.error(error.response?.data?.message || "An error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi đóng Modal
  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  // Định nghĩa các cột cho bảng AntD
  const columns: ColumnsType<NavigationItem> = [
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
      sorter: (a, b) => a.order - b.order,
      width: 80,
    },
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "Path",
      dataIndex: "path",
      key: "path",
      render: (text) => <code>{text}</code>,
    },
    {
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "Sidebar", value: "sidebar" },
        { text: "Navbar", value: "navbar" },
      ],
      onFilter: (value, record) => record.type.indexOf(value as string) === 0,
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      render: (roles: string[]) => (
        <Space wrap>
          {roles.map((role) => (
            <Tag
              color={
                role === "admin"
                  ? "volcano"
                  : role === "moderator"
                  ? "geekblue"
                  : "green"
              }
              key={role}
            >
              {role.toUpperCase()}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete this item?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            placement="left"
          >
            <Tooltip title="Delete">
              <Button icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Navigation Management
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add New Menu Item
        </Button>
      </div>
      <Paragraph>
        Here you can manage all navigation links for both the main Navbar and
        the Admin Sidebar.
      </Paragraph>

      <Table
        columns={columns}
        dataSource={items}
        rowKey="_id"
        loading={loading}
        bordered
      />

      <Modal
        title={editingItem ? "Edit Menu Item" : "Add New Menu Item"}
        open={isModalVisible}
        onOk={handleModalSubmit}
        onCancel={handleModalCancel}
        confirmLoading={loading}
        destroyOnClose // Reset form fields khi modal được đóng
      >
        <Form
          form={form}
          layout="vertical"
          name="menu_item_form"
          initialValues={{ order: 0, type: "sidebar" }}
        >
          <Form.Item
            name="label"
            label="Label"
            rules={[{ required: true, message: "Please input the label!" }]}
          >
            <Input placeholder="e.g., User Management" />
          </Form.Item>
          <Form.Item
            name="path"
            label="Path"
            rules={[
              {
                required: true,
                message: "Please input the path! (e.g., /dashboard/users)",
              },
            ]}
          >
            <Input placeholder="/dashboard/users" />
          </Form.Item>
          <Form.Item
            name="icon"
            label="Icon Name (from Ant Design)"
            tooltip={{
              title:
                "Find icon names on the Ant Design Icons website. Example: UserOutlined",
              icon: <QuestionCircleOutlined />,
            }}
          >
            <Input placeholder="e.g., UserOutlined" />
          </Form.Item>
          <Form.Item name="type" label="Menu Type" rules={[{ required: true }]}>
            <Select>
              <Option value="sidebar">Admin Sidebar</Option>
              <Option value="navbar">Main Navbar</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="roles"
            label="Visible to Roles"
            rules={[
              { required: true, message: "Please select at least one role!" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select roles that can see this item"
            >
              <Option value="user">User</Option>
              <Option value="moderator">Moderator</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="order"
            label="Display Order"
            rules={[{ required: true, message: "Please set a display order!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="parent"
            label="Parent Menu (for Sub-menu)"
            tooltip="Leave empty if this is a top-level menu item."
          >
            <Select placeholder="Select a parent item" allowClear>
              {items
                .filter((item) => !item.parent) // Chỉ cho phép chọn các mục menu cấp 1 làm cha
                .map((item) => (
                  <Option key={item._id} value={item._id}>
                    {item.label} ({item.path})
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NavigationManagement;
