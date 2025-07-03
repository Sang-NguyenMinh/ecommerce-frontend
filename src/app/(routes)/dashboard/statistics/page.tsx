'use client';

import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Statistic,
  Progress,
  Table,
  Tag,
  Select,
  DatePicker,
  List,
  Avatar,
  Rate,
  Badge,
  Tabs,
} from 'antd';
import {
  ShoppingOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  StarOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  FireOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const mockData = {
  overview: {
    totalRevenue: 125450000,
    totalOrders: 1247,
    totalUsers: 3456,
    totalProducts: 234,
    avgOrderValue: 100600,
    conversionRate: 3.2,
    returnRate: 2.1,
    newUsersToday: 45,
  },
  revenueData: [
    { month: 'T1', revenue: 8500000, orders: 156, users: 234 },
    { month: 'T2', revenue: 9200000, orders: 178, users: 267 },
    { month: 'T3', revenue: 10100000, orders: 198, users: 298 },
    { month: 'T4', revenue: 11300000, orders: 234, users: 345 },
  ],
  orderStatus: [
    { name: 'Chờ xử lý', value: 45, color: '#faad14' },
    { name: 'Đã giao', value: 234, color: '#52c41a' },
    { name: 'Đang giao', value: 67, color: '#1890ff' },
    { name: 'Đã hủy', value: 23, color: '#ff4d4f' },
  ],
  topProducts: [
    {
      id: '1',
      name: 'iPhone 15 Pro Max',
      sold: 145,
      revenue: 34500000,
      stock: 23,
      image: 'https://via.placeholder.com/50x50/87CEEB',
      category: 'Điện thoại',
      rating: 4.8,
    },
    {
      id: '2',
      name: 'MacBook Air M2',
      sold: 89,
      revenue: 26700000,
      stock: 12,
      image: 'https://via.placeholder.com/50x50/98FB98',
      category: 'Laptop',
      rating: 4.6,
    },
    {
      id: '3',
      name: 'AirPods Pro',
      sold: 234,
      revenue: 14040000,
      stock: 78,
      image: 'https://via.placeholder.com/50x50/FFB6C1',
      category: 'Phụ kiện',
      rating: 4.7,
    },
  ],
  categories: [
    { name: 'Điện thoại', value: 35, color: '#1890ff' },
    { name: 'Laptop', value: 25, color: '#52c41a' },
    { name: 'Phụ kiện', value: 20, color: '#faad14' },
    { name: 'Tablet', value: 15, color: '#722ed1' },
    { name: 'Khác', value: 5, color: '#f759ab' },
  ],
  recentOrders: [
    {
      id: 'ORD001',
      customer: 'Nguyễn Văn A',
      total: 2340000,
      status: 'delivered',
      date: '2024-06-03 10:30',
      items: 3,
    },
    {
      id: 'ORD002',
      customer: 'Trần Thị B',
      total: 1890000,
      status: 'shipped',
      date: '2024-06-03 09:15',
      items: 2,
    },
    {
      id: 'ORD003',
      customer: 'Lê Văn C',
      total: 890000,
      status: 'pending',
      date: '2024-06-03 08:45',
      items: 1,
    },
  ],
  topCustomers: [
    {
      id: '1',
      name: 'Nguyễn Thị D',
      orders: 12,
      spent: 15600000,
      level: 'VIP',
      avatar: 'https://via.placeholder.com/40x40/87CEEB',
    },
    {
      id: '2',
      name: 'Trần Văn E',
      orders: 8,
      spent: 12300000,
      level: 'Gold',
      avatar: 'https://via.placeholder.com/40x40/98FB98',
    },
  ],
  lowStockProducts: [
    { name: 'MacBook Air M2', stock: 3, threshold: 10 },
    { name: 'iPhone 15', stock: 5, threshold: 15 },
    { name: 'iPad Pro', stock: 2, threshold: 8 },
  ],
};

const DashboardStatistics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      shipped: 'blue',
      delivered: 'green',
      cancelled: 'red',
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Chờ xử lý',
      shipped: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy',
    };
    return texts[status] || status;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const topProductColumns = [
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (_, record) => (
        <Space>
          <Avatar src={record.image} size={40} />
          <div>
            <div className="font-medium">{record.name}</div>
            <Text type="secondary" className="text-xs">
              {record.category}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Đã bán',
      dataIndex: 'sold',
      key: 'sold',
      render: (value) => <Text strong>{value}</Text>,
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value) => <Text strong>{formatCurrency(value)}</Text>,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      render: (value) => (
        <Badge
          count={value}
          style={{
            backgroundColor:
              value < 10 ? '#ff4d4f' : value < 30 ? '#faad14' : '#52c41a',
          }}
        />
      ),
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (value) => (
        <Rate disabled defaultValue={value} allowHalf className="text-xs" />
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Title level={2} className="mb-2">
          <BarChartOutlined className="mr-3" />
          Dashboard Thống Kê
        </Title>
        <div className="flex justify-between items-center">
          <Text type="secondary">Tổng quan hiệu suất kinh doanh</Text>
          <Space>
            <Select
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              style={{ width: 120 }}
            >
              <Select.Option value="7days">7 ngày</Select.Option>
              <Select.Option value="30days">30 ngày</Select.Option>
              <Select.Option value="90days">90 ngày</Select.Option>
            </Select>
            <RangePicker />
          </Space>
        </div>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Tổng quan" key="overview">
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tổng doanh thu"
                  value={mockData.overview.totalRevenue}
                  formatter={(value) => formatCurrency(value)}
                  prefix={<DollarOutlined className="text-green-500" />}
                  valueStyle={{ color: '#52c41a' }}
                />
                <div className="flex items-center mt-2">
                  <RiseOutlined className="text-green-500 mr-1" />
                  <Text className="text-green-500 text-xs">
                    +12.5% so với tháng trước
                  </Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tổng đơn hàng"
                  value={mockData.overview.totalOrders}
                  prefix={<ShoppingOutlined className="text-blue-500" />}
                  valueStyle={{ color: '#1890ff' }}
                />
                <div className="flex items-center mt-2">
                  <RiseOutlined className="text-green-500 mr-1" />
                  <Text className="text-green-500 text-xs">
                    +8.2% so với tháng trước
                  </Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Khách hàng"
                  value={mockData.overview.totalUsers}
                  prefix={<UserOutlined className="text-purple-500" />}
                  valueStyle={{ color: '#722ed1' }}
                />
                <div className="flex items-center mt-2">
                  <RiseOutlined className="text-green-500 mr-1" />
                  <Text className="text-green-500 text-xs">
                    +15.3% so với tháng trước
                  </Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Sản phẩm"
                  value={mockData.overview.totalProducts}
                  prefix={<ShoppingCartOutlined className="text-orange-500" />}
                  valueStyle={{ color: '#fa8c16' }}
                />
                <div className="flex items-center mt-2">
                  <RiseOutlined className="text-green-500 mr-1" />
                  <Text className="text-green-500 text-xs">
                    +5.1% so với tháng trước
                  </Text>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} lg={16}>
              <Card title="Biểu đồ doanh thu theo tháng" className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockData.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(value),
                        'Doanh thu',
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#1890ff"
                      fill="#1890ff"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Trạng thái đơn hàng" className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockData.orderStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {mockData.orderStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Giá trị đơn hàng TB"
                  value={mockData.overview.avgOrderValue}
                  formatter={(value) => formatCurrency(value)}
                  valueStyle={{ color: '#13c2c2' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Tỷ lệ chuyển đổi"
                  value={mockData.overview.conversionRate}
                  suffix="%"
                  valueStyle={{ color: '#52c41a' }}
                />
                <Progress
                  percent={mockData.overview.conversionRate}
                  showInfo={false}
                  strokeColor="#52c41a"
                  className="mt-2"
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Tỷ lệ hoàn trả"
                  value={mockData.overview.returnRate}
                  suffix="%"
                  valueStyle={{ color: '#faad14' }}
                />
                <Progress
                  percent={mockData.overview.returnRate}
                  showInfo={false}
                  strokeColor="#faad14"
                  className="mt-2"
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Sản phẩm" key="products">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card
                title={
                  <>
                    <FireOutlined className="mr-2" />
                    Top sản phẩm bán chạy
                  </>
                }
              >
                <Table
                  columns={topProductColumns}
                  dataSource={mockData.topProducts}
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Phân bố danh mục" className="mb-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={mockData.categories}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                    >
                      {mockData.categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card
                title={
                  <>
                    <WarningOutlined className="mr-2 text-red-500" />
                    Sản phẩm sắp hết hàng
                  </>
                }
              >
                <List
                  dataSource={mockData.lowStockProducts}
                  renderItem={(item) => (
                    <List.Item>
                      <div className="w-full">
                        <div className="flex justify-between items-center">
                          <Text strong className="text-sm">
                            {item.name}
                          </Text>
                          <Badge
                            count={item.stock}
                            style={{ backgroundColor: '#ff4d4f' }}
                          />
                        </div>
                        <Progress
                          percent={(item.stock / item.threshold) * 100}
                          showInfo={false}
                          strokeColor="#ff4d4f"
                          size="small"
                          className="mt-1"
                        />
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Đơn hàng" key="orders">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card
                title={
                  <>
                    <ClockCircleOutlined className="mr-2" />
                    Đơn hàng gần đây
                  </>
                }
              >
                <List
                  dataSource={mockData.recentOrders}
                  renderItem={(order) => (
                    <List.Item>
                      <div className="w-full">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Text strong>#{order.id}</Text>
                            <br />
                            <Text className="text-sm">{order.customer}</Text>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {formatCurrency(order.total)}
                            </div>
                            <Tag
                              color={getStatusColor(order.status)}
                              className="mt-1"
                            >
                              {getStatusText(order.status)}
                            </Tag>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{order.date}</span>
                          <span>{order.items} sản phẩm</span>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Biểu đồ đơn hàng theo tháng" className="mb-4">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={mockData.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#1890ff" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card
                title={
                  <>
                    <StarOutlined className="mr-2 text-yellow-500" />
                    Khách hàng VIP
                  </>
                }
              >
                <List
                  dataSource={mockData.topCustomers}
                  renderItem={(customer) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={customer.avatar} />}
                        title={
                          <div className="flex items-center gap-2">
                            <span>{customer.name}</span>
                            <Tag
                              color={
                                customer.level === 'VIP' ? 'gold' : 'silver'
                              }
                            >
                              {customer.level}
                            </Tag>
                          </div>
                        }
                        description={
                          <div>
                            <div>{customer.orders} đơn hàng</div>
                            <div className="font-medium text-green-600">
                              {formatCurrency(customer.spent)}
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DashboardStatistics;
