"use client";

import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/category";
import { CrownOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  Card,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { useColumnSearch } from "@/hooks/utils/useColumnSearch";
import { useState } from "react";
const { Title } = Typography;
const { Option } = Select;

interface DataType {
  key: string;
  id: string;
  category: string;
  parent: string;
  parentId?: string | null;
  status: string;
}

export default function Category() {
  const { data, isLoading } = useCategories();

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const { getColumnSearchProps } = useColumnSearch();
  const [selectedCategory, setSelectedCategory] = useState<DataType | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: createCategory } = useCreateCategory();
  const { mutate: updateCategory } = useUpdateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();

  const columns: ColumnsType<DataType> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: "25%",
      ...getColumnSearchProps("category"),
    },
    {
      title: "Danh mục cha",
      dataIndex: "parent",
      key: "parent",
      width: "25%",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (_, record) => (
        <Tag color={record.status === "completed" ? "green" : "blue"}>
          {record.status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "10%",
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              setSelectedCategory(record);
              form.setFieldsValue(record);
              setIsEditing(true);
              setIsModalVisible(true);
            }}
          >
            Edit
          </a>
          <a
            onClick={() => {
              setSelectedCategory(record);
              setIsDeleteModalVisible(true);
            }}
          >
            Delete
          </a>
        </Space>
      ),
    },
  ];

  const handleModalSubmit = () => {
    form.validateFields().then((values) => {
      const payload = {
        categoryName: values.category,
        status: values.status === "completed",
        parentCategory: values.parent == "Không có" ? null : values.parent,
      };

      if (isEditing) {
        updateCategory(
          { id: selectedCategory?.id ?? "", data: payload },
          {
            onSuccess: () => {
              console.log("Create category success");
              setIsModalVisible(false);
              form.resetFields();
              setIsEditing(false);
            },
          }
        );
      } else {
        createCategory(payload, {
          onSuccess: () => {
            console.log("Create category success");
            setIsModalVisible(false);
            form.resetFields();
          },
        });
      }
    });
  };

  const handleDelete = () => {
    deleteCategory(selectedCategory?.id ?? "");
    setIsDeleteModalVisible(false);
  };

  const formattedData = data?.categories?.map((item: any) => ({
    key: item._id,
    id: item._id,
    category: item.categoryName,
    parent: item.parentCategory?.categoryName ?? "Không có",
    parentId: item.parentCategory?._id ?? null,
    status: item.status ? "completed" : "pending",
  }));

  return (
    <div>
      <div className="flex row gap-6 items-start">
        <Card className="w-[15%] h-38">
          <div className=" justify-center gap-4">
            <CrownOutlined className="text-2xl flex items-center justify-center rounded-md h-12 w-12 bg-red-200" />
            <div>
              <Title level={4} className="!mb-0">
                {data?.categories?.length || 0}
              </Title>
              <Typography>Tổng danh mục</Typography>
            </div>
          </div>
        </Card>
        <Card
          className="w-[15%] h-38 flex flex-col justify-center gap-4 items-center cursor-pointer"
          onClick={() => {
            form.resetFields();
            setIsEditing(false);
            setIsModalVisible(true);
          }}
        >
          <PlusCircleOutlined className="text-4xl !text-green-500 " />
        </Card>
      </div>

      <Table
        className="mt-4 w-full"
        columns={columns}
        dataSource={formattedData}
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={isEditing ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleModalSubmit}
        okText={isEditing ? "Cập nhật" : "Tạo"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên danh mục"
            name="category"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Danh mục cha" name="parent">
            <Select allowClear placeholder="Chọn danh mục cha (nếu có)">
              {data?.categories
                ?.filter((cat: any) => cat._id !== selectedCategory?.id)
                .map((cat: any) => (
                  <Option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item label="Trạng thái" name="status">
            <Select>
              <Option value="completed">Hoạt động</Option>
              <Option value="pending">Chờ duyệt</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Xác nhận xóa"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleDelete}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>
          Bạn có chắc chắn muốn xóa danh mục{" "}
          <strong>{selectedCategory?.category}</strong> không?
        </p>
      </Modal>
    </div>
  );
}
