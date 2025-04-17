"use client";

import { useCategories, useCreateCategory } from "@/hooks/category";
import {
  CrownOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  InputRef,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { useRef, useState } from "react";
const { Title } = Typography;
const { Option } = Select;

interface DataType {
  key: string;
  id: string;
  category: string;
  parent: string;
  status: string;
}

type DataIndex = keyof DataType;

export default function Category() {
  const { data, isLoading } = useCategories();

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DataType | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnsType<DataType>[number] => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

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

  const formattedData = data?.categories?.map((item: any) => ({
    key: item._id,
    id: item._id,
    category: item.categoryName,
    parent: item.parentCategory?.categoryName || "Không có",
    status: item.status ? "completed" : "pending",
  }));

  const handleModalSubmit = () => {
    form.validateFields().then((values) => {
      const payload = {
        categoryName: values.category,
        status: values.status === "completed",
        parentCategory: values.parent || null,
      };

      if (isEditing) {
        // TODO: call update mutation
        console.log("Update category", payload);
      } else {
        createCategory(payload, {
          onSuccess: () => {
            console.log("Create category success");
            setIsModalVisible(false);
            form.resetFields();
          },
        });
      }

      setIsEditing(false);
    });
  };
  const handleDelete = () => {
    // TODO: call delete mutation with selectedCategory?.id
    console.log("Delete category", selectedCategory?.id);
    setIsDeleteModalVisible(false);
  };

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

      {/* Modal Create / Edit */}
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
