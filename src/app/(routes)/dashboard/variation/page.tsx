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
  message,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SettingOutlined,
  TagsOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
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

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface VariationData {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  optionsCount: number;
  categoriesCount: number;
  options: VariationOptionData[];
}

interface VariationOptionData {
  id: string;
  value: string;
  variationId: string;
}

const mockVariations: VariationData[] = [
  {
    id: '1',
    name: 'Màu sắc',
    description: 'Các tùy chọn màu sắc cho sản phẩm',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    optionsCount: 8,
    categoriesCount: 5,
    options: [
      { id: '1', value: 'Đỏ', variationId: '1' },
      { id: '2', value: 'Xanh', variationId: '1' },
      { id: '3', value: 'Trắng', variationId: '1' },
      { id: '4', value: 'Đen', variationId: '1' },
    ],
  },
  {
    id: '2',
    name: 'Kích thước',
    description: 'Các tùy chọn kích thước',
    isActive: true,
    createdAt: '2024-01-20T14:30:00Z',
    optionsCount: 5,
    categoriesCount: 3,
    options: [
      { id: '5', value: 'S', variationId: '2' },
      { id: '6', value: 'M', variationId: '2' },
      { id: '7', value: 'L', variationId: '2' },
      { id: '8', value: 'XL', variationId: '2' },
      { id: '9', value: 'XXL', variationId: '2' },
    ],
  },
  {
    id: '3',
    name: 'Chất liệu',
    description: 'Loại chất liệu sản phẩm',
    isActive: false,
    createdAt: '2024-02-01T09:15:00Z',
    optionsCount: 3,
    categoriesCount: 2,
    options: [
      { id: '10', value: 'Cotton', variationId: '3' },
      { id: '11', value: 'Polyester', variationId: '3' },
      { id: '12', value: 'Linen', variationId: '3' },
    ],
  },
];

const mockCategories = [
  { id: '1', categoryName: 'Áo thun' },
  { id: '2', categoryName: 'Quần jean' },
  { id: '3', categoryName: 'Giày dép' },
  { id: '4', categoryName: 'Phụ kiện' },
];

