'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  Form,
  Input,
  Select,
  Typography,
  Tag,
  Switch,
  Button,
  Space,
  Card,
  Row,
  Col,
  Modal,
  Tooltip,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  SettingOutlined,
  TagsOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  FolderOutlined,
  ArrowRightOutlined,
  TagOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from '@ant-design/icons';

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
import {
  useCreateVariation,
  useDeleteVariation,
  useUpdateVariation,
  useVariations,
} from '@/hooks/variation';
import {
  useCreateVariationOption,
  useDeleteVariationOption,
  useVariationOptions,
} from '@/hooks/variation-option';
import { useCategories } from '@/hooks/category';
import {
  useCategoryVariations,
  useCreateCategoryVariation,
  useDeleteCategoryVariation,
  useUpdateCategoryVariation,
} from '@/hooks/category-variation';

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface VariationData {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  variationOptionCount: number;
}

const VariationManagement = () => {
  const [form] = Form.useForm();
  const [optionForm] = Form.useForm();
  const [categoryVariationForm] = Form.useForm();

  const { data: categoryRes, isLoading: isCategoryLoading } = useCategories();

  const { data: variationRes, isLoading: isVariationLoading } = useVariations();
  const { mutate: createVariation, isPending: isCreating } =
    useCreateVariation();
  const { mutate: updateVariation, isPending: isUpdating } =
    useUpdateVariation();
  const { mutate: deleteVariation, isPending: isDeleting } =
    useDeleteVariation();
  const [selectedVariation, setSelectedVariation] =
    useState<VariationData | null>(null);
  const { data: variationOptionRes, isLoading: isVariationOptionLoading } =
    useVariationOptions({ variationId: selectedVariation?._id || null });
  const { mutate: createVariationOption, isPending: isCreatingOption } =
    useCreateVariationOption();

  const { mutate: deleteVariationOption, isPending: isDeletingOption } =
    useDeleteVariationOption();

  const { data: categoryVariationRes, isLoading: isCategoryVariationLoading } =
    useCategoryVariations();
  const {
    mutate: createCategoryVariation,
    isPending: isCreatingCategoryVariation,
  } = useCreateCategoryVariation();

  const {
    mutate: updateCategoryVariation,
    isPending: isUpdatingCategoryVariation,
  } = useUpdateCategoryVariation();

  const {
    mutate: deleteCategoryVariation,
    isPending: isDeletingCategoryVariation,
  } = useDeleteCategoryVariation();

  console.log('Variation Data:', variationOptionRes);

  const [editingCategoryVariation, setEditingCategoryVariation] =
    useState<any>(null);

  const [selectedVariationForOptions, setSelectedVariationForOptions] =
    useState<string | null>(null);

  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);
  const [isCategoryVariationModalVisible, setIsCategoryVariationModalVisible] =
    useState(false);

  const {
    isVisible: isModalVisible,
    isEditing,
    openModal,
    closeModal,
  } = useModal();

  const handleEditCategoryVariation = (item: any) => {
    setEditingCategoryVariation(item);
    categoryVariationForm.setFieldsValue({
      categoryId: item.categoryId._id,
      variationId: item.variationId._id,
      isRequired: item.isRequired,
    });
  };

  // Statistics data
  const statisticsData: StatisticItem[] = useMemo(() => {
    const activeVariations = variationRes?.data.filter((v) => v.isActive);
    const totalOptions = variationRes?.data.reduce(
      (sum, v) => sum + v.variationOptionCount,
      0,
    );

    return [
      {
        title: 'Tổng biến thể',
        value: variationRes?.total,
        prefix: <TagsOutlined />,
        valueStyle: { color: '#1890ff' },
      },
      {
        title: 'Đang hoạt động',
        value: activeVariations?.length,
        prefix: <CheckCircleOutlined />,
        valueStyle: { color: '#52c41a' },
      },
      {
        title: 'Tổng tùy chọn',
        value: totalOptions,
        prefix: <SettingOutlined />,
        valueStyle: { color: '#722ed1' },
      },
      {
        title: 'Tạm dừng',
        value: variationRes?.total - activeVariations?.length,
        prefix: <ClockCircleOutlined />,
        valueStyle: { color: '#fa8c16' },
      },
    ];
  }, [variationRes]);

  const variationColumns = [
    {
      title: 'Tên biến thể',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: VariationData) => (
        <div>
          <Text strong>{text}</Text>
          <div>
            <Text type="secondary" className="text-xs">
              ID: {record._id}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 250,
      render: (text: string) => (
        <Text type="secondary" className="text-sm">
          {text || 'Không có mô tả'}
        </Text>
      ),
    },
    {
      title: 'Số tùy chọn',
      dataIndex: 'variationOptionCount',
      key: 'variationOptionCount',
      width: 120,
      render: (_, record: VariationData) => (
        <Space>
          <Tag color="blue">{record.variationOptionCount} tùy chọn</Tag>
          <Button
            type="link"
            size="small"
            className="text-red-900"
            onClick={() => handleManageOptions(record)}
            icon={<SettingOutlined />}
          >
            Quản lý
          </Button>
        </Space>
      ),
    },
    {
      title: 'Danh mục sử dụng',
      dataIndex: 'categoriesCount',
      key: 'categoriesCount',
      width: 150,
      render: (count: number) => <Tag color="green">{count} danh mục</Tag>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Tạm dừng'}
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
      render: (_: any, record: VariationData) => {
        const actions: ActionButton[] = [
          {
            type: 'edit',
            tooltip: 'Chỉnh sửa',
            onClick: () => handleEditVariation(record),
          },
          {
            type: 'delete',
            tooltip: 'Xóa',
            confirmTitle: 'Bạn có chắc chắn muốn xóa biến thể này?',
            confirmDescription:
              record.categoriesCount > 0
                ? 'Biến thể này đang được sử dụng bởi một số danh mục. Xóa sẽ ảnh hưởng đến các sản phẩm liên quan.'
                : undefined,
            onClick: () => deleteVariation(record._id),
          },
        ];
        return <ActionButtons actions={actions} />;
      },
    },
  ];

  const handleEditVariation = useCallback(
    (variation: any) => {
      setSelectedVariation(variation);
      openModal(variation, true);
      form.setFieldsValue({
        name: variation.name,
        description: variation.description,
        isActive: variation.isActive,
      });
    },
    [form, openModal],
  );

  const handleAddNewVariation = useCallback(() => {
    openModal();
    form.resetFields();
    setSelectedVariation(null);
  }, [form, openModal]);

  const handleSavingVariation = async () => {
    try {
      const values = await form.validateFields();

      if (isEditing && selectedVariation) {
        await updateVariation({
          id: selectedVariation._id,
          data: {
            name: values.name,
            description: values.description,
            isActive: values.isActive,
          },
        });
      } else {
        console.log('Creating new variation with values:', values);
        const newVariation: any = {
          name: values.name,
          description: values.description,
          isActive: values.isActive,
        };
        await createVariation(newVariation);
      }

      closeModal();
      form.resetFields();
      setSelectedVariation(null);
    } catch (error) {
      console.error('Error saving variation:', error);
    }
  };

  const handleManageOptions = (variation: any) => {
    setSelectedVariation(variation);
    setIsOptionsModalVisible(true);
  };

  const handleAddOption = async () => {
    try {
      const values = await optionForm.validateFields();

      if (!selectedVariation) return;

      const newOption: any = {
        name: values.name,
        value: values.value,
        variationId: selectedVariation._id,
      };

      await createVariationOption(newOption);

      optionForm.resetFields();
    } catch (error) {
      console.error('Error adding option:', error);
    }
  };

  const handleSavingCategoryVariation = async () => {
    try {
      const values = await categoryVariationForm.validateFields();

      const categoryVariation: any = {
        categoryId: values.categoryId,
        variationId: values.variationId,
        isRequired: values.isRequired,
      };

      console.log('id', editingCategoryVariation._id);

      if (editingCategoryVariation) {
        await updateCategoryVariation({
          id: editingCategoryVariation._id,
          data: categoryVariation,
        });
        setEditingCategoryVariation(null);
      } else await createCategoryVariation(categoryVariation);

      categoryVariationForm.resetFields();
    } catch (error) {
      console.error('Error saving category variation:', error);
    }
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Quản lý biến thể sản phẩm"
        actionButton={{
          text: 'Thêm biến thể mới',
          icon: <PlusOutlined />,
          onClick: handleAddNewVariation,
        }}
        extra={
          <Space>
            <Button
              type="default"
              icon={<SettingOutlined />}
              onClick={() => setIsCategoryVariationModalVisible(true)}
            >
              Cấu hình danh mục
            </Button>
          </Space>
        }
      />

      <StatisticsCards statistics={statisticsData} />

      <Card>
        <CustomTable
          columns={variationColumns}
          dataSource={variationRes?.data}
          loading={false}
          rowKey="id"
          paginationConfig={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: true,
          }}
        />
      </Card>

      {/* Variation Modal */}
      <CustomModal
        title={isEditing ? 'Chỉnh sửa biến thể' : 'Thêm biến thể mới'}
        open={isModalVisible}
        onCancel={closeModal}
        onSave={handleSavingVariation}
        saveText={isEditing ? 'Cập nhật' : 'Tạo biến thể'}
        loading={false}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên biến thể"
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập tên biến thể' },
              { min: 2, message: 'Tên biến thể phải có ít nhất 2 ký tự' },
              { max: 50, message: 'Tên biến thể không được quá 50 ký tự' },
            ]}
          >
            <Input
              size="large"
              placeholder="Ví dụ: Màu sắc, Kích thước, Chất liệu..."
            />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ max: 200, message: 'Mô tả không được quá 200 ký tự' }]}
          >
            <TextArea
              rows={3}
              placeholder="Mô tả chi tiết về biến thể này..."
            />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="isActive"
            valuePropName="checked"
            tooltip="Biến thể không hoạt động sẽ không thể sử dụng khi tạo sản phẩm"
          >
            <Switch
              checkedChildren="Hoạt động"
              unCheckedChildren="Tạm dừng"
              defaultChecked
            />
          </Form.Item>

          <div className="bg-blue-50 p-4 rounded-lg">
            <Space align="start">
              <InfoCircleOutlined className="text-blue-500 mt-1" />
              <div>
                <Text className="text-sm text-blue-700">
                  <strong>Lưu ý:</strong> Sau khi tạo biến thể, bạn có thể thêm
                  các tùy chọn cụ thể (như Đỏ, Xanh cho biến thể Màu sắc) và cấu
                  hình cho từng danh mục sản phẩm.
                </Text>
              </div>
            </Space>
          </div>
        </Form>
      </CustomModal>

      <Modal
        title={`Quản lý tùy chọn - ${selectedVariation?.name}`}
        open={isOptionsModalVisible}
        onCancel={() => setIsOptionsModalVisible(false)}
        width={800}
        footer={null}
      >
        <div className="space-y-4">
          <Card title="Thêm tùy chọn mới" size="small">
            <Form form={optionForm} layout="inline" onFinish={handleAddOption}>
              <Form.Item
                label="Tên"
                labelAlign="right"
                name="name"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên' },
                  { max: 50, message: 'Tên không được quá 50 ký tự' },
                ]}
              >
                <Input placeholder="Ví dụ: Đỏ, Size M, Cotton..." />
              </Form.Item>

              <Form.Item
                label="Giá trị "
                name="value"
                rules={[
                  { message: 'Vui lòng nhập giá trị' },
                  { max: 50, message: 'Giá trị không được quá 50 ký tự' },
                ]}
              >
                <Input placeholder="" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<PlusOutlined />}
                >
                  Thêm
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Card title="Danh sách tùy chọn hiện có" size="small">
            {variationOptionRes?.total === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <SettingOutlined className="text-4xl mb-2" />
                <div>Chưa có tùy chọn nào</div>
                <Text type="secondary">Thêm tùy chọn đầu tiên ở trên</Text>
              </div>
            ) : (
              <div className="space-y-2">
                {variationOptionRes?.data.map((option: any) => (
                  <div
                    key={option._id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="mb-1">
                        <Tooltip title={option.name} placement="topLeft">
                          <Text strong className="text-base">
                            {option.name}
                          </Text>
                        </Tooltip>
                      </div>
                      {option.value && (
                        <div className="mb-1">
                          <Text type="secondary" className="text-sm">
                            Giá trị: <Text code>{option.value}</Text>
                          </Text>
                        </div>
                      )}
                      <div>
                        <Text type="secondary" className="text-xs">
                          ID: {option._id}
                        </Text>
                      </div>
                    </div>
                    <Space>
                      <ActionButtons
                        actions={[
                          {
                            type: 'delete',
                            tooltip: 'Xóa',
                            confirmTitle:
                              'Bạn có chắc chắn muốn xóa tùy chọn này?',

                            onClick: () => deleteVariationOption(option._id),
                          },
                        ]}
                      />
                    </Space>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </Modal>

      {/* Category Variation Configuration Modal */}
      <Modal
        title="Cấu hình biến thể cho danh mục"
        open={isCategoryVariationModalVisible}
        onCancel={() => {
          setIsCategoryVariationModalVisible(false);
          setEditingCategoryVariation(null);
          categoryVariationForm.resetFields();
        }}
        width={'50%'}
        footer={null}
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <Space align="start">
              <InfoCircleOutlined />
              <div>
                <Text className="text-sm ">
                  <strong>Hướng dẫn:</strong> Cấu hình các biến thể cho từng
                  danh mục sản phẩm. Khi tạo sản phẩm thuộc danh mục này, hệ
                  thống sẽ yêu cầu nhập thông tin cho các biến thể đã cấu hình.
                </Text>
              </div>
            </Space>
          </div>

          <Card
            title={
              <Space>
                {editingCategoryVariation ? <EditOutlined /> : <PlusOutlined />}
                {editingCategoryVariation
                  ? 'Cập nhật cấu hình'
                  : 'Thêm cấu hình mới'}
              </Space>
            }
            size="small"
          >
            <Form
              form={categoryVariationForm}
              layout="vertical"
              onFinish={handleSavingCategoryVariation}
            >
              <Row gutter={16}>
                <Col span={7}>
                  <Form.Item
                    label="Danh mục"
                    name="categoryId"
                    rules={[
                      { required: true, message: 'Vui lòng chọn danh mục' },
                    ]}
                  >
                    <Select placeholder="Chọn danh mục" showSearch>
                      {categoryRes?.data.map((cat: any) => (
                        <Option key={cat._id} value={cat._id}>
                          {cat.categoryName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item
                    label="Biến thể"
                    name="variationId"
                    rules={[
                      { required: true, message: 'Vui lòng chọn biến thể' },
                    ]}
                  >
                    <Select placeholder="Chọn biến thể" showSearch>
                      {variationRes?.data
                        .filter((v) => v.isActive)
                        .map((variation: any) => (
                          <Option key={variation._id} value={variation._id}>
                            {variation.name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    label="Bắt buộc"
                    name="isRequired"
                    valuePropName="checked"
                  >
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label=" ">
                    <Space>
                      <Button
                        type="primary"
                        htmlType="submit"
                        icon={
                          editingCategoryVariation ? (
                            <SaveOutlined />
                          ) : (
                            <PlusOutlined />
                          )
                        }
                      >
                        {editingCategoryVariation ? 'Cập nhật' : 'Thêm'}
                      </Button>
                      {editingCategoryVariation && (
                        <Button
                          onClick={() => {
                            setEditingCategoryVariation(null);
                            categoryVariationForm.resetFields();
                          }}
                          icon={<CloseOutlined />}
                        >
                          Hủy
                        </Button>
                      )}
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>

          <Card
            title={
              <Space>
                <SettingOutlined />
                <Text>Cấu hình hiện có</Text>
                {categoryVariationRes?.total > 0 && (
                  <Badge count={categoryVariationRes.total} />
                )}
              </Space>
            }
            size="small"
          >
            {categoryVariationRes?.total === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <SettingOutlined className="text-5xl mb-3 text-gray-300" />
                <div className="text-lg mb-2">Chưa có cấu hình nào</div>
                <Text type="secondary">
                  Thêm cấu hình đầu tiên ở trên để bắt đầu
                </Text>
              </div>
            ) : (
              <div className="space-y-3">
                {categoryVariationRes?.data.map((item: any) => (
                  <div
                    key={item._id}
                    className={`p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${
                      editingCategoryVariation?._id === item._id
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <Tag color="blue" className="mb-0">
                              <FolderOutlined className="mr-1" />
                              {item.categoryId?.categoryName}
                            </Tag>
                            <ArrowRightOutlined className="text-gray-400" />
                            <Tag color="green" className="mb-0">
                              <TagOutlined className="mr-1" />
                              {item.variationId?.name}
                            </Tag>
                          </div>
                          {item.isRequired && (
                            <Tag color="red" className="mb-0">
                              <ExclamationCircleOutlined className="mr-1" />
                              Bắt buộc
                            </Tag>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>ID: {item._id}</span>
                          {item.createdAt && (
                            <span>
                              <CalendarOutlined className="mr-1" />
                              Tạo:{' '}
                              {new Date(item.createdAt).toLocaleDateString(
                                'vi-VN',
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      <Space>
                        <ActionButtons
                          actions={[
                            {
                              type: 'edit',
                              tooltip: 'Chỉnh sửa',
                              onClick: () => {
                                handleEditCategoryVariation(item);
                              },
                            },
                            {
                              type: 'delete',
                              tooltip: 'Xóa',
                              confirmTitle:
                                'Bạn có chắc chắn muốn xóa cấu hình này?',
                              onClick: () => deleteCategoryVariation(item._id),
                            },
                          ]}
                        />
                      </Space>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </Modal>
    </div>
  );
};

export default VariationManagement;
