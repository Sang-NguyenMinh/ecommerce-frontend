'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  Form,
  Input,
  Select,
  Typography,
  Tag,
  Switch,
  DatePicker,
  InputNumber,
  Space,
  Card,
  Button,
  Tabs,
  Progress,
  Badge,
  Alert,
  Row,
  Col,
  Descriptions,
  Empty,
} from 'antd';
import {
  PlusOutlined,
  GiftOutlined,
  PercentageOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ShoppingOutlined,
  TagsOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  DollarOutlined,
  StopOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ClearOutlined,
  SelectOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const usePromotionUsage = () => ({
  data: {
    data: [
      {
        _id: '68569dbcb9fe3eb2f9663de2',
        promotionId: '6856975fe3407525e04255b0',
        promotionName: 'Summer Sale 2025',
        userId: '65f25a3d6e4b3b001c2d5a8e',
        userName: 'Nguyễn Văn A',
        orderId: 'ORDER001',
        orderTotal: 1500000,
        discountAmount: 150000,
        usedAt: '2025-06-20T14:30:00.000Z',
        createdAt: '2025-06-21T11:55:40.875Z',
      },
      {
        _id: '68569dbcb9fe3eb2f9663de3',
        promotionId: '6856975fe3407525e04255b1',
        promotionName: 'Flash Sale',
        userId: '65f25a3d6e4b3b001c2d5a8f',
        userName: 'Trần Thị B',
        orderId: 'ORDER002',
        orderTotal: 800000,
        discountAmount: 50000,
        usedAt: '2025-06-20T16:45:00.000Z',
        createdAt: '2025-06-21T11:55:40.875Z',
      },
    ],
  },
  isLoading: false,
});

const useCreatePromotion = () => ({
  mutate: (data: any) => console.log('Create:', data),
  isPending: false,
});
const useUpdatePromotion = () => ({
  mutate: (data: any) => console.log('Update:', data),
  isPending: false,
});
const useDeletePromotion = () => ({
  mutate: (id: string) => console.log('Delete:', id),
  isPending: false,
});

import {
  CustomModal,
  CustomTable,
  PageHeader,
  StatisticItem,
  StatisticsCards,
  useModal,
} from '../products/component/custom';
import { usePromotions } from '@/hooks/promotion';
import { usePromotionCategories } from '@/hooks/promotion-category';
import { usePromotionProducts } from '@/hooks/promotion-product';
import { useProducts } from '@/hooks/product';
import { useCategories } from '@/hooks/category';

const { Text, Title, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface PromotionData {
  _id: string;
  name: string;
  description: string;
  discountType: 'Percentage' | 'Fixed';
  discountValue: number;
  maxDiscountAmount?: number | null;
  minOrderValue: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
}

interface PromotionUsageData {
  _id: string;
  promotionId: string;
  promotionName: string;
  userId: string;
  userName: string;
  orderId: string;
  orderTotal: number;
  discountAmount: number;
  usedAt: string;
}

const PromotionManagement = () => {
  const [form] = Form.useForm();
  const [selectedPromotion, setSelectedPromotion] =
    useState<PromotionData | null>(null);
  const [activeTab, setActiveTab] = useState('promotions');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  const { data: promotionsRes, isLoading: promotionsLoading } = usePromotions();
  const { data: categoriesRes, isLoading: categoriesLoading } =
    usePromotionCategories();
  const { data: productsRes, isLoading: productsLoading } =
    usePromotionProducts();
  const { data: usageRes, isLoading: usageLoading } = usePromotionUsage();

  const { mutate: createPromotion, isPending: isCreating } =
    useCreatePromotion();
  const { mutate: updatePromotion, isPending: isUpdating } =
    useUpdatePromotion();
  const { mutate: deletePromotion, isPending: isDeleting } =
    useDeletePromotion();

  const { data: categories } = useCategories();
  const { data: products } = useProducts();

  const {
    isVisible: isModalVisible,
    isEditing,
    openModal,
    closeModal,
  } = useModal();

  const transformedPromotions = useMemo(() => {
    if (!promotionsRes?.data || !Array.isArray(promotionsRes.data)) {
      return [];
    }

    return promotionsRes.data.map((promotion: any) => ({
      ...promotion,
      id: promotion._id,
      key: promotion._id,
    }));
  }, [promotionsRes]);

  const getPromotionStatus = (promotion: PromotionData) => {
    const now = dayjs();
    const startDate = dayjs(promotion.startDate);
    const endDate = dayjs(promotion.endDate);

    if (!promotion.isActive) {
      return { status: 'paused', text: 'Tạm dừng', color: 'orange' };
    }

    if (endDate.isBefore(now)) {
      return { status: 'expired', text: 'Đã hết hạn', color: 'red' };
    }

    if (startDate.isAfter(now)) {
      return { status: 'scheduled', text: 'Sắp diễn ra', color: 'blue' };
    }

    if (
      promotion.usageLimit > 0 &&
      promotion.usedCount >= promotion.usageLimit
    ) {
      return { status: 'exhausted', text: 'Đã hết lượt', color: 'gray' };
    }

    return { status: 'active', text: 'Đang chạy', color: 'green' };
  };

  const statisticsData: StatisticItem[] = useMemo(() => {
    const activePromotions = transformedPromotions.filter(
      (p) => getPromotionStatus(p).status === 'active',
    );
    const expiredPromotions = transformedPromotions.filter(
      (p) => getPromotionStatus(p).status === 'expired',
    );
    const scheduledPromotions = transformedPromotions.filter(
      (p) => getPromotionStatus(p).status === 'scheduled',
    );
    const totalUsage = usageRes?.data?.length || 0;

    return [
      {
        title: 'Tổng khuyến mãi',
        value: transformedPromotions.length,
        prefix: <GiftOutlined />,
        valueStyle: { color: '#1890ff' },
        suffix: 'chương trình',
      },
      {
        title: 'Đang hoạt động',
        value: activePromotions.length,
        prefix: <CheckCircleOutlined />,
        valueStyle: { color: '#52c41a' },
        suffix: 'chương trình',
      },
      {
        title: 'Sắp diễn ra',
        value: scheduledPromotions.length,
        prefix: <ClockCircleOutlined />,
        valueStyle: { color: '#1890ff' },
        suffix: 'chương trình',
      },
      {
        title: 'Lượt sử dụng',
        value: totalUsage,
        prefix: <UserOutlined />,
        valueStyle: { color: '#722ed1' },
        suffix: 'lượt',
      },
    ];
  }, [transformedPromotions, usageRes]);

  const promotionColumns = [
    {
      title: 'Thông tin khuyến mãi',
      key: 'info',
      width: 300,
      render: (_, record: PromotionData) => {
        const status = getPromotionStatus(record);
        const usagePercent =
          record.usageLimit > 0
            ? Math.round((record.usedCount / record.usageLimit) * 100)
            : 0;

        return (
          <div className="space-y-2 mr-12">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Text strong className="text-base">
                    {record.name}
                  </Text>
                  <Tag color={status.color} className="text-xs">
                    {status.text}
                  </Tag>
                </div>
                <Paragraph
                  className="text-sm text-gray-600 mb-2 line-clamp-2"
                  style={{ margin: 0 }}
                >
                  {record.description}
                </Paragraph>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>
                <CalendarOutlined className="mr-1" />
                {dayjs(record.startDate).format('DD/MM/YYYY')} -{' '}
                {dayjs(record.endDate).format('DD/MM/YYYY')}
              </span>
            </div>

            {record.usageLimit > 0 && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Text className="text-xs text-gray-500">
                    Đã sử dụng: {record.usedCount}/{record.usageLimit}
                  </Text>
                  <Text className="text-xs font-medium">{usagePercent}%</Text>
                </div>
                <Progress
                  percent={usagePercent}
                  size="small"
                  status={usagePercent >= 90 ? 'exception' : 'active'}
                  showInfo={false}
                />
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Loại & Giá trị giảm',
      key: 'discount',
      width: 220,
      render: (_, record: PromotionData) => (
        <div>
          <div className="mb-2">
            <Tag
              color={record.discountType === 'Percentage' ? 'blue' : 'green'}
              className="mb-1"
            >
              {record.discountType === 'Percentage' ? (
                <>
                  <PercentageOutlined /> Phần trăm
                </>
              ) : (
                <>
                  <DollarOutlined /> Cố định
                </>
              )}
            </Tag>
          </div>

          <div className="text-lg font-bold text-primary">
            {record.discountType === 'Percentage'
              ? `${record.discountValue}%`
              : `${record.discountValue.toLocaleString()}đ`}
          </div>

          {record.maxDiscountAmount && (
            <div className="text-xs text-gray-500 mt-1">
              Tối đa: {record.maxDiscountAmount.toLocaleString()}đ
            </div>
          )}

          {record.minOrderValue > 0 && (
            <div className="text-xs text-gray-500">
              Đơn tối thiểu: {record.minOrderValue.toLocaleString()}đ
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Hiệu suất',
      key: 'performance',
      width: 120,
      render: (_, record: PromotionData) => {
        const status = getPromotionStatus(record);
        const daysLeft = dayjs(record.endDate).diff(dayjs(), 'day');
        const totalDays = dayjs(record.endDate).diff(
          dayjs(record.startDate),
          'day',
        );
        const progress =
          totalDays > 0
            ? Math.max(0, Math.min(100, 100 - (daysLeft / totalDays) * 100))
            : 100;

        return (
          <div className=" space-y-2">
            <div>
              <div className="text-sm font-medium mb-1">
                {status.status === 'active' && daysLeft >= 0 ? (
                  <span className="text-orange-500">Còn {daysLeft} ngày</span>
                ) : status.status === 'scheduled' ? (
                  <span className="text-blue-500">
                    Còn {Math.abs(daysLeft)} ngày
                  </span>
                ) : (
                  <span className="text-gray-500">{status.text}</span>
                )}
              </div>

              {status.status === 'active' && (
                <Progress
                  type="circle"
                  percent={Math.round(progress)}
                  size={50}
                  strokeColor={progress > 80 ? '#ff4d4f' : '#1890ff'}
                />
              )}
            </div>

            <div className="text-xs text-gray-500">
              <div>Tạo: {dayjs(record.createdAt).format('DD/MM/YYYY')}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_, record: PromotionData) => (
        <Space direction="vertical">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedPromotion(record);
              setViewModalVisible(true);
            }}
            block
          >
            Xem chi tiết
          </Button>

          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            block
          >
            Chỉnh sửa
          </Button>

          <Button
            type="link"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => {
              if (window.confirm('Bạn có chắc chắn muốn xóa khuyến mãi này?')) {
                deletePromotion(record._id);
              }
            }}
            block
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];
  console.log(productsRes);
  // Category columns
  const categoryColumns = [
    {
      title: 'Thông tin danh mục',
      key: 'categoryInfo',
      render: (_, record: any) => (
        <div>
          <Text strong className="text-base">
            {record.categoryId.categoryName}
          </Text>
          <div className="text-sm text-gray-500">
            ID: {record.categoryId._id}
          </div>
          <div className="mt-1">
            <Tag
              color={record.includeSubCategories ? 'green' : 'orange'}
              size="small"
            >
              {record.includeSubCategories
                ? 'Bao gồm danh mục con'
                : 'Chỉ danh mục chính'}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Khuyến mãi áp dụng',
      key: 'promotionInfo',
      render: (_, record: any) => (
        <div>
          <Text strong>{record.promotionId.name}</Text>
          <div className="text-sm text-gray-500">
            ID: {record.promotionId._id}
          </div>
        </div>
      ),
    },
    {
      title: 'Giá trị giảm giá',
      key: 'discountPercent',
      width: 300,
      render: (_, record: any) => {
        return (
          <div className="text-lg font-bold text-red-500">
            -{record.promotionId.discountValue}
            {record.promotionId.discountValue == 'Fixed' ? 'đ' : '%'}
          </div>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 200,
      render: (isActive: boolean) => (
        <Badge
          status={isActive ? 'success' : 'error'}
          text={isActive ? 'Hoạt động' : 'Tạm dừng'}
        />
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
  ];

  const productColumns = [
    {
      title: 'Thông tin sản phẩm',
      key: 'productInfo',
      render: (_, record: any) => (
        <div>
          <Text strong className="text-base">
            {record.productId.productName}
          </Text>
          <div className="text-sm text-gray-500">
            ID: {record.productId._id}
          </div>
        </div>
      ),
    },
    {
      title: 'Khuyến mãi áp dụng',
      key: 'promotionInfo',
      render: (_, record: any) => (
        <div>
          <Text strong>{record.promotionId.name ?? 'null'}</Text>
          <div className="text-sm text-gray-500">
            ID: {record.promotionId._id}
          </div>
        </div>
      ),
    },
    {
      title: 'Giá trị giảm giá',
      key: 'discountPercent',
      width: 300,
      render: (_, record: any) => {
        return (
          <div className="text-lg font-bold text-red-500">
            -{record.promotionId.discountValue}
            {record.promotionId.discountValue == 'Fixed' ? 'đ' : '%'}
          </div>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 200,
      render: (_, record: any) => (
        <Badge
          status={record.promotionId.isActive ? 'success' : 'error'}
          text={record.promotionId.isActive ? 'Hoạt động' : 'Tạm dừng'}
        />
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (_, record: any) => dayjs(record.createdAt).format('DD/MM/YYYY'),
    },
  ];

  const usageColumns = [
    {
      title: 'Thông tin đơn hàng',
      key: 'orderInfo',
      render: (_, record: PromotionUsageData) => (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Text strong>#{record.orderId}</Text>
            <Tag color="blue" size="small">
              Đã thanh toán
            </Tag>
          </div>
          <div className="text-sm text-gray-500">
            Khách hàng: {record.userName}
          </div>
          <div className="text-sm">
            <Text>Tổng đơn: </Text>
            <Text strong>{record.orderTotal.toLocaleString()}đ</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Khuyến mãi sử dụng',
      key: 'promotionUsed',
      render: (_, record: PromotionUsageData) => (
        <div>
          <Text strong>{record.promotionName}</Text>
          <div className="text-sm text-gray-500">ID: {record.promotionId}</div>
        </div>
      ),
    },
    {
      title: 'Số tiền tiết kiệm',
      key: 'savings',
      render: (_, record: PromotionUsageData) => {
        const savingPercent = Math.round(
          (record.discountAmount / record.orderTotal) * 100,
        );
        return (
          <div className="text-center">
            <div className="text-lg font-bold text-green-600 mb-1">
              -{record.discountAmount.toLocaleString()}đ
            </div>
            <Tag color="green" size="small">
              Tiết kiệm {savingPercent}%
            </Tag>
          </div>
        );
      },
    },
    {
      title: 'Thời gian sử dụng',
      dataIndex: 'usedAt',
      key: 'usedAt',
      width: 150,
      render: (date: string) => (
        <div className="text-center">
          <div>{dayjs(date).format('DD/MM/YYYY')}</div>
          <div className="text-sm text-gray-500">
            {dayjs(date).format('HH:mm')}
          </div>
        </div>
      ),
    },
  ];

  console.log('promotions', products);

  const handleEdit = useCallback(
    (promotion: PromotionData) => {
      setSelectedPromotion(promotion);
      openModal(promotion, true);
      form.setFieldsValue({
        name: promotion.name,
        description: promotion.description,
        discountType: promotion.discountType,
        discountValue: promotion.discountValue,
        maxDiscountAmount: promotion.maxDiscountAmount,
        minOrderValue: promotion.minOrderValue,
        dateRange: [dayjs(promotion.startDate), dayjs(promotion.endDate)],
        usageLimit: promotion.usageLimit,
        isActive: promotion.isActive,
      });
    },
    [form, openModal],
  );

  const handleAddNew = useCallback(() => {
    openModal();
    form.resetFields();
    setSelectedPromotion(null);
    setSelectedCategories([]);
    setSelectedProducts([]);
  }, [form, openModal]);

  const handleSavePromotion = async () => {
    try {
      const values = await form.validateFields();

      const promotionData = {
        name: values.name,
        description: values.description,
        discountType: values.discountType,
        discountValue: values.discountValue,
        maxDiscountAmount: values.maxDiscountAmount,
        minOrderValue: values.minOrderValue || 0,
        startDate: values.dateRange[0].toISOString(),
        endDate: values.dateRange[1].toISOString(),
        usageLimit: values.usageLimit || 0,
        isActive: values.isActive ?? true,
        categories: selectedCategories,
        products: selectedProducts,
      };

      if (isEditing && selectedPromotion) {
        await updatePromotion({
          id: selectedPromotion._id,
          data: promotionData,
        });
      } else {
        await createPromotion(promotionData);
      }

      closeModal();
      form.resetFields();
      setSelectedPromotion(null);
      setSelectedCategories([]);
      setSelectedProducts([]);
    } catch (error) {
      console.error('Error saving promotion:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader
        title="Quản lý khuyến mãi"
        subtitle="Quản lý các chương trình khuyến mãi và theo dõi hiệu quả"
        actionButton={{
          text: 'Thêm khuyến mãi mới',
          icon: <PlusOutlined />,
          onClick: handleAddNew,
        }}
      />

      <StatisticsCards statistics={statisticsData} />

      <Card className="shadow-sm">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          tabBarStyle={{ marginBottom: '24px' }}
        >
          <TabPane
            tab={
              <span className="flex items-center gap-2">
                <GiftOutlined />
                <span>Danh sách khuyến mãi</span>
                <Badge count={transformedPromotions.length} showZero />
              </span>
            }
            key="promotions"
          >
            {transformedPromotions.length > 0 ? (
              <>
                <Alert
                  message="Hướng dẫn"
                  description="Theo dõi trạng thái và hiệu quả các chương trình khuyến mãi. Sử dụng các chỉ số để tối ưu hóa chiến lược marketing."
                  type="info"
                  showIcon
                  closable
                  className="mb-4"
                />
                <CustomTable
                  columns={promotionColumns}
                  dataSource={transformedPromotions}
                  rowKey="id"
                  paginationConfig={{
                    pageSize: 15,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: true,
                  }}
                  scroll={{ x: 800 }}
                />
              </>
            ) : (
              <Empty
                description="Chưa có chương trình khuyến mãi nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddNew}
                >
                  Tạo khuyến mãi đầu tiên
                </Button>
              </Empty>
            )}
          </TabPane>

          <TabPane
            tab={
              <span className="flex items-center gap-2">
                <TagsOutlined />
                <span>Danh mục áp dụng</span>
                <Badge count={categoriesRes?.data?.length || 0} showZero />
              </span>
            }
            key="categories"
          >
            <Card
              title="Danh mục được áp dụng khuyến mãi"
              extra={
                <Button type="link" icon={<InfoCircleOutlined />}>
                  Hướng dẫn
                </Button>
              }
            >
              <CustomTable
                columns={categoryColumns}
                dataSource={categoriesRes?.data || []}
                loading={categoriesLoading}
                rowKey="_id"
                paginationConfig={{
                  pageSize: 15,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: true,
                }}
              />
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span className="flex items-center gap-2">
                <ShoppingOutlined />
                <span>Sản phẩm áp dụng</span>
                <Badge count={productsRes?.data?.length || 0} showZero />
              </span>
            }
            key="products"
          >
            <Card
              title="Sản phẩm được áp dụng khuyến mãi"
              extra={
                <Button type="link" icon={<InfoCircleOutlined />}>
                  Hướng dẫn
                </Button>
              }
            >
              <CustomTable
                columns={productColumns}
                dataSource={productsRes?.data || []}
                loading={productsLoading}
                rowKey="_id"
                paginationConfig={{
                  pageSize: 15,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: true,
                }}
              />
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span className="flex items-center gap-2">
                <UserOutlined />
                <span>Lịch sử sử dụng</span>
                <Badge count={usageRes?.data?.length || 0} showZero />
              </span>
            }
            key="usage"
          >
            <Card
              title="Lịch sử sử dụng khuyến mãi"
              extra={
                <Space>
                  <Button type="link" icon={<InfoCircleOutlined />}>
                    Xuất báo cáo
                  </Button>
                  <Button type="link" icon={<InfoCircleOutlined />}>
                    Bộ lọc
                  </Button>
                </Space>
              }
            >
              <CustomTable
                columns={usageColumns}
                dataSource={usageRes?.data || []}
                loading={usageLoading}
                rowKey="_id"
                paginationConfig={{
                  pageSize: 15,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: true,
                }}
              />
            </Card>
          </TabPane>
        </Tabs>
      </Card>

      <CustomModal
        title={isEditing ? 'Chỉnh sửa khuyến mãi' : 'Tạo khuyến mãi mới'}
        open={isModalVisible}
        onCancel={closeModal}
        onSave={handleSavePromotion}
        saveText={isEditing ? 'Cập nhật khuyến mãi' : 'Tạo khuyến mãi'}
        loading={isCreating || isUpdating}
        width={900}
      >
        <Alert
          message={
            isEditing
              ? 'Chỉnh sửa thông tin khuyến mãi'
              : 'Tạo chương trình khuyến mãi mới'
          }
          description={
            isEditing
              ? 'Lưu ý: Việc thay đổi có thể ảnh hưởng đến các đơn hàng đã áp dụng khuyến mãi này.'
              : 'Điền đầy đủ thông tin để tạo chương trình khuyến mãi hiệu quả.'
          }
          type={isEditing ? 'warning' : 'info'}
          showIcon
          className="mb-6"
        />

        <Form form={form} layout="vertical" size="large">
          <Card title="Thông tin cơ bản" className="mb-4">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Tên khuyến mãi"
                  name="name"
                  rules={[
                    { required: true, message: 'Vui lòng nhập tên khuyến mãi' },
                    {
                      min: 2,
                      message: 'Tên khuyến mãi phải có ít nhất 2 ký tự',
                    },
                    {
                      max: 100,
                      message: 'Tên khuyến mãi không được quá 100 ký tự',
                    },
                  ]}
                >
                  <Input
                    placeholder="VD: Giảm giá mùa hè 2025"
                    prefix={<GiftOutlined />}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Loại giảm giá"
                  name="discountType"
                  rules={[
                    { required: true, message: 'Vui lòng chọn loại giảm giá' },
                  ]}
                >
                  <Select placeholder="Chọn loại giảm giá">
                    <Option value="Percentage">
                      <PercentageOutlined /> Phần trăm (%)
                    </Option>
                    <Option value="Fixed">
                      <DollarOutlined /> Số tiền cố định (đ)
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Mô tả chi tiết"
              name="description"
              rules={[{ max: 500, message: 'Mô tả không được quá 500 ký tự' }]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Mô tả chi tiết về chương trình khuyến mãi..."
                showCount
                maxLength={500}
              />
            </Form.Item>
          </Card>

          <Card title="Cấu hình giảm giá" className="mb-4">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Giá trị giảm"
                  name="discountValue"
                  rules={[
                    { required: true, message: 'Vui lòng nhập giá trị giảm' },
                    {
                      type: 'number',
                      min: 0.01,
                      message: 'Giá trị phải lớn hơn 0',
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="0"
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    addonAfter={
                      <Form.Item name="discountType" noStyle>
                        {({ getFieldValue }) =>
                          getFieldValue('discountType') === 'Percentage'
                            ? '%'
                            : 'đ'
                        }
                      </Form.Item>
                    }
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Giảm tối đa"
                  name="maxDiscountAmount"
                  tooltip="Chỉ áp dụng cho loại giảm theo phần trăm"
                >
                  <InputNumber
                    placeholder="Không giới hạn"
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    addonAfter="đ"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Đơn hàng tối thiểu"
                  name="minOrderValue"
                  tooltip="Giá trị đơn hàng tối thiểu để áp dụng khuyến mãi"
                >
                  <InputNumber
                    placeholder="0"
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    addonAfter="đ"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Thời gian & Sử dụng" className="mb-4">
            <Row gutter={16}>
              <Col span={16}>
                <Form.Item
                  label="Thời gian áp dụng"
                  name="dateRange"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn thời gian áp dụng',
                    },
                  ]}
                >
                  <RangePicker
                    style={{ width: '100%' }}
                    showTime={{ format: 'HH:mm' }}
                    format="DD/MM/YYYY HH:mm"
                    placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Giới hạn sử dụng"
                  name="usageLimit"
                  tooltip="Số lần tối đa khuyến mãi có thể được sử dụng (0 = không giới hạn)"
                >
                  <InputNumber
                    placeholder="0"
                    style={{ width: '100%' }}
                    min={0}
                    addonAfter="lượt"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Phạm vi áp dụng" className="mb-4">
            <Alert
              message="Chọn danh mục hoặc sản phẩm cụ thể"
              description="Nếu không chọn gì, khuyến mãi sẽ áp dụng cho toàn bộ cửa hàng"
              type="info"
              showIcon
              className="mb-4"
            />

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Danh mục áp dụng">
                  <Select
                    mode="multiple"
                    allowClear
                    showSearch
                    placeholder="Tìm và chọn danh mục..."
                    optionFilterProp="children"
                    value={selectedCategories}
                    onChange={setSelectedCategories}
                    style={{ width: '100%' }}
                    maxTagCount="responsive"
                    filterOption={(input, option) =>
                      option?.children
                        ?.toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    notFoundContent="Không tìm thấy danh mục"
                  >
                    {categories?.data.map((category) => (
                      <Option key={category._id} value={category._id}>
                        <Space>
                          <TagsOutlined />
                          {category.categoryName}
                        </Space>
                      </Option>
                    ))}
                  </Select>
                  {selectedCategories.length > 0 && (
                    <div className="mt-2">
                      <Text type="secondary" className="text-sm">
                        Đã chọn {selectedCategories.length} danh mục
                      </Text>
                      <Button
                        type="link"
                        size="small"
                        onClick={() => setSelectedCategories([])}
                        className="ml-2 p-0"
                      >
                        Xóa tất cả
                      </Button>
                    </div>
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Sản phẩm cụ thể">
                  <Select
                    mode="multiple"
                    allowClear
                    showSearch
                    placeholder="Tìm và chọn sản phẩm..."
                    optionFilterProp="children"
                    value={selectedProducts}
                    onChange={setSelectedProducts}
                    style={{ width: '100%' }}
                    maxTagCount="responsive"
                    filterOption={(input, option) =>
                      option?.children
                        ?.toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    notFoundContent="Không tìm thấy sản phẩm"
                    dropdownRender={(menu) => (
                      <div>
                        {menu}
                        {products?.products?.length > 100 && (
                          <div className="p-2 border-t">
                            <Text type="secondary" className="text-xs">
                              Hiển thị {Math.min(100, products.products.length)}{' '}
                              / {products.products.length} sản phẩm
                            </Text>
                          </div>
                        )}
                      </div>
                    )}
                  >
                    {products?.products?.slice(0, 100).map((product) => (
                      <Option key={product._id} value={product._id}>
                        <Space>
                          <ShoppingOutlined />
                          <span className="truncate">
                            {product.productName}
                          </span>
                        </Space>
                      </Option>
                    ))}
                  </Select>
                  {selectedProducts.length > 0 && (
                    <div className="mt-2">
                      <Text type="secondary" className="text-sm">
                        Đã chọn {selectedProducts.length} sản phẩm
                      </Text>
                      <Button
                        type="link"
                        size="small"
                        onClick={() => setSelectedProducts([])}
                        className="ml-2 p-0"
                      >
                        Xóa tất cả
                      </Button>
                    </div>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16} className="mt-4">
              <Col span={24}>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Text strong className="block mb-2">
                    Lựa chọn nhanh:
                  </Text>
                  <Space wrap>
                    <Button
                      size="small"
                      icon={<SelectOutlined />}
                      onClick={() => {
                        const allCategoryIds =
                          categories?.data.map((cat) => cat._id) || [];
                        setSelectedCategories(allCategoryIds);
                      }}
                    >
                      Chọn tất cả danh mục
                    </Button>
                    <Button
                      size="small"
                      icon={<ClearOutlined />}
                      onClick={() => {
                        setSelectedCategories([]);
                        setSelectedProducts([]);
                      }}
                    >
                      Xóa tất cả lựa chọn
                    </Button>
                  </Space>
                </div>
              </Col>
            </Row>
          </Card>

          <Card title="Trạng thái">
            <Form.Item
              label="Kích hoạt ngay"
              name="isActive"
              valuePropName="checked"
              extra="Khuyến mãi sẽ có hiệu lực ngay sau khi tạo (trong khoảng thời gian đã thiết lập)"
            >
              <Switch
                checkedChildren={<CheckCircleOutlined />}
                unCheckedChildren={<StopOutlined />}
                defaultChecked
              />
            </Form.Item>
          </Card>
        </Form>
      </CustomModal>

      <CustomModal
        title="Chi tiết khuyến mãi"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              setViewModalVisible(false);
              if (selectedPromotion) {
                handleEdit(selectedPromotion);
              }
            }}
          >
            <EditOutlined /> Chỉnh sửa
          </Button>,
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {selectedPromotion && (
          <div className="space-y-6">
            <Alert
              message={`Trạng thái: ${getPromotionStatus(selectedPromotion).text}`}
              type={
                getPromotionStatus(selectedPromotion).status === 'active'
                  ? 'success'
                  : 'warning'
              }
              showIcon
            />

            <Descriptions bordered column={2} size="middle">
              <Descriptions.Item label="Tên khuyến mãi" span={2}>
                <Text strong className="text-lg">
                  {selectedPromotion.name}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item label="Mô tả" span={2}>
                {selectedPromotion.description}
              </Descriptions.Item>

              <Descriptions.Item label="Loại giảm giá">
                <Tag
                  color={
                    selectedPromotion.discountType === 'Percentage'
                      ? 'blue'
                      : 'green'
                  }
                >
                  {selectedPromotion.discountType === 'Percentage'
                    ? 'Phần trăm'
                    : 'Cố định'}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Giá trị giảm">
                <Text strong className="text-lg text-red-500">
                  {selectedPromotion.discountType === 'Percentage'
                    ? `${selectedPromotion.discountValue}%`
                    : `${selectedPromotion.discountValue.toLocaleString()}đ`}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item label="Giảm tối đa">
                {selectedPromotion.maxDiscountAmount
                  ? `${selectedPromotion.maxDiscountAmount.toLocaleString()}đ`
                  : 'Không giới hạn'}
              </Descriptions.Item>

              <Descriptions.Item label="Đơn tối thiểu">
                {selectedPromotion.minOrderValue > 0
                  ? `${selectedPromotion.minOrderValue.toLocaleString()}đ`
                  : 'Không yêu cầu'}
              </Descriptions.Item>

              <Descriptions.Item label="Thời gian bắt đầu">
                {dayjs(selectedPromotion.startDate).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>

              <Descriptions.Item label="Thời gian kết thúc">
                {dayjs(selectedPromotion.endDate).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>

              <Descriptions.Item label="Sử dụng">
                <div>
                  <Text>
                    {selectedPromotion.usedCount}/
                    {selectedPromotion.usageLimit || '∞'}
                  </Text>
                  {selectedPromotion.usageLimit > 0 && (
                    <Progress
                      percent={Math.round(
                        (selectedPromotion.usedCount /
                          selectedPromotion.usageLimit) *
                          100,
                      )}
                      size="small"
                      className="mt-1"
                    />
                  )}
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái">
                <Badge
                  status={selectedPromotion.isActive ? 'success' : 'error'}
                  text={selectedPromotion.isActive ? 'Hoạt động' : 'Tạm dừng'}
                />
              </Descriptions.Item>

              <Descriptions.Item label="Ngày tạo">
                {dayjs(selectedPromotion.createdAt).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>

              <Descriptions.Item label="Cập nhật lần cuối">
                {dayjs(selectedPromotion.updatedAt).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </CustomModal>
    </div>
  );
};

export default PromotionManagement;
