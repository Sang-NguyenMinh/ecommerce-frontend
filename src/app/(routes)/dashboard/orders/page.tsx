'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  Form,
  Input,
  Select,
  Typography,
  Tag,
  Button,
  Space,
  Descriptions,
  Divider,
  Table,
  Steps,
} from 'antd';
import {
  ShoppingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  TruckOutlined,
  CloseCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  EyeOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Mock hooks - thay thế bằng hooks thực tế của bạn
const useOrders = () => ({
  data: {
    data: [
      {
        _id: '1',
        userId: {
          _id: 'u1',
          username: 'nguyenvana',
          email: 'nguyenvana@gmail.com',
          phone: '0901234567',
        },
        isGuestOrder: false,
        orderStatus: 'Pending',
        paymentType: 'Cash',
        orderTotal: 1500000,
        shippingAddress: {
          address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
        },
        shippingMethodId: {
          name: 'Giao hàng nhanh',
          price: 30000,
        },
        orderLines: [
          {
            _id: 'ol1',
            productItemId: {
              productId: { productName: 'Áo thun nam' },
              SKU: 'SKU001',
            },
            qty: 2,
            price: 250000,
          },
        ],
        createdAt: '2024-12-15T10:30:00Z',
        updatedAt: '2024-12-15T10:30:00Z',
      },
      {
        _id: '2',
        isGuestOrder: true,
        guestName: 'Trần Thị B',
        guestEmail: 'tranthib@gmail.com',
        guestPhone: '0912345678',
        guestShippingAddress: '456 Lê Lợi, Quận 3, TP.HCM',
        orderStatus: 'Confirmed',
        paymentType: 'Online',
        orderTotal: 2500000,
        orderToken: 'TOKEN123456',
        shippingMethodId: {
          name: 'Giao hàng tiết kiệm',
          price: 20000,
        },
        orderLines: [
          {
            _id: 'ol2',
            productItemId: {
              productId: { productName: 'Quần jean nữ' },
              SKU: 'SKU002',
            },
            qty: 1,
            price: 450000,
          },
        ],
        createdAt: '2024-12-14T14:20:00Z',
        updatedAt: '2024-12-15T09:15:00Z',
      },
      {
        _id: '3',
        userId: {
          _id: 'u2',
          username: 'phamvanc',
          email: 'phamvanc@gmail.com',
          phone: '0923456789',
        },
        isGuestOrder: false,
        orderStatus: 'Shipping',
        paymentType: 'Cash',
        orderTotal: 3200000,
        shippingAddress: {
          address: '789 Trần Hưng Đạo, Quận 5, TP.HCM',
        },
        shippingMethodId: {
          name: 'Giao hàng hỏa tốc',
          price: 50000,
        },
        orderLines: [
          {
            _id: 'ol3',
            productItemId: {
              productId: { productName: 'Giày thể thao' },
              SKU: 'SKU003',
            },
            qty: 1,
            price: 1200000,
          },
        ],
        createdAt: '2024-12-13T08:45:00Z',
        updatedAt: '2024-12-16T11:00:00Z',
      },
      {
        _id: '4',
        userId: {
          _id: 'u3',
          username: 'lethid',
          email: 'lethid@gmail.com',
          phone: '0934567890',
        },
        isGuestOrder: false,
        orderStatus: 'Delivered',
        paymentType: 'Online',
        orderTotal: 1800000,
        shippingAddress: {
          address: '321 Võ Văn Tần, Quận 3, TP.HCM',
        },
        shippingMethodId: {
          name: 'Giao hàng nhanh',
          price: 30000,
        },
        orderLines: [
          {
            _id: 'ol4',
            productItemId: {
              productId: { productName: 'Túi xách nữ' },
              SKU: 'SKU004',
            },
            qty: 1,
            price: 890000,
          },
        ],
        createdAt: '2024-12-10T16:20:00Z',
        updatedAt: '2024-12-18T10:30:00Z',
      },
      {
        _id: '5',
        isGuestOrder: true,
        guestName: 'Hoàng Văn E',
        guestEmail: 'hoangvane@gmail.com',
        guestPhone: '0945678901',
        guestShippingAddress: '654 Nguyễn Thái Học, Quận 1, TP.HCM',
        orderStatus: 'Cancelled',
        paymentType: 'Cash',
        orderTotal: 750000,
        orderToken: 'TOKEN789012',
        shippingMethodId: {
          name: 'Giao hàng tiết kiệm',
          price: 20000,
        },
        orderLines: [
          {
            _id: 'ol5',
            productItemId: {
              productId: { productName: 'Mũ snapback' },
              SKU: 'SKU005',
            },
            qty: 3,
            price: 150000,
          },
        ],
        createdAt: '2024-12-12T13:10:00Z',
        updatedAt: '2024-12-13T09:25:00Z',
      },
    ],
  },
  isLoading: false,
});

const useUpdateOrderStatus = () => ({
  mutate: (data) => {
    console.log('Update order status:', data);
  },
  isPending: false,
});

// Components từ custom
const PageHeader = ({ title, actionButton }) => (
  <div className="flex justify-between items-center mb-6">
    <Title level={2} className="m-0">
      {title}
    </Title>
    {actionButton && (
      <Button
        type="primary"
        size="large"
        icon={actionButton.icon}
        onClick={actionButton.onClick}
      >
        {actionButton.text}
      </Button>
    )}
  </div>
);

const StatisticsCards = ({ statistics }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    {statistics.map((stat, index) => (
      <div key={index} className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <Text type="secondary" className="text-sm">
              {stat.title}
            </Text>
            <div className="text-2xl font-bold mt-2" style={stat.valueStyle}>
              {stat.value}
            </div>
          </div>
          <div className="text-3xl" style={stat.valueStyle}>
            {stat.prefix}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const CustomTable = ({ columns, dataSource, loading, rowKey, onChange }) => (
  <div className="bg-white rounded-lg shadow">
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      rowKey={rowKey}
      onChange={onChange}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `Tổng ${total} đơn hàng`,
      }}
      scroll={{ x: 1200 }}
    />
  </div>
);

const CustomModal = ({ title, open, onCancel, children, footer, width }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onCancel}
      />
      <div
        className="relative bg-white rounded-lg shadow-xl max-h-[90vh] overflow-auto"
        style={{ width: width || 800 }}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <Title level={4} className="m-0">
            {title}
          </Title>
          <Button type="text" onClick={onCancel}>
            ✕
          </Button>
        </div>
        <div className="p-6">{children}</div>
        {footer && (
          <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-2 z-10">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

const OrderManagement = () => {
  const [form] = Form.useForm();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [searchText, setSearchText] = useState('');

  const { data: ordersRes, isLoading } = useOrders();
  const { mutate: updateOrderStatus, isPending: isUpdating } =
    useUpdateOrderStatus();

  const handleTableChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
  };

  const transformedOrders = useMemo(() => {
    if (!ordersRes?.data || !Array.isArray(ordersRes.data)) {
      return [];
    }

    return ordersRes.data.map((order) => ({
      ...order,
      customerName: order.isGuestOrder
        ? order.guestName
        : order.userId?.username || 'N/A',
      customerEmail: order.isGuestOrder
        ? order.guestEmail
        : order.userId?.email || 'N/A',
      customerPhone: order.isGuestOrder
        ? order.guestPhone
        : order.userId?.phone || 'N/A',
      shippingAddressText: order.isGuestOrder
        ? order.guestShippingAddress
        : order.shippingAddress?.address || 'N/A',
    }));
  }, [ordersRes]);

  const statisticsData = useMemo(() => {
    const pending = transformedOrders.filter(
      (o) => o.orderStatus === 'Pending',
    ).length;
    const confirmed = transformedOrders.filter(
      (o) => o.orderStatus === 'Confirmed',
    ).length;
    const shipping = transformedOrders.filter(
      (o) => o.orderStatus === 'Shipping',
    ).length;
    const delivered = transformedOrders.filter(
      (o) => o.orderStatus === 'Delivered',
    ).length;

    return [
      {
        title: 'Tổng đơn hàng',
        value: transformedOrders.length,
        prefix: <ShoppingOutlined />,
        valueStyle: { color: '#1890ff' },
      },
      {
        title: 'Chờ xác nhận',
        value: pending,
        prefix: <ClockCircleOutlined />,
        valueStyle: { color: '#fa8c16' },
      },
      {
        title: 'Đang giao',
        value: shipping,
        prefix: <TruckOutlined />,
        valueStyle: { color: '#722ed1' },
      },
      {
        title: 'Hoàn thành',
        value: delivered,
        prefix: <CheckCircleOutlined />,
        valueStyle: { color: '#52c41a' },
      },
    ];
  }, [transformedOrders]);

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'gold',
      Confirmed: 'blue',
      Shipping: 'purple',
      Delivered: 'green',
      Cancelled: 'red',
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      Pending: 'Chờ xác nhận',
      Confirmed: 'Đã xác nhận',
      Shipping: 'Đang giao',
      Delivered: 'Đã giao',
      Cancelled: 'Đã hủy',
    };
    return texts[status] || status;
  };

  const getPaymentTypeText = (type) => {
    return type === 'Cash' ? 'Tiền mặt' : 'Chuyển khoản';
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: '_id',
      key: '_id',
      width: 120,
      render: (text, record) => (
        <div>
          <Text strong>#{text.slice(-6).toUpperCase()}</Text>
          {record.isGuestOrder && (
            <div>
              <Tag color="orange" className="text-xs mt-1">
                Khách vãng lai
              </Tag>
            </div>
          )}
        </div>
      ),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm mã đơn hàng"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 90 }}
            >
              Tìm
            </Button>
            <Button
              onClick={() => clearFilters()}
              size="small"
              style={{ width: 90 }}
            >
              Xóa
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) =>
        record._id.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 200,
      render: (_, record) => (
        <div>
          <div className="flex items-center gap-2">
            <UserOutlined />
            <Text strong>{record.customerName}</Text>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <PhoneOutlined className="text-xs" />
            <Text type="secondary" className="text-xs">
              {record.customerPhone}
            </Text>
          </div>
        </div>
      ),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm tên/SĐT khách hàng"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 90 }}
            >
              Tìm
            </Button>
            <Button
              onClick={() => clearFilters()}
              size="small"
              style={{ width: 90 }}
            >
              Xóa
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) =>
        record.customerName.toLowerCase().includes(value.toLowerCase()) ||
        record.customerPhone.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: 130,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
      filters: [
        { text: 'Chờ xác nhận', value: 'Pending' },
        { text: 'Đã xác nhận', value: 'Confirmed' },
        { text: 'Đang giao', value: 'Shipping' },
        { text: 'Đã giao', value: 'Delivered' },
        { text: 'Đã hủy', value: 'Cancelled' },
      ],
      filteredValue: filteredInfo.orderStatus || null,
      onFilter: (value, record) => record.orderStatus === value,
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentType',
      key: 'paymentType',
      width: 120,
      render: (type) => (
        <Tag color={type === 'Cash' ? 'default' : 'cyan'}>
          {getPaymentTypeText(type)}
        </Tag>
      ),
      filters: [
        { text: 'Tiền mặt', value: 'Cash' },
        { text: 'Chuyển khoản', value: 'Online' },
      ],
      filteredValue: filteredInfo.paymentType || null,
      onFilter: (value, record) => record.paymentType === value,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'orderTotal',
      key: 'orderTotal',
      width: 130,
      render: (total) => (
        <Text strong style={{ color: '#f5222d' }}>
          {total?.toLocaleString('vi-VN')}đ
        </Text>
      ),
      sorter: (a, b) => a.orderTotal - b.orderTotal,
      filters: [
        { text: 'Dưới 1 triệu', value: 'under1m' },
        { text: '1-2 triệu', value: '1to2m' },
        { text: '2-5 triệu', value: '2to5m' },
        { text: 'Trên 5 triệu', value: 'over5m' },
      ],
      filteredValue: filteredInfo.orderTotal || null,
      onFilter: (value, record) => {
        const total = record.orderTotal;
        switch (value) {
          case 'under1m':
            return total < 1000000;
          case '1to2m':
            return total >= 1000000 && total < 2000000;
          case '2to5m':
            return total >= 2000000 && total < 5000000;
          case 'over5m':
            return total >= 5000000;
          default:
            return true;
        }
      },
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => (
        <Text type="secondary">
          {new Date(date).toLocaleDateString('vi-VN')}
        </Text>
      ),
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Chi tiết
          </Button>
          {record.orderStatus !== 'Delivered' &&
            record.orderStatus !== 'Cancelled' && (
              <Button
                type="link"
                size="small"
                onClick={() => handleUpdateStatus(record)}
              >
                Cập nhật
              </Button>
            )}
        </Space>
      ),
    },
  ];

  const handleViewDetail = useCallback((order) => {
    setSelectedOrder(order);
    setIsDetailModalVisible(true);
  }, []);

  const handleUpdateStatus = useCallback(
    (order) => {
      setSelectedOrder(order);
      form.setFieldsValue({
        orderStatus: order.orderStatus,
      });
      setIsStatusModalVisible(true);
    },
    [form],
  );

  const handleSaveStatus = async () => {
    try {
      const values = await form.validateFields();
      updateOrderStatus({
        id: selectedOrder._id,
        status: values.orderStatus,
      });
      setIsStatusModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getOrderStepStatus = (status) => {
    const steps = ['Pending', 'Confirmed', 'Shipping', 'Delivered'];
    const currentIndex = steps.indexOf(status);
    return currentIndex;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader title="Quản lý đơn hàng" />

      <StatisticsCards statistics={statisticsData} />

      <CustomTable
        columns={columns}
        dataSource={transformedOrders}
        loading={isLoading}
        rowKey="_id"
        onChange={handleTableChange}
      />

      {/* Modal Chi tiết đơn hàng */}
      <CustomModal
        title="Chi tiết đơn hàng"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        width={900}
        footer={
          <Button onClick={() => setIsDetailModalVisible(false)}>Đóng</Button>
        }
      >
        {selectedOrder && (
          <div>
            {/* Trạng thái đơn hàng */}
            <Steps
              current={getOrderStepStatus(selectedOrder.orderStatus)}
              status={
                selectedOrder.orderStatus === 'Cancelled' ? 'error' : 'process'
              }
              items={[
                {
                  title: 'Chờ xác nhận',
                  icon: <ClockCircleOutlined />,
                },
                {
                  title: 'Đã xác nhận',
                  icon: <CheckCircleOutlined />,
                },
                {
                  title: 'Đang giao',
                  icon: <TruckOutlined />,
                },
                {
                  title: 'Đã giao',
                  icon: <CheckCircleOutlined />,
                },
              ]}
              className="mb-6"
            />

            <Divider />

            {/* Thông tin khách hàng */}
            <Title level={5}>
              <UserOutlined /> Thông tin khách hàng
            </Title>
            <Descriptions column={2} bordered size="small" className="mb-4">
              <Descriptions.Item label="Họ tên">
                {selectedOrder.customerName}
              </Descriptions.Item>
              <Descriptions.Item label="Loại khách hàng">
                <Tag color={selectedOrder.isGuestOrder ? 'orange' : 'blue'}>
                  {selectedOrder.isGuestOrder ? 'Khách vãng lai' : 'Thành viên'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedOrder.customerEmail}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedOrder.customerPhone}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao hàng" span={2}>
                <EnvironmentOutlined /> {selectedOrder.shippingAddressText}
              </Descriptions.Item>
            </Descriptions>

            {/* Thông tin đơn hàng */}
            <Title level={5}>
              <ShoppingOutlined /> Thông tin đơn hàng
            </Title>
            <Descriptions column={2} bordered size="small" className="mb-4">
              <Descriptions.Item label="Mã đơn hàng">
                #{selectedOrder._id.slice(-6).toUpperCase()}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(selectedOrder.orderStatus)}>
                  {getStatusText(selectedOrder.orderStatus)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                {getPaymentTypeText(selectedOrder.paymentType)}
              </Descriptions.Item>
              <Descriptions.Item label="Phí vận chuyển">
                {selectedOrder.shippingMethodId?.name} -{' '}
                {selectedOrder.shippingMethodId?.price?.toLocaleString('vi-VN')}
                đ
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt hàng">
                {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối">
                {new Date(selectedOrder.updatedAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
            </Descriptions>

            {/* Sản phẩm */}
            <Title level={5}>Sản phẩm</Title>
            <Table
              dataSource={selectedOrder.orderLines}
              pagination={false}
              size="small"
              rowKey="_id"
              columns={[
                {
                  title: 'Sản phẩm',
                  key: 'product',
                  render: (_, record) => (
                    <div>
                      <Text strong>
                        {record.productItemId?.productId?.productName}
                      </Text>
                      <div>
                        <Text type="secondary" className="text-xs">
                          SKU: {record.productItemId?.SKU}
                        </Text>
                      </div>
                    </div>
                  ),
                },
                {
                  title: 'Số lượng',
                  dataIndex: 'qty',
                  key: 'qty',
                  width: 100,
                  align: 'center',
                },
                {
                  title: 'Đơn giá',
                  dataIndex: 'price',
                  key: 'price',
                  width: 150,
                  render: (price) => (
                    <Text>{price?.toLocaleString('vi-VN')}đ</Text>
                  ),
                },
                {
                  title: 'Thành tiền',
                  key: 'total',
                  width: 150,
                  render: (_, record) => (
                    <Text strong>
                      {(record.price * record.qty)?.toLocaleString('vi-VN')}đ
                    </Text>
                  ),
                },
              ]}
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3} align="right">
                      <Text strong>Tổng cộng:</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text strong style={{ color: '#f5222d', fontSize: 16 }}>
                        {selectedOrder.orderTotal?.toLocaleString('vi-VN')}đ
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </div>
        )}
      </CustomModal>

      {/* Modal Cập nhật trạng thái */}
      <CustomModal
        title="Cập nhật trạng thái đơn hàng"
        open={isStatusModalVisible}
        onCancel={() => {
          setIsStatusModalVisible(false);
          form.resetFields();
        }}
        width={500}
        footer={
          <>
            <Button onClick={() => setIsStatusModalVisible(false)}>Hủy</Button>
            <Button
              type="primary"
              onClick={handleSaveStatus}
              loading={isUpdating}
            >
              Cập nhật
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Form form={form} layout="vertical">
            <Form.Item
              label="Trạng thái đơn hàng"
              name="orderStatus"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select size="large" placeholder="Chọn trạng thái">
                <Option value="Pending">
                  <ClockCircleOutlined /> Chờ xác nhận
                </Option>
                <Option value="Confirmed">
                  <CheckCircleOutlined /> Đã xác nhận
                </Option>
                <Option value="Shipping">
                  <TruckOutlined /> Đang giao hàng
                </Option>
                <Option value="Delivered">
                  <CheckCircleOutlined /> Đã giao hàng
                </Option>
                <Option value="Cancelled">
                  <CloseCircleOutlined /> Đã hủy
                </Option>
              </Select>
            </Form.Item>

            <Form.Item label="Ghi chú" name="note">
              <TextArea
                rows={4}
                placeholder="Nhập ghi chú về việc cập nhật trạng thái (tùy chọn)"
              />
            </Form.Item>
          </Form>
        </div>
      </CustomModal>
    </div>
  );
};

export default OrderManagement;
