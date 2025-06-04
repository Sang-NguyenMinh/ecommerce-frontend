'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  Form,
  Input,
  Select,
  Typography,
  Tag,
  Switch,
  Image,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  AppstoreOutlined,
  NodeIndexOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/hooks/category';
import {
  ActionButton,
  ActionButtons,
  CustomModal,
  CustomTable,
  ImageUpload,
  PageHeader,
  StatisticItem,
  StatisticsCards,
  useModal,
} from '../products/component/custom';
import { SP } from 'next/dist/shared/lib/utils';

const { Text } = Typography;
const { Option } = Select;

interface CategoryData {
  id: string;
  categoryName: string;
  parentCategory: {
    _id: string;
    categoryName: string;
  } | null;
  status: boolean;
  createdAt?: string;
  thumbnail?: string;
}

const CategoryManagement = () => {
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(
    null,
  );

  const [fileList, setFileList] = useState([]);

  const { data: categoriesRes, isLoading } = useCategories();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  console.log('categoriesRes', categoriesRes);

  const {
    isVisible: isModalVisible,
    isEditing,
    openModal,
    closeModal,
  } = useModal();

  const transformedCategories = useMemo(() => {
    if (!categoriesRes?.data || !Array.isArray(categoriesRes.data)) {
      return [];
    }

    return categoriesRes.data.map((category: any) => ({
      id: category._id || '',
      thumbnail: category.thumbnail || '',
      categoryName: category.categoryName || 'Không có tên',
      parentCategory: category.parentCategory,
      parentName: category.parentCategory?.categoryName || 'Danh mục gốc',
      parentId: category.parentCategory?._id || null,
      status: category.status === true,
      createdAt: category.createdAt || new Date().toISOString(),
      originalData: category,
    }));
  }, [categoriesRes]);

  // Statistics data
  const statisticsData: StatisticItem[] = useMemo(() => {
    const activeCategories = transformedCategories.filter((cat) => cat.status);
    const rootCategories = transformedCategories.filter((cat) => !cat.parentId);
    const childCategories = transformedCategories.filter((cat) => cat.parentId);

    return [
      {
        title: 'Tổng danh mục',
        value: transformedCategories.length,
        prefix: <AppstoreOutlined />,
        valueStyle: { color: '#1890ff' },
      },
      {
        title: 'Đang hoạt động',
        value: activeCategories.length,
        prefix: <CheckCircleOutlined />,
        valueStyle: { color: '#52c41a' },
      },
      {
        title: 'Danh mục gốc',
        value: rootCategories.length,
        prefix: <NodeIndexOutlined />,
        valueStyle: { color: '#722ed1' },
      },
      {
        title: 'Danh mục con',
        value: childCategories.length,
        prefix: <ClockCircleOutlined />,
        valueStyle: { color: '#fa8c16' },
      },
    ];
  }, [transformedCategories]);

  // Table columns
  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 80,
      render: (thumbnail: any) => (
        <Image
          width={60}
          height={60}
          src={thumbnail}
          className="rounded-lg object-cover"
          alt="Product Thumbnail"
        />
      ),
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 250,
      render: (text: string, record: CategoryData) => (
        <div>
          <Text strong>{text}</Text>
          <div>
            <Text type="secondary" className="text-xs">
              ID: {record.id}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Danh mục cha',
      dataIndex: 'parentName',
      key: 'parentName',
      width: 200,
      render: (text: string, record: CategoryData) => (
        <Tag color={record.parentId ? 'blue' : 'green'}>{text}</Tag>
      ),
    },
    {
      title: 'Loại danh mục',
      key: 'categoryType',
      width: 120,
      render: (_, record: CategoryData) => (
        <Tag color={record.parentId ? 'orange' : 'purple'}>
          {record.parentId ? 'Danh mục con' : 'Danh mục gốc'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: boolean) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? 'Hoạt động' : 'Tạm dừng'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => (
        <Text type="secondary">
          {new Date(date).toLocaleDateString('vi-VN')}
        </Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_: any, record: CategoryData) => {
        // Check if this category has children
        const hasChildren = transformedCategories.some(
          (cat) => cat.parentId === record.id,
        );

        const actions: ActionButton[] = [
          {
            type: 'edit',
            tooltip: 'Chỉnh sửa',
            onClick: () => handleEdit(record),
          },
          {
            type: 'delete',
            tooltip: 'Xóa',
            confirmTitle: 'Bạn có chắc chắn muốn xóa danh mục này?',
            confirmDescription: hasChildren
              ? 'Danh mục này có danh mục con. Xóa sẽ ảnh hưởng đến các danh mục con.'
              : undefined,
            onClick: () => deleteCategory(record.id),
          },
        ];
        return <ActionButtons actions={actions} />;
      },
    },
  ];

  // Event handlers
  const handleEdit = useCallback(
    (category: CategoryData) => {
      setSelectedCategory(category);
      openModal(category, true);
      form.setFieldsValue({
        categoryName: category.categoryName,
        parentCategory: category.parentId,
        status: category.status,
      });

      setFileList([
        {
          uid: `${category.id}-thumbnail`,
          name: `image-${category.id}.jpg`,
          status: 'done',
          url: category.thumbnail,
        },
      ]);
    },
    [form, openModal],
  );

  const handleAddNew = useCallback(() => {
    openModal();
    form.resetFields();
    setSelectedCategory(null);
  }, [form, openModal]);

  const handleSaveCategory = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append('categoryName', values.categoryName || '');
      formData.append('status', values.status || true);
      if (values.parentCategory)
        formData.append('parentCategory', values.parentCategory);

      // Phân loại files
      const newFiles = [];
      const existingUrls = [];

      fileList.forEach((file) => {
        if (file?.originFileObj) {
          newFiles.push(file.originFileObj);
        } else if (file.url && !file.originFileObj) {
          existingUrls.push(file.url);
        }
      });

      newFiles.forEach((file) => {
        formData.append('thumbnail', file);
      });

      // QUAN TRỌNG: Gửi existingThumbnails dưới dạng JSON string
      if (existingUrls.length > 0) {
        formData.append('existingThumbnail', JSON.stringify(existingUrls));
      }

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      if (isEditing) {
        await updateCategory({
          id: selectedCategory.id,
          data: formData,
        });
      } else {
        await createCategory(formData);
      }

      closeModal();
      form.resetFields();
      setSelectedCategory(null);
      setFileList([]);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  // Available parent categories (exclude self when editing)
  const availableParentCategories = useMemo(() => {
    if (!isEditing || !selectedCategory) {
      return transformedCategories;
    }

    // Exclude the current category to prevent circular reference
    return transformedCategories.filter(
      (cat) => cat.id !== selectedCategory.id,
    );
  }, [transformedCategories, isEditing, selectedCategory]);

  return (
    <div className="p-6">
      <PageHeader
        title="Quản lý danh mục"
        actionButton={{
          text: 'Thêm danh mục mới',
          icon: <PlusOutlined />,
          onClick: handleAddNew,
        }}
      />

      <StatisticsCards statistics={statisticsData} />

      <CustomTable
        columns={columns}
        dataSource={transformedCategories}
        loading={isLoading}
        rowKey="id"
        paginationConfig={{
          pageSize: 15,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: true,
        }}
      />

      <CustomModal
        title={isEditing ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
        open={isModalVisible}
        onCancel={closeModal}
        onSave={handleSaveCategory}
        saveText={isEditing ? 'Cập nhật' : 'Tạo danh mục'}
        loading={isCreating || isUpdating}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên danh mục"
            name="categoryName"
            rules={[
              { required: true, message: 'Vui lòng nhập tên danh mục' },
              { min: 2, message: 'Tên danh mục phải có ít nhất 2 ký tự' },
              { max: 100, message: 'Tên danh mục không được quá 100 ký tự' },
            ]}
          >
            <Input size="large" placeholder="Nhập tên danh mục" />
          </Form.Item>

          <Form.Item
            label="Danh mục cha"
            name="parentCategory"
            tooltip="Để trống nếu đây là danh mục gốc"
          >
            <Select
              size="large"
              placeholder="Chọn danh mục cha (tùy chọn)"
              allowClear
            >
              {availableParentCategories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            valuePropName="checked"
            tooltip="Danh mục không hoạt động sẽ không hiển thị trên trang web"
          >
            <Switch
              checkedChildren="Hoạt động"
              unCheckedChildren="Tạm dừng"
              defaultChecked
            />
          </Form.Item>

          <ImageUpload
            value={fileList}
            onChange={setFileList}
            maxCount={1}
            label="Hình ảnh danh mục"
            required
          />

          {isEditing && selectedCategory && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <Text type="secondary" className="text-sm">
                <strong>Thông tin hiện tại:</strong>
                <br />
                Loại:{' '}
                {selectedCategory.parentId ? 'Danh mục con' : 'Danh mục gốc'}
                <br />
                Danh mục cha: {selectedCategory.parentName}
              </Text>
            </div>
          )}
        </Form>
      </CustomModal>
    </div>
  );
};

export default CategoryManagement;
