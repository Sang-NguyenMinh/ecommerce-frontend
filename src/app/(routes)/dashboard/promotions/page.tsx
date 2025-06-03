'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  Form,
  Input,
  Select,
  Typography,
  Tag,
  Tabs,
  InputNumber,
  Drawer,
  Image,
  Row,
  Col,
  Badge,
  Button,
  DatePicker,
  Transfer,
  Checkbox,
  Progress,
  Card,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  GiftOutlined,
  PercentageOutlined,
  CalendarOutlined,
  ShopOutlined,
  TagOutlined,
  BarChartOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import dayjs from 'dayjs';
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

const { Text, Title } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// Types based on backend schema
interface Promotion {
  _id: string;
  name: string;
  description?: string;
  discountRate: number;
  startDate: Date;
  endDate: Date;
  status?: 'active' | 'inactive' | 'expired' | 'scheduled';
  appliedProducts?: number;
  appliedCategories?: number;
  totalUsage?: number;
  totalRevenue?: number;
}

interface PromotionProduct {
  _id: string;
  productItemId: string;
  promotionId: string;
  discountPrice?: number;
  productItem?: {
    _id: string;
    SKU: string;
    price: number;
    images: string[];
    product: {
      productName: string;
    };
  };
}

interface PromotionCategory {
  _id: string;
  categoryId: string;
  promotionId: string;
  category?: {
    categoryName: string;
  };
}

// Mock data
const mockPromotions: Promotion[] = [
  {
    _id: '1',
    name: 'Flash Sale Cuối Tuần',
    description: 'Giảm giá sốc cho tất cả sản phẩm thời trang',
    discountRate: 30,
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-31'),
    status: 'active',
    appliedProducts: 15,
    appliedCategories: 3,
    totalUsage: 245,
    totalRevenue: 15600000,
  },
  {
    _id: '2',
    name: 'Khuyến Mãi Sinh Nhật',
    description: 'Ưu đãi đặc biệt nhân dịp sinh nhật shop',
    discountRate: 50,
    startDate: new Date('2024-11-15'),
    endDate: new Date('2024-11-30'),
    status: 'expired',
    appliedProducts: 8,
    appliedCategories: 2,
    totalUsage: 89,
    totalRevenue: 7800000,
  },
  {
    _id: '3',
    name: 'Sale Tết 2025',
    description: 'Chương trình khuyến mãi Tết Nguyên Đán',
    discountRate: 25,
    startDate: new Date('2025-01-15'),
    endDate: new Date('2025-02-15'),
    status: 'scheduled',
    appliedProducts: 0,
    appliedCategories: 0,
    totalUsage: 0,
    totalRevenue: 0,
  },
];

const mockProductItems = [
  {
    _id: 'item1',
    SKU: 'TSN-001-S-RED',
    price: 299000,
    images: ['https://via.placeholder.com/300x300/ff0000'],
    product: { productName: 'Áo thun nam' },
  },
  {
    _id: 'item2',
    SKU: 'TSN-002-M-BLUE',
    price: 350000,
    images: ['https://via.placeholder.com/300x300/0000ff'],
    product: { productName: 'Áo sơ mi nữ' },
  },
];

const mockCategories = [
  { _id: 'cat1', categoryName: 'Thời trang nam' },
  { _id: 'cat2', categoryName: 'Thời trang nữ' },
  { _id: 'cat3', categoryName: 'Phụ kiện' },
];

