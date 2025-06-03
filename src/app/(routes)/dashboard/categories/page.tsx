'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Form, Input, Select, Typography, Tag, Switch } from 'antd';
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
  PageHeader,
  StatisticItem,
  StatisticsCards,
  useModal,
} from '../products/component/custom';

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
  level: number;
  hasChildren: boolean;
  childrenCount: number;
  createdAt?: string;
}

const CategoryManagement = () => {
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(
    null,
  );

  const { data: categoriesRes, isLoading } = useCategories();
  const { mutate: deleteCategory, isLoading: isDeleting } = useDeleteCategory();
  const { mutate: createCategory, isLoading: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isLoading: isUpdating } = useUpdateCategory();

  const {
    isVisible: isModalVisible,
    isEditing,
    openModal,
    closeModal,
  } = useModal();

  // Hàm sắp xếp danh mục theo cấu trúc cây
  const buildCategoryTree = useCallback((categories: any[]) => {
    if (!categories || !Array.isArray(categories)) return [];

    // Tạo map để dễ tìm kiếm
    const categoryMap = new Map();
    const rootCategories: any[] = [];

    // Đầu tiên, tạo tất cả các node
    categories.forEach((category) => {
      const transformedCategory = {
        id: category._id || '',
        categoryName: category.categoryName || 'Không có tên',
        parentCategory: category.parentCategory,
        parentName: category.parentCategory?.categoryName || 'Danh mục gốc',
        parentId: category.parentCategory?._id || null,
        status: category.status === true,
        level: 0, // Sẽ được tính lại
        hasChildren: false, // Sẽ được tính lại
        childrenCount: 0, // Sẽ được tính lại
        createdAt: category.createdAt || new Date().toISOString(),
        children: [],
        originalData: category,
      };
      categoryMap.set(transformedCategory.id, transformedCategory);
    });

    // Xây dựng cấu trúc cây và tính level
    categoryMap.forEach((category) => {
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children.push(category);
          category.level = parent.level + 1;
        } else {
          // Nếu không tìm thấy parent, coi như root
          rootCategories.push(category);
        }
      } else {
        rootCategories.push(category);
      }
    });

    // Tính toán hasChildren và childrenCount
    const calculateChildrenInfo = (category: any) => {
      category.childrenCount = category.children.length;
      category.hasChildren = category.childrenCount > 0;

      // Đệ quy tính cho các con
      category.children.forEach(calculateChildrenInfo);
    };

    rootCategories.forEach(calculateChildrenInfo);

    // Flatten lại thành mảng phẳng theo thứ tự cây
    const flattenCategories = (categories: any[], result: any[] = []) => {
      categories.forEach((category) => {
        result.push(category);
        if (category.children.length > 0) {
          flattenCategories(category.children, result);
        }
      });
      return result;
    };

    return flattenCategories(rootCategories);
  }, []);

  const transformedCategories = useMemo(() => {
    if (
      !categoriesRes?.categories ||
      !Array.isArray(categoriesRes.categories)
    ) {
      return [];
    }

    return buildCategoryTree(categoriesRes.categories);
  }, [categoriesRes, buildCategoryTree]);

  // Statistics data
  const statisticsData: StatisticItem[] = useMemo(() => {
    const activeCategories = transformedCategories.filter((cat) => cat.status);
    const rootCategories = transformedCategories.filter((cat) => !cat.parentId);
    const maxLevel = Math.max(
      ...transformedCategories.map((cat) => cat.level),
      0,
    );

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
        title: 'Cấp độ tối đa',
        value: maxLevel + 1,
        prefix: <ClockCircleOutlined />,
        valueStyle: { color: '#fa8c16' },
      },
    ];
  }, [transformedCategories]);

  // Table columns
  const columns = [
    {
      title: 'Tên danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 250,
      render: (text: string, record: CategoryData) => {
        // Tạo indentation dựa trên level
        const indent = '    '.repeat(record.level); // 4 spaces per level
        const treeSymbol = record.level > 0 ? '└─ ' : '';

        return (
          <div>
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: 'monospace', color: '#999' }}>
                {indent}
                {treeSymbol}
              </span>
              <Text strong={record.level === 0}>{text}</Text>
              {record.hasChildren && (
                <Tag color="blue" size="small">
                  {record.childrenCount}
                </Tag>
              )}
            </div>
            <div
              style={{ paddingLeft: indent.length * 8 + treeSymbol.length * 8 }}
            >
              <Text type="secondary" className="text-xs">
                ID: {record.id}
              </Text>
            </div>
          </div>
        );
      },
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
      title: 'Cấp độ',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level: number) => <Tag color="purple">Cấp {level + 1}</Tag>,
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
      width: 120,
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
            confirmDescription: record.hasChildren
              ? `Danh mục này có ${record.childrenCount} danh mục con. Xóa sẽ ảnh hưởng đến các danh mục con.`
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

      const payload = {
        categoryName: values.categoryName,
        status: values.status,
        parentCategory: values.parentCategory || null,
      };

      if (isEditing && selectedCategory) {
        await updateCategory({
          id: selectedCategory.id,
          data: payload,
        });
      } else {
        await createCategory(payload);
      }

      closeModal();
      form.resetFields();
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  // Available parent categories (exclude self and children when editing)
  const availableParentCategories = useMemo(() => {
    if (!isEditing || !selectedCategory) {
      return transformedCategories;
    }

    // Exclude the current category and all its children
    const getChildrenIds = (parentId: string): string[] => {
      const children = transformedCategories
        .filter((cat) => cat.parentId === parentId)
        .map((cat) => cat.id);

      const allChildren = [...children];
      children.forEach((childId) => {
        allChildren.push(...getChildrenIds(childId));
      });

      return allChildren;
    };

    const excludeIds = [
      selectedCategory.id,
      ...getChildrenIds(selectedCategory.id),
    ];
    return transformedCategories.filter((cat) => !excludeIds.includes(cat.id));
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
              {availableParentCategories
                .filter((cat) => cat.id !== selectedCategory?.id)
                .map((cat) => {
                  const indent = '    '.repeat(cat.level);
                  const treeSymbol = cat.level > 0 ? '└─ ' : '';
                  return (
                    <Option key={cat.id} value={cat.id}>
                      <span style={{ fontFamily: 'monospace' }}>
                        {indent}
                        {treeSymbol}
                      </span>
                      {cat.categoryName}
                    </Option>
                  );
                })}
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

          {isEditing && selectedCategory && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <Text type="secondary" className="text-sm">
                <strong>Thông tin hiện tại:</strong>
                <br />
                Cấp độ: {selectedCategory.level + 1}
                <br />
                Danh mục con: {selectedCategory.childrenCount}
                <br />
                {selectedCategory.hasChildren && (
                  <span className="text-orange-600">
                    ⚠️ Danh mục này có danh mục con. Thay đổi có thể ảnh hưởng
                    đến cấu trúc cây.
                  </span>
                )}
              </Text>
            </div>
          )}
        </Form>
      </CustomModal>
    </div>
  );
};

export default CategoryManagement;
