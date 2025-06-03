'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  Form,
  Select,
  Typography,
  Tag,
  Tabs,
  Drawer,
  Badge,
  Button,
  Descriptions,
  Steps,
  Timeline,
  Avatar,
  Card,
} from 'antd';
import {
  ShoppingOutlined,
  ClockCircleOutlined,
  TruckOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  UserOutlined,
  EditOutlined,
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
const { TabPane } = Tabs;
const { Step } = Steps;

const mockOrders = [
  {
    _id: 'order1',
    userId: {
      _id: 'user1',
      username: 'Nguyễn Văn An',
      email: 'an@example.com',
      phone: '0123456789',
      avatar: 'https://via.placeholder.com/40x40',
    },
    shippingAddress: {
      address: '123 Đường ABC, Quận 1, TP.HCM',
      isDefault: true,
    },
    shoppingMethodId: {
      name: 'Giao hàng nhanh',
      price: 30000,
    },
    orderStatus: 'PENDING',
    paymentType: 'CASH',
    orderTotal: 599000,
    createdAt: '2024-12-15T10:30:00Z',
    updatedAt: '2024-12-15T10:30:00Z',
    orderLines: [
      {
        _id: 'line1',
        productItemId: {
          _id: 'item1',
          SKU: 'TSN-001-S-RED',
          price: 299000,
          images: ['https://via.placeholder.com/60x60'],
          productId: {
            productName: 'Áo thun nam basic',
            categoryId: { categoryName: 'Áo thun' },
          },
        },
        qty: 2,
        price: 299000,
      },
    ],
  },
  {
    _id: 'order2',
    userId: {
      _id: 'user2',
      username: 'Trần Thị Bình',
      email: 'binh@example.com',
      phone: '0987654321',
      avatar: 'https://via.placeholder.com/40x40',
    },
    shippingAddress: {
      address: '456 Đường XYZ, Quận 3, TP.HCM',
      isDefault: true,
    },
    shoppingMethodId: {
      name: 'Giao hàng tiêu chuẩn',
      price: 20000,
    },
    orderStatus: 'SHIPPED',
    paymentType: 'BANK_TRANSFER',
    orderTotal: 850000,
    createdAt: '2024-12-14T15:20:00Z',
    updatedAt: '2024-12-15T09:15:00Z',
    orderLines: [
      {
        _id: 'line2',
        productItemId: {
          _id: 'item2',
          SKU: 'QJN-002-M-BLUE',
          price: 420000,
          images: ['https://via.placeholder.com/60x60'],
          productId: {
            productName: 'Quần jean nữ',
            categoryId: { categoryName: 'Quần jean' },
          },
        },
        qty: 2,
        price: 420000,
      },
    ],
  },
];

const OrderStatusEnum = {
  PENDING: 'PENDING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

const PaymentTypeEnum = {
  CASH: 'CASH',
  BANK_TRANSFER: 'BANK_TRANSFER',
  MOMO: 'MOMO',
  PAYPAL: 'PAYPAL',
};

const OrderManagement = () => {
  const [form] = Form.useForm();
  const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [orders] = useState(mockOrders); // Thay thế bằng API hook

  // Modal hooks
  const {
    isVisible: isStatusModalVisible,
    openModal: openStatusModal,
    closeModal: closeStatusModal,
  } = useModal();

  // Transform orders data
  const transformedOrders = useMemo(() => {
    return orders.map((order) => ({
      id: order._id,
      customerName: order.userId?.username || 'Khách hàng',
      customerEmail: order.userId?.email || '',
      customerPhone: order.userId?.phone || '',
      customerAvatar: order.userId?.avatar || '',
      shippingAddress: order.shippingAddress?.address || '',
      shippingMethod: order.shoppingMethodId?.name || '',
      shippingCost: order.shoppingMethodId?.price || 0,
      orderStatus: order.orderStatus,
      paymentType: order.paymentType,
      orderTotal: order.orderTotal,
      itemCount: order.orderLines?.length || 0,
      createdAt: new Date(order.createdAt).toLocaleDateString('vi-VN'),
      updatedAt: new Date(order.updatedAt).toLocaleDateString('vi-VN'),
      orderLines: order.orderLines || [],
    }));
  }, [orders]);

  // Statistics data
  const statisticsData: StatisticItem[] = useMemo(
    () => [
      {
        title: 'Tổng đơn hàng',
        value: transformedOrders.length,
        prefix: <ShoppingOutlined />,
        valueStyle: { color: '#1890ff' },
      },
      {
        title: 'Chờ xử lý',
        value: transformedOrders.filter((o) => o.orderStatus === 'PENDING')
          .length,
        prefix: <ClockCircleOutlined />,
        valueStyle: { color: '#faad14' },
      },
      {
        title: 'Đang giao',
        value: transformedOrders.filter((o) => o.orderStatus === 'SHIPPED')
          .length,
        prefix: <TruckOutlined />,
        valueStyle: { color: '#722ed1' },
      },
      {
        title: 'Hoàn thành',
        value: transformedOrders.filter((o) => o.orderStatus === 'DELIVERED')
          .length,
        prefix: <CheckCircleOutlined />,
        valueStyle: { color: '#52c41a' },
      },
    ],
    [transformedOrders],
  );

  // Status mapping
  const getStatusConfig = (status: string) => {
    const configs = {
      PENDING: {
        color: 'orange',
        text: 'Chờ xử lý',
        icon: <ClockCircleOutlined />,
      },
      SHIPPED: { color: 'blue', text: 'Đang giao', icon: <TruckOutlined /> },
      DELIVERED: {
        color: 'green',
        text: 'Đã giao',
        icon: <CheckCircleOutlined />,
      },
      CANCELLED: {
        color: 'red',
        text: 'Đã hủy',
        icon: <CloseCircleOutlined />,
      },
    };
    return configs[status] || configs.PENDING;
  };

  const getPaymentConfig = (paymentType: string) => {
    const configs = {
      CASH: { color: 'green', text: 'Tiền mặt' },
      BANK_TRANSFER: { color: 'blue', text: 'Chuyển khoản' },
      MOMO: { color: 'pink', text: 'MoMo' },
      PAYPAL: { color: 'cyan', text: 'PayPal' },
    };
    return configs[paymentType] || configs.CASH;
  };

  // Table columns
  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (text) => <Text code>{text.slice(-8).toUpperCase()}</Text>,
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.customerAvatar}
            icon={<UserOutlined />}
            size={40}
          />
          <div>
            <Text strong>{record.customerName}</Text>
            <br />
            <Text type="secondary" className="text-xs">
              {record.customerPhone}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'itemCount',
      key: 'itemCount',
      width: 80,
      render: (count) => (
        <Badge count={count} showZero>
          <ShoppingOutlined className="text-lg" />
        </Badge>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'orderTotal',
      key: 'orderTotal',
      width: 120,
      render: (total) => (
        <Text strong className="text-red-600">
          {total?.toLocaleString('vi-VN')}đ
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: 120,
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentType',
      key: 'paymentType',
      width: 120,
      render: (paymentType) => {
        const config = getPaymentConfig(paymentType);
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_, record) => {
        const actions: ActionButton[] = [
          {
            type: 'view',
            tooltip: 'Xem chi tiết',
            onClick: () => handleViewDetail(record),
          },
          {
            type: 'edit',
            tooltip: 'Cập nhật trạng thái',
            onClick: () => handleUpdateStatus(record),
          },
        ];
        return <ActionButtons actions={actions} />;
      },
    },
  ];

  // Event handlers
  const handleViewDetail = useCallback((order) => {
    setSelectedOrder(order);
    setIsDetailDrawerVisible(true);
  }, []);

  const handleUpdateStatus = useCallback(
    (order) => {
      setSelectedOrder(order);
      openStatusModal();
      form.setFieldsValue({ orderStatus: order.orderStatus });
    },
    [form, openStatusModal],
  );

  const handleSaveStatus = async () => {
    try {
      const values = await form.validateFields();
      // API call to update order status
      console.log('Updating order status:', selectedOrder?.id, values);
      closeStatusModal();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getOrderProgress = (status: string) => {
    const statusOrder = ['PENDING', 'SHIPPED', 'DELIVERED'];
    const currentStep = statusOrder.indexOf(status);
    return currentStep >= 0 ? currentStep : 0;
  };

  const getOrderTimeline = () => [
    {
      color: 'blue',
      dot: <ClockCircleOutlined />,
      children: (
        <div>
          <Text strong>Đơn hàng được tạo</Text>
          <br />
          <Text type="secondary">{selectedOrder?.createdAt}</Text>
        </div>
      ),
    },
    ...(selectedOrder?.orderStatus !== 'PENDING'
      ? [
          {
            color: selectedOrder?.orderStatus === 'CANCELLED' ? 'red' : 'green',
            dot:
              selectedOrder?.orderStatus === 'CANCELLED' ? (
                <CloseCircleOutlined />
              ) : (
                <TruckOutlined />
              ),
            children: (
              <div>
                <Text strong>
                  {selectedOrder?.orderStatus === 'CANCELLED'
                    ? 'Đơn hàng bị hủy'
                    : 'Đơn hàng được giao'}
                </Text>
                <br />
                <Text type="secondary">{selectedOrder?.updatedAt}</Text>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Quản lý đơn hàng"
        actionButton={{
          text: 'Xuất báo cáo',
          icon: <DollarOutlined />,
          onClick: () => console.log('Export report'),
        }}
      />

      <StatisticsCards statistics={statisticsData} />

      <CustomTable
        columns={columns}
        dataSource={transformedOrders}
        loading={false}
        rowKey="id"
        paginationConfig={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: true,
        }}
      />

      {/* Status Update Modal */}
      <CustomModal
        title="Cập nhật trạng thái đơn hàng"
        open={isStatusModalVisible}
        onCancel={closeStatusModal}
        onSave={handleSaveStatus}
        saveText="Cập nhật"
        width={400}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Trạng thái đơn hàng"
            name="orderStatus"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select size="large" placeholder="Chọn trạng thái">
              <Option value="PENDING">
                <Tag color="orange" icon={<ClockCircleOutlined />}>
                  Chờ xử lý
                </Tag>
              </Option>
              <Option value="SHIPPED">
                <Tag color="blue" icon={<TruckOutlined />}>
                  Đang giao
                </Tag>
              </Option>
              <Option value="DELIVERED">
                <Tag color="green" icon={<CheckCircleOutlined />}>
                  Đã giao
                </Tag>
              </Option>
              <Option value="CANCELLED">
                <Tag color="red" icon={<CloseCircleOutlined />}>
                  Đã hủy
                </Tag>
              </Option>
            </Select>
          </Form.Item>
        </Form>
      </CustomModal>

      {/* Order Detail Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-3">
            <Avatar
              src={selectedOrder?.customerAvatar}
              icon={<UserOutlined />}
              size={40}
            />
            <div>
              <div className="font-semibold">
                Đơn hàng #{selectedOrder?.id?.slice(-8).toUpperCase()}
              </div>
              <div className="text-sm text-gray-500">
                {selectedOrder?.customerName}
              </div>
            </div>
          </div>
        }
        width={800}
        open={isDetailDrawerVisible}
        onClose={() => setIsDetailDrawerVisible(false)}
        extra={
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleUpdateStatus(selectedOrder)}
          >
            Cập nhật trạng thái
          </Button>
        }
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Chi tiết đơn hàng" key="details">
            <div className="space-y-6">
              {/* Order Progress */}
              <Card>
                <Steps
                  current={getOrderProgress(selectedOrder?.orderStatus)}
                  status={
                    selectedOrder?.orderStatus === 'CANCELLED'
                      ? 'error'
                      : 'process'
                  }
                >
                  <Step title="Chờ xử lý" icon={<ClockCircleOutlined />} />
                  <Step title="Đang giao" icon={<TruckOutlined />} />
                  <Step title="Hoàn thành" icon={<CheckCircleOutlined />} />
                </Steps>
              </Card>

              {/* Customer Info */}
              <Card title="Thông tin khách hàng">
                <Descriptions column={2}>
                  <Descriptions.Item label="Tên khách hàng">
                    {selectedOrder?.customerName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {selectedOrder?.customerEmail}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    {selectedOrder?.customerPhone}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ giao hàng">
                    {selectedOrder?.shippingAddress}
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* Order Items */}
              <Card title="Sản phẩm đặt hàng">
                <div className="space-y-4">
                  {selectedOrder?.orderLines?.map((line, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <img
                        src={
                          line.productItemId?.images?.[0] ||
                          'https://via.placeholder.com/60x60'
                        }
                        alt="product"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <Text strong>
                          {line.productItemId?.productId?.productName}
                        </Text>
                        <br />
                        <Text type="secondary">
                          SKU: {line.productItemId?.SKU}
                        </Text>
                        <br />
                        <Text>Số lượng: {line.qty}</Text>
                      </div>
                      <div className="text-right">
                        <Text strong className="text-red-600">
                          {line.price?.toLocaleString('vi-VN')}đ
                        </Text>
                        <br />
                        <Text type="secondary">
                          Thành tiền:{' '}
                          {(line.price * line.qty)?.toLocaleString('vi-VN')}đ
                        </Text>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Payment Summary */}
              <Card title="Thông tin thanh toán">
                <Descriptions column={1}>
                  <Descriptions.Item label="Phương thức vận chuyển">
                    {selectedOrder?.shippingMethod}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phí vận chuyển">
                    {selectedOrder?.shippingCost?.toLocaleString('vi-VN')}đ
                  </Descriptions.Item>
                  <Descriptions.Item label="Phương thức thanh toán">
                    <Tag
                      color={getPaymentConfig(selectedOrder?.paymentType).color}
                    >
                      {getPaymentConfig(selectedOrder?.paymentType).text}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tổng tiền">
                    <Text strong className="text-red-600 text-lg">
                      {selectedOrder?.orderTotal?.toLocaleString('vi-VN')}đ
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </div>
          </TabPane>

          <TabPane tab="Lịch sử đơn hàng" key="timeline">
            <Timeline items={getOrderTimeline()} />
          </TabPane>
        </Tabs>
      </Drawer>
    </div>
  );
};

export default OrderManagement;