const PromotionManagement = () => {
  const [form] = Form.useForm();
  const [productForm] = Form.useForm();
  const [categoryForm] = Form.useForm();

  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null,
  );
  const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Transfer component data
  const [productTargetKeys, setProductTargetKeys] = useState<string[]>([]);
  const [categoryTargetKeys, setCategoryTargetKeys] = useState<string[]>([]);

  // Modal hooks
  const {
    isVisible: isModalVisible,
    isEditing,
    openModal,
    closeModal,
  } = useModal();

  const {
    isVisible: isProductModalVisible,
    openModal: openProductModal,
    closeModal: closeProductModal,
  } = useModal();

  const {
    isVisible: isCategoryModalVisible,
    openModal: openCategoryModal,
    closeModal: closeCategoryModal,
  } = useModal();

  // Calculate promotion status
  const getPromotionStatus = (
    promotion: Promotion,
  ): 'active' | 'inactive' | 'expired' | 'scheduled' => {
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);

    if (now < startDate) return 'scheduled';
    if (now > endDate) return 'expired';
    return promotion.status === 'active' ? 'active' : 'inactive';
  };

  // Statistics data
  const statisticsData: StatisticItem[] = useMemo(
    () => [
      {
        title: 'Tổng khuyến mãi',
        value: promotions.length,
        prefix: <GiftOutlined />,
        valueStyle: { color: '#1890ff' },
      },
      {
        title: 'Đang hoạt động',
        value: promotions.filter((p) => getPromotionStatus(p) === 'active')
          .length,
        prefix: <PlayCircleOutlined />,
        valueStyle: { color: '#52c41a' },
      },
      {
        title: 'Đã hết hạn',
        value: promotions.filter((p) => getPromotionStatus(p) === 'expired')
          .length,
        prefix: <CalendarOutlined />,
        valueStyle: { color: '#ff4d4f' },
      },
      {
        title: 'Doanh thu từ KM',
        value: promotions.reduce((sum, p) => sum + (p.totalRevenue || 0), 0),
        prefix: <BarChartOutlined />,
        valueStyle: { color: '#722ed1' },
        formatter: (value) => `${value.toLocaleString('vi-VN')}đ`,
      },
    ],
    [promotions],
  );

  // Table columns
  const columns = [
    {
      title: 'Tên chương trình',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: Promotion) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" className="text-xs">
            ID: {record._id}
          </Text>
        </div>
      ),
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discountRate',
      key: 'discountRate',
      width: 100,
      render: (rate: number) => (
        <div className="text-center">
          <Badge count={`${rate}%`} style={{ backgroundColor: '#ff4d4f' }} />
        </div>
      ),
    },
    {
      title: 'Thời gian',
      key: 'duration',
      width: 180,
      render: (_, record: Promotion) => (
        <div className="text-sm">
          <div>{dayjs(record.startDate).format('DD/MM/YYYY')}</div>
          <div className="text-gray-400">đến</div>
          <div>{dayjs(record.endDate).format('DD/MM/YYYY')}</div>
        </div>
      ),
    },
    {
      title: 'Áp dụng',
      key: 'applied',
      width: 120,
      render: (_, record: Promotion) => (
        <div className="text-center">
          <div className="text-sm">
            <Text type="secondary">{record.appliedProducts || 0} SP</Text>
          </div>
          <div className="text-sm">
            <Text type="secondary">{record.appliedCategories || 0} DM</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Lượt sử dụng',
      dataIndex: 'totalUsage',
      key: 'totalUsage',
      width: 100,
      render: (usage: number) => (
        <Badge
          count={usage || 0}
          showZero
          style={{ backgroundColor: '#1890ff' }}
        />
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      render: (_, record: Promotion) => {
        const status = getPromotionStatus(record);
        const statusConfig = {
          active: { color: 'green', text: 'Đang hoạt động' },
          inactive: { color: 'orange', text: 'Tạm dừng' },
          expired: { color: 'red', text: 'Đã hết hạn' },
          scheduled: { color: 'blue', text: 'Chờ kích hoạt' },
        };
        return (
          <Tag color={statusConfig[status].color}>
            {statusConfig[status].text}
          </Tag>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record: Promotion) => {
        const actions: ActionButton[] = [
          {
            type: 'view',
            tooltip: 'Xem chi tiết',
            onClick: () => handleViewDetail(record),
          },
          {
            type: 'edit',
            tooltip: 'Chỉnh sửa',
            onClick: () => handleEdit(record),
          },
          {
            type: 'delete',
            tooltip: 'Xóa',
            confirmTitle:
              'Bạn có chắc chắn muốn xóa chương trình khuyến mãi này?',
            onClick: () => handleDelete(record._id),
          },
        ];
        return <ActionButtons actions={actions} />;
      },
    },
  ];

  // Event handlers
  const handleViewDetail = useCallback((promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsDetailDrawerVisible(true);
  }, []);

  const handleEdit = useCallback(
    (promotion: Promotion) => {
      setSelectedPromotion(promotion);
      openModal(promotion, true);
      form.setFieldsValue({
        ...promotion,
        dateRange: [dayjs(promotion.startDate), dayjs(promotion.endDate)],
      });
    },
    [form, openModal],
  );

  const handleAddNew = useCallback(() => {
    openModal();
    form.resetFields();
  }, [form, openModal]);

  const handleDelete = useCallback((id: string) => {
    setPromotions((prev) => prev.filter((p) => p._id !== id));
  }, []);

  const handleSavePromotion = async () => {
    try {
      const values = await form.validateFields();
      const [startDate, endDate] = values.dateRange;

      const promotionData = {
        name: values.name,
        description: values.description,
        discountRate: values.discountRate,
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
      };

      if (isEditing && selectedPromotion) {
        setPromotions((prev) =>
          prev.map((p) =>
            p._id === selectedPromotion._id ? { ...p, ...promotionData } : p,
          ),
        );
      } else {
        const newPromotion: Promotion = {
          _id: Date.now().toString(),
          ...promotionData,
          status: 'inactive',
          appliedProducts: 0,
          appliedCategories: 0,
          totalUsage: 0,
          totalRevenue: 0,
        };
        setPromotions((prev) => [...prev, newPromotion]);
      }

      closeModal();
      form.resetFields();
    } catch (error) {
      console.error('Error saving promotion:', error);
    }
  };

  const handleToggleStatus = useCallback((promotion: Promotion) => {
    const newStatus = promotion.status === 'active' ? 'inactive' : 'active';
    setPromotions((prev) =>
      prev.map((p) =>
        p._id === promotion._id ? { ...p, status: newStatus } : p,
      ),
    );
  }, []);

  // Transfer component handlers
  const handleProductTransferChange = (targetKeys: string[]) => {
    setProductTargetKeys(targetKeys);
  };

  const handleCategoryTransferChange = (targetKeys: string[]) => {
    setCategoryTargetKeys(targetKeys);
  };

  const currentPromotionStats: StatisticItem[] = selectedPromotion
    ? [
        {
          title: 'Lượt sử dụng',
          value: selectedPromotion.totalUsage || 0,
          prefix: <TagOutlined />,
        },
        {
          title: 'Doanh thu',
          value: selectedPromotion.totalRevenue || 0,
          prefix: <BarChartOutlined />,
          formatter: (value) => `${value.toLocaleString('vi-VN')}đ`,
        },
        {
          title: 'Sản phẩm áp dụng',
          value: selectedPromotion.appliedProducts || 0,
          prefix: <ShopOutlined />,
        },
        {
          title: 'Danh mục áp dụng',
          value: selectedPromotion.appliedCategories || 0,
          prefix: <PercentageOutlined />,
        },
      ]
    : [];

  return (
    <div className="p-6">
      <PageHeader
        title="Quản lý khuyến mãi"
        actionButton={{
          text: 'Tạo chương trình mới',
          icon: <PlusOutlined />,
          onClick: handleAddNew,
        }}
      />

      <StatisticsCards statistics={statisticsData} />

      <CustomTable
        columns={columns}
        dataSource={promotions}
        loading={false}
        rowKey="_id"
        paginationConfig={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: true,
        }}
      />

      {/* Promotion Form Modal */}
      <CustomModal
        title={
          isEditing ? 'Chỉnh sửa chương trình' : 'Tạo chương trình khuyến mãi'
        }
        open={isModalVisible}
        onCancel={closeModal}
        onSave={handleSavePromotion}
        saveText={isEditing ? 'Cập nhật' : 'Tạo chương trình'}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên chương trình"
                name="name"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên chương trình' },
                ]}
              >
                <Input size="large" placeholder="VD: Flash Sale Cuối Tuần" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tỷ lệ giảm giá (%)"
                name="discountRate"
                rules={[
                  { required: true, message: 'Vui lòng nhập tỷ lệ giảm giá' },
                  {
                    type: 'number',
                    min: 1,
                    max: 100,
                    message: 'Tỷ lệ giảm từ 1% đến 100%',
                  },
                ]}
              >
                <InputNumber
                  size="large"
                  style={{ width: '100%' }}
                  min={1}
                  max={100}
                  suffix="%"
                  placeholder="30"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Mô tả chương trình" name="description">
            <Input.TextArea
              rows={3}
              placeholder="Mô tả ngắn gọn về chương trình khuyến mãi..."
            />
          </Form.Item>

          <Form.Item
            label="Thời gian áp dụng"
            name="dateRange"
            rules={[
              { required: true, message: 'Vui lòng chọn thời gian áp dụng' },
            ]}
          >
            <RangePicker
              size="large"
              style={{ width: '100%' }}
              showTime
              format="DD/MM/YYYY HH:mm"
              placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
            />
          </Form.Item>
        </Form>
      </CustomModal>

      {/* Promotion Detail Drawer */}
      <Drawer
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GiftOutlined className="text-2xl text-blue-500" />
              <div>
                <div className="font-semibold">{selectedPromotion?.name}</div>
                <div className="text-sm text-gray-500">
                  Chi tiết chương trình
                </div>
              </div>
            </div>
            {selectedPromotion && (
              <Button
                type={
                  getPromotionStatus(selectedPromotion) === 'active'
                    ? 'default'
                    : 'primary'
                }
                icon={
                  getPromotionStatus(selectedPromotion) === 'active' ? (
                    <PauseCircleOutlined />
                  ) : (
                    <PlayCircleOutlined />
                  )
                }
                onClick={() => handleToggleStatus(selectedPromotion)}
                disabled={getPromotionStatus(selectedPromotion) === 'expired'}
              >
                {getPromotionStatus(selectedPromotion) === 'active'
                  ? 'Tạm dừng'
                  : 'Kích hoạt'}
              </Button>
            )}
          </div>
        }
        width={1000}
        open={isDetailDrawerVisible}
        onClose={() => setIsDetailDrawerVisible(false)}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Thông tin cơ bản" key="basic">
            <div className="space-y-4">
              <Row gutter={16}>
                <Col span={12}>
                  <Card size="small">
                    <Statistic
                      title="Tỷ lệ giảm giá"
                      value={selectedPromotion?.discountRate}
                      suffix="%"
                      valueStyle={{ color: '#ff4d4f', fontSize: '24px' }}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small">
                    <div className="space-y-2">
                      <Text strong>Trạng thái:</Text>
                      {selectedPromotion && (
                        <Tag
                          color={
                            getPromotionStatus(selectedPromotion) === 'active'
                              ? 'green'
                              : getPromotionStatus(selectedPromotion) ===
                                  'expired'
                                ? 'red'
                                : getPromotionStatus(selectedPromotion) ===
                                    'scheduled'
                                  ? 'blue'
                                  : 'orange'
                          }
                          className="text-sm"
                        >
                          {getPromotionStatus(selectedPromotion) === 'active'
                            ? 'Đang hoạt động'
                            : getPromotionStatus(selectedPromotion) ===
                                'expired'
                              ? 'Đã hết hạn'
                              : getPromotionStatus(selectedPromotion) ===
                                  'scheduled'
                                ? 'Chờ kích hoạt'
                                : 'Tạm dừng'}
                        </Tag>
                      )}
                    </div>
                  </Card>
                </Col>
              </Row>

              <Card size="small">
                <Text strong>Mô tả:</Text>
                <div className="mt-2">
                  {selectedPromotion?.description || 'Chưa có mô tả'}
                </div>
              </Card>

              <Card size="small">
                <Text strong>Thời gian áp dụng:</Text>
                <div className="mt-2 flex items-center gap-4">
                  <div>
                    <Text type="secondary">Bắt đầu:</Text>
                    <div>
                      {selectedPromotion
                        ? dayjs(selectedPromotion.startDate).format(
                            'DD/MM/YYYY HH:mm',
                          )
                        : ''}
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">Kết thúc:</Text>
                    <div>
                      {selectedPromotion
                        ? dayjs(selectedPromotion.endDate).format(
                            'DD/MM/YYYY HH:mm',
                          )
                        : ''}
                    </div>
                  </div>
                </div>

                {selectedPromotion && (
                  <div className="mt-3">
                    <Progress
                      percent={Math.min(
                        ((Date.now() -
                          new Date(selectedPromotion.startDate).getTime()) /
                          (new Date(selectedPromotion.endDate).getTime() -
                            new Date(selectedPromotion.startDate).getTime())) *
                          100,
                        100,
                      )}
                      status={
                        getPromotionStatus(selectedPromotion) === 'expired'
                          ? 'exception'
                          : 'active'
                      }
                      format={(percent) => `${Math.round(percent || 0)}%`}
                    />
                  </div>
                )}
              </Card>
            </div>
          </TabPane>

          <TabPane tab="Sản phẩm áp dụng" key="products">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Title level={5}>Danh sách sản phẩm</Title>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={openProductModal}
                >
                  Thêm sản phẩm
                </Button>
              </div>

              <CustomTable
                columns={[
                  {
                    title: 'Hình ảnh',
                    key: 'image',
                    width: 80,
                    render: () => (
                      <Image
                        width={50}
                        height={50}
                        src="https://via.placeholder.com/50x50"
                        className="rounded object-cover"
                      />
                    ),
                  },
                  {
                    title: 'Tên sản phẩm',
                    key: 'name',
                    render: () => <Text>Áo thun nam cổ tròn</Text>,
                  },
                  {
                    title: 'SKU',
                    key: 'sku',
                    render: () => <Text code>TSN-001-S-RED</Text>,
                  },
                  {
                    title: 'Giá gốc',
                    key: 'price',
                    render: () => <Text>299,000đ</Text>,
                  },
                  {
                    title: 'Giá sau KM',
                    key: 'discountPrice',
                    render: () => (
                      <Text strong style={{ color: '#ff4d4f' }}>
                        209,300đ
                      </Text>
                    ),
                  },
                  {
                    title: 'Thao tác',
                    key: 'action',
                    render: () => (
                      <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                      >
                        Xóa
                      </Button>
                    ),
                  },
                ]}
                dataSource={[]}
                showCard={false}
                size="small"
              />
            </div>
          </TabPane>

          <TabPane tab="Danh mục áp dụng" key="categories">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Title level={5}>Danh sách danh mục</Title>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={openCategoryModal}
                >
                  Thêm danh mục
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {mockCategories.slice(0, 2).map((cat) => (
                  <Card key={cat._id} size="small">
                    <div className="flex justify-between items-center">
                      <Text strong>{cat.categoryName}</Text>
                      <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabPane>

          <TabPane tab="Thống kê" key="statistics">
            <StatisticsCards statistics={currentPromotionStats} span={6} />

            <Row gutter={16} className="mt-6">
              <Col span={12}>
                <Card title="Hiệu suất theo ngày" size="small">
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    Biểu đồ hiệu suất (cần tích hợp thư viện chart)
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Top sản phẩm bán chạy" size="small">
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <Text>Sản phẩm {i}</Text>
                        <Text strong>{(i * 15).toLocaleString()} đơn</Text>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Drawer>

      {/* Product Selection Modal */}
      <CustomModal
        title="Chọn sản phẩm áp dụng khuyến mãi"
        open={isProductModalVisible}
        onCancel={closeProductModal}
        onSave={() => {
          console.log('Selected products:', productTargetKeys);
          closeProductModal();
        }}
        width={800}
      >
        <Transfer
          dataSource={mockProductItems.map((item) => ({
            key: item._id,
            title: `${item.product.productName} (${item.SKU})`,
            description: `Giá: ${item.price.toLocaleString('vi-VN')}đ`,
          }))}
          titles={['Tất cả sản phẩm', 'Sản phẩm được chọn']}
          targetKeys={productTargetKeys}
          onChange={handleProductTransferChange}
          render={(item) => item.title}
          showSearch
          listStyle={{
            width: 350,
            height: 400,
          }}
        />
      </CustomModal>

      {/* Category Selection Modal */}
      <CustomModal
        title="Chọn danh mục áp dụng khuyến mãi"
        open={isCategoryModalVisible}
        onCancel={closeCategoryModal}
        onSave={() => {
          console.log('Selected categories:', categoryTargetKeys);
          closeCategoryModal();
        }}
        width={600}
      >
        <div className="space-y-3">
          {mockCategories.map((cat) => (
            <div
              key={cat._id}
              className="flex items-center p-3 border rounded-lg"
            >
              <Checkbox
                checked={categoryTargetKeys.includes(cat._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setCategoryTargetKeys([...categoryTargetKeys, cat._id]);
                  } else {
                    setCategoryTargetKeys(
                      categoryTargetKeys.filter((id) => id !== cat._id),
                    );
                  }
                }}
              >
                <Text strong>{cat.categoryName}</Text>
              </Checkbox>
            </div>
          ))}
        </div>
      </CustomModal>
    </div>
  );
};

export default PromotionManagement;
