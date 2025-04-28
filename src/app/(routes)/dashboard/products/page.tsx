"use client";

import { useCategories } from "@/hooks/category";
import {
  CrownOutlined,
  PlusCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Card,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Typography,
  Upload,
  UploadFile,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { useColumnSearch } from "@/hooks/utils/useColumnSearch";
import { useState } from "react";
import {
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from "@/hooks/product";
const { Title } = Typography;
import RichTextEditor from "@/components/rich-text-editor";
import { Storage } from "@/libs/storage";
interface DataType {
  key: string;
  id: string;
  productName: string;
  categoryName: string;
  thumbnails: string[];
  content?: string;
  category?: string;
}

export default function Category() {
  const { data: productRes, isLoading } = useProducts();
  const { data: categoriesRes } = useCategories();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const { getColumnSearchProps } = useColumnSearch();
  const [selectedProduct, setSelectedProduct] = useState<DataType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  const isMutating = isCreating || isUpdating;

  const [editorContent, setEditorContent] = useState("");
  console.log(Storage.Cookie.get("token"));
  const columns: ColumnsType<DataType> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "15%",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      width: "25%",
      ...getColumnSearchProps("productName"),
    },
    {
      title: "Danh mục",
      dataIndex: "categoryName",
      key: "categoryName",
      width: "20%",
      ...getColumnSearchProps("categoryName"),
    },
    {
      title: "Ảnh mẫu",
      dataIndex: "thumbnail",
      key: "thumbnails",
      width: "15%",
      render: (_, record) => (
        <img
          src={record.thumbnails?.[0]}
          alt="thumbnail"
          className="w-20 h-20 object-cover rounded"
        />
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
              setSelectedProduct(record);
              form.setFieldsValue({ ...record, category: record.category });
              if (record.thumbnails) {
                setFileList(
                  record.thumbnails.map((url, index) => ({
                    uid: `${index}`,
                    name: `thumbnail-${index}.png`,
                    status: "done",
                    url,
                  }))
                );
              }

              if (record && record.content) {
                setEditorContent(record.content);
              }

              setIsEditing(true);
              setIsModalVisible(true);
            }}
          >
            Edit
          </a>
          <a
            onClick={() => {
              setSelectedProduct(record);
              setIsDeleteModalVisible(true);
            }}
          >
            Delete
          </a>
        </Space>
      ),
    },
  ];

  const handleModalSubmit = async () => {
    form.validateFields().then((values) => {
      const formData = new FormData();
      formData.append("productName", values.productName || "");
      formData.append("categoryId", values.category || "");
      formData.append("content", editorContent || "");

      fileList.forEach((file: any) => {
        formData.append("thumbnails", file.originFileObj);
      });

      console.log("FormData entries:");
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const onSuccess = () => {
        console.log(
          isEditing ? "Update product success" : "Create product success"
        );
        setIsModalVisible(false);
        form.resetFields();
        setFileList([]);
        setIsEditing(false);
      };

      if (isEditing) {
        updateProduct(
          { id: selectedProduct?.id ?? "", data: formData },
          { onSuccess }
        );
      } else {
        createProduct(formData, { onSuccess });
      }
    });
  };
  const handleDelete = () => {
    deleteProduct(selectedProduct?.id ?? "");
    setIsDeleteModalVisible(false);
  };

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const formattedData = productRes?.products?.map((item: any) => ({
    key: item._id,
    id: item._id,
    productName: item.productName,
    categoryName: item.categoryId?.categoryName || "Không có",
    content: item.content,
    thumbnails: item.thumbnails,
    category: item.categoryId?._id,
  }));

  return (
    <div>
      <div className="flex row gap-6 items-start">
        <Card className="w-[15%] h-38">
          <div className=" justify-center gap-4">
            <CrownOutlined className="text-2xl flex items-center justify-center rounded-md h-12 w-12 bg-red-200" />
            <div>
              <Title level={4} className="!mb-0">
                {productRes?.products?.length || 0}
              </Title>
              <Typography>Tổng Sản phẩm</Typography>
            </div>
          </div>
        </Card>
        <Card
          className="w-[15%] h-38 flex flex-col justify-center gap-4 items-center cursor-pointer"
          onClick={() => {
            form.resetFields();
            setFileList([]);
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
        confirmLoading={isMutating}
        className="!w-[60%] !h-[60%]"
        title={isEditing ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm mới"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleModalSubmit}
        okText={isEditing ? "Cập nhật" : "Tạo"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên sản phẩm"
            name="productName"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="category"
            rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
          >
            <Select size="large" allowClear placeholder="Chọn danh mục">
              {categoriesRes?.categories?.map((cat: any) => (
                <Option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Nội dung chi tiết" name="content">
            <RichTextEditor
              content={editorContent}
              onChange={setEditorContent}
            />
          </Form.Item>

          <Form.Item
            label="Thumbnail"
            required
            rules={[{ required: true, message: "Vui lòng tải ảnh sản phẩm" }]}
          >
            <Upload
              fileList={fileList}
              onChange={({ fileList: newList }) => {
                setFileList(newList);
                console.log(newList);
              }}
              listType="picture"
              beforeUpload={() => false}
              maxCount={5}
              multiple
            >
              <UploadOutlined /> Chọn ảnh
            </Upload>
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
          Bạn có chắc chắn muốn xóa sản phẩm{" "}
          <strong>{selectedProduct?.productName}</strong> không?
        </p>
      </Modal>
    </div>
  );
}