const VariationManagement = () => {
  const [form] = Form.useForm();
  const [optionForm] = Form.useForm();
  const [categoryVariationForm] = Form.useForm();

  const [selectedVariation, setSelectedVariation] =
    useState<VariationData | null>(null);

  const [selectedVariationForOptions, setSelectedVariationForOptions] =
    useState<string | null>(null);
  const [variations, setVariations] = useState<VariationData[]>(mockVariations);
  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);
  const [isCategoryVariationModalVisible, setIsCategoryVariationModalVisible] =
    useState(false);

  const {
    isVisible: isModalVisible,
    isEditing,
    openModal,
    closeModal,
  } = useModal();

  // Statistics data
  const statisticsData: StatisticItem[] = useMemo(() => {
    const activeVariations = variations.filter((v) => v.isActive);
    const totalOptions = variations.reduce((sum, v) => sum + v.optionsCount, 0);

    return [
      {
        title: 'Tổng biến thể',
        value: variations.length,
        prefix: <TagsOutlined />,
        valueStyle: { color: '#1890ff' },
      },
      {
        title: 'Đang hoạt động',
        value: activeVariations.length,
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
        value: variations.length - activeVariations.length,
        prefix: <ClockCircleOutlined />,
        valueStyle: { color: '#fa8c16' },
      },
    ];
  }, [variations]);

  // Variation columns
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
              ID: {record.id}
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
      dataIndex: 'optionsCount',
      key: 'optionsCount',
      width: 120,
      render: (count: number, record: VariationData) => (
        <Space>
          <Tag color="blue">{count} tùy chọn</Tag>
          <Button
            type="link"
            size="small"
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
            onClick: () => handleDeleteVariation(record.id),
          },
        ];
        return <ActionButtons actions={actions} />;
      },
    },
  ];

  // Event handlers
  const handleEditVariation = useCallback(
    (variation: VariationData) => {
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

  const handleSaveVariation = async () => {
    try {
      const values = await form.validateFields();

      if (isEditing && selectedVariation) {
        const updatedVariation = {
          ...selectedVariation,
          ...values,
        };
        setVariations((prev) =>
          prev.map((v) =>
            v.id === selectedVariation.id ? updatedVariation : v,
          ),
        );
        message.success('Cập nhật biến thể thành công!');
      } else {
        const newVariation: VariationData = {
          id: Date.now().toString(),
          ...values,
          createdAt: new Date().toISOString(),
          optionsCount: 0,
          categoriesCount: 0,
          options: [],
        };
        setVariations((prev) => [...prev, newVariation]);
        message.success('Tạo biến thể mới thành công!');
      }

      closeModal();
      form.resetFields();
      setSelectedVariation(null);
    } catch (error) {
      console.error('Error saving variation:', error);
    }
  };

  const handleDeleteVariation = (id: string) => {
    setVariations((prev) => prev.filter((v) => v.id !== id));
    message.success('Xóa biến thể thành công!');
  };

  const handleManageOptions = (variation: VariationData) => {
    setSelectedVariationForOptions(variation.id);
    setIsOptionsModalVisible(true);
  };

  const handleAddOption = async () => {
    try {
      const values = await optionForm.validateFields();

      if (!selectedVariationForOptions) return;

      const newOption: VariationOptionData = {
        id: Date.now().toString(),
        value: values.value,
        variationId: selectedVariationForOptions,
      };

      setVariations((prev) =>
        prev.map((v) =>
          v.id === selectedVariationForOptions
            ? {
                ...v,
                options: [...v.options, newOption],
                optionsCount: v.optionsCount + 1,
              }
            : v,
        ),
      );

      optionForm.resetFields();
      message.success('Thêm tùy chọn thành công!');
    } catch (error) {
      console.error('Error adding option:', error);
    }
  };

  const handleDeleteOption = (optionId: string) => {
    if (!selectedVariationForOptions) return;

    setVariations((prev) =>
      prev.map((v) =>
        v.id === selectedVariationForOptions
          ? {
              ...v,
              options: v.options.filter((opt) => opt.id !== optionId),
              optionsCount: v.optionsCount - 1,
            }
          : v,
      ),
    );
    message.success('Xóa tùy chọn thành công!');
  };

  const selectedVariationData = selectedVariationForOptions
    ? variations.find((v) => v.id === selectedVariationForOptions)
    : null;

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
          dataSource={variations}
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
        onSave={handleSaveVariation}
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
        title={`Quản lý tùy chọn - ${selectedVariationData?.name}`}
        open={isOptionsModalVisible}
        onCancel={() => setIsOptionsModalVisible(false)}
        width={800}
        footer={null}
      >
        <div className="space-y-4">
          <Card title="Thêm tùy chọn mới" size="small">
            <Form form={optionForm} layout="inline" onFinish={handleAddOption}>
              <Form.Item
                name="value"
                rules={[
                  { required: true, message: 'Vui lòng nhập giá trị' },
                  { max: 50, message: 'Giá trị không được quá 50 ký tự' },
                ]}
                className="flex-1"
              >
                <Input placeholder="Ví dụ: Đỏ, Size M, Cotton..." />
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
            {selectedVariationData?.options.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <SettingOutlined className="text-4xl mb-2" />
                <div>Chưa có tùy chọn nào</div>
                <Text type="secondary">Thêm tùy chọn đầu tiên ở trên</Text>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedVariationData?.options.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <Text strong>{option.value}</Text>
                      <div>
                        <Text type="secondary" className="text-xs">
                          ID: {option.id}
                        </Text>
                      </div>
                    </div>
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteOption(option.id)}
                    >
                      Xóa
                    </Button>
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
        onCancel={() => setIsCategoryVariationModalVisible(false)}
        width={900}
        footer={null}
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <Space align="start">
              <InfoCircleOutlined className="text-yellow-600 mt-1" />
              <div>
                <Text className="text-sm text-yellow-800">
                  <strong>Hướng dẫn:</strong> Cấu hình các biến thể cho từng
                  danh mục sản phẩm. Khi tạo sản phẩm thuộc danh mục này, hệ
                  thống sẽ yêu cầu nhập thông tin cho các biến thể đã cấu hình.
                </Text>
              </div>
            </Space>
          </div>

          <Card title="Thêm cấu hình mới" size="small">
            <Form form={categoryVariationForm} layout="vertical">
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Danh mục"
                    name="categoryId"
                    rules={[
                      { required: true, message: 'Vui lòng chọn danh mục' },
                    ]}
                  >
                    <Select placeholder="Chọn danh mục">
                      {mockCategories.map((cat) => (
                        <Option key={cat.id} value={cat.id}>
                          {cat.categoryName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Biến thể"
                    name="variationId"
                    rules={[
                      { required: true, message: 'Vui lòng chọn biến thể' },
                    ]}
                  >
                    <Select placeholder="Chọn biến thể">
                      {variations
                        .filter((v) => v.isActive)
                        .map((variation) => (
                          <Option key={variation.id} value={variation.id}>
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
                <Col span={4}>
                  <Form.Item label=" ">
                    <Button type="primary" icon={<PlusOutlined />}>
                      Thêm
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>

          <Card title="Cấu hình hiện có" size="small">
            <div className="text-center py-8 text-gray-500">
              <SettingOutlined className="text-4xl mb-2" />
              <div>Chưa có cấu hình nào</div>
              <Text type="secondary">Thêm cấu hình đầu tiên ở trên</Text>
            </div>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

export default VariationManagement;
