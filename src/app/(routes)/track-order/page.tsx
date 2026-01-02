'use client';

import React, { useState, useEffect, use, useRef } from 'react';
import {
  Card,
  Input,
  Button,
  Steps,
  Empty,
  Spin,
  message,
  Table,
  Tag,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import {
  useGetOrderByUserId,
  useTrackGuestOrderByOrderId,
} from '@/hooks/order';
import { useAppSelector } from '@/redux/store';
import { removeSelectedItems } from '@/redux/cartSlice';
import { getStatusColor, getStatusText } from '@/configs/constants';

const { Step } = Steps;

const TrackOrderPage: React.FC = () => {
  const searchParams = useSearchParams();
  const mapRef = useRef<any>(null);
  const isAuthenticated = useAppSelector((state) => state.auth.isLoggedIn);
  const userId = useAppSelector((state) => state.user._id);
  const [orderData, setOrderData] = useState<any>(null);
  const [orderId, setOrderId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { mutate: trackOrder, isPending: isTracking } =
    useTrackGuestOrderByOrderId();
  const { data: userOrdersData, isLoading: isLoadingUserOrders } =
    useGetOrderByUserId(userId);

  console.log('userOrdersData', userOrdersData);

  useEffect(() => {
    if (!isAuthenticated) {
      const orderIdParam = searchParams.get('orderId');

      if (orderIdParam) {
        setOrderId(orderIdParam);
        handleTrackOrder(orderIdParam);
      } else {
        const lastOrderId = localStorage.getItem('lastGuestOrderId');
        if (lastOrderId) {
          setOrderId(lastOrderId);

          userOrdersData?.forEach((order: any) => {
            if (order.orderId === lastOrderId) {
              order.dispatch(removeSelectedItems([lastOrderId]));
            }
          });
        }
      }
    }
  }, [searchParams, isAuthenticated]);

  const handleTrackOrder = async (orderIdParam?: string) => {
    const trackOrderId = orderIdParam || orderId;

    if (!trackOrderId) {
      message.error('Vui lòng nhập mã đơn hàng');
      return;
    }

    trackOrder(trackOrderId, {
      onSuccess: (response) => {
        setOrderData(response.data);
        localStorage.setItem('lastGuestOrderId', trackOrderId);
      },
      onError: () => {
        setOrderData(null);
      },
    });
  };

  const getOrderStatusStep = (status: string) => {
    const statusMap: { [key: string]: number } = {
      Pending: 0,
      Processing: 1,
      Shipped: 2,
      Delivered: 3,
      Cancelled: -1,
    };
    return statusMap[status] || 0;
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: '_id',
      key: '_id',
      render: (text: string) => <span className="font-mono">{text}</span>,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'orderTotal',
      key: 'orderTotal',
      render: (total: number) => (
        <span className="font-semibold text-red-600">
          {total?.toLocaleString()}đ
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Button
          type="link"
          onClick={() => {
            setSelectedOrder(record);
            mapRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  // Render cho User đã login
  if (isAuthenticated) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <Card title="Danh sách đơn hàng của bạn" className="mb-6">
              {isLoadingUserOrders ? (
                <div className="text-center py-12">
                  <Spin size="large" />
                </div>
              ) : (
                <Table
                  columns={columns}
                  dataSource={userOrdersData?.data || []}
                  rowKey="_id"
                  pagination={{ pageSize: 10 }}
                  locale={{ emptyText: 'Bạn chưa có đơn hàng nào' }}
                />
              )}
            </Card>

            {/* Chi tiết đơn hàng khi click vào */}
            {selectedOrder && (
              <>
                <Card
                  title="Thông tin đơn hàng"
                  ref={mapRef}
                  className=" mt-6!"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã đơn hàng:</span>
                      <span className="font-semibold">{selectedOrder._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tên người nhận:</span>
                      <span className="font-semibold">
                        {selectedOrder.guestName || selectedOrder?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-semibold">
                        {selectedOrder.guestEmail || selectedOrder?.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số điện thoại:</span>
                      <span className="font-semibold">
                        {selectedOrder.guestPhone || selectedOrder?.phone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Địa chỉ giao hàng:</span>
                      <span className="font-semibold text-right ml-4">
                        {selectedOrder.guestShippingAddress}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Phương thức thanh toán:
                      </span>
                      <span className="font-semibold">
                        {selectedOrder.paymentType}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-600">Tổng tiền:</span>
                      <span className="font-bold text-red-600">
                        {selectedOrder.orderTotal?.toLocaleString()}đ
                      </span>
                    </div>
                  </div>
                </Card>

                <Card title="Trạng thái đơn hàng" className="mb-6">
                  <Steps
                    current={getOrderStatusStep(selectedOrder.orderStatus)}
                    status={
                      selectedOrder.orderStatus === 'Cancelled'
                        ? 'error'
                        : 'process'
                    }
                  >
                    <Step title="Đã đặt hàng" description="Chờ xác nhận" />
                    <Step title="Đang xử lý" description="Đang chuẩn bị hàng" />
                    <Step
                      title="Đang giao"
                      description="Đơn hàng đang được vận chuyển"
                    />
                    <Step
                      title="Hoàn thành"
                      description="Đã giao hàng thành công"
                    />
                  </Steps>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="font-semibold text-blue-900 mb-2">
                      Trạng thái hiện tại:{' '}
                      {getStatusText(selectedOrder.orderStatus)}
                    </div>
                  </div>
                </Card>

                <Card title="Sản phẩm đã đặt">
                  <div className="space-y-4">
                    {selectedOrder.orderLines?.map(
                      (line: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-3 border rounded"
                        >
                          <img
                            src={
                              line.productItemId?.images?.[0] ||
                              '/placeholder.png'
                            }
                            alt="Product"
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <div className="font-medium">
                              {line.productItemId?.productId?.productName ||
                                'Sản phẩm'}
                            </div>
                            <div className="text-sm text-gray-500">
                              Số lượng: {line.qty}
                            </div>
                            <div className="font-semibold text-red-600">
                              {line.price?.toLocaleString()}đ
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </Card>

                <Button
                  className="mt-4!"
                  onClick={() => setSelectedOrder(null)}
                >
                  Quay lại danh sách
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render cho Guest (không login)
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card title="Tra cứu đơn hàng" className="mb-6">
            <div className="space-y-4">
              <Input
                size="large"
                placeholder="Nhập mã đơn hàng (Order ID)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                prefix={<SearchOutlined />}
              />
              <Button
                type="primary"
                size="large"
                block
                onClick={() => handleTrackOrder()}
                loading={isTracking}
              >
                Tra cứu đơn hàng
              </Button>
            </div>
          </Card>

          {isTracking && (
            <div className="text-center py-12">
              <Spin size="large" />
            </div>
          )}

          {!isTracking && orderData && (
            <>
              <Card ref={mapRef} title="Thông tin đơn hàng" className="mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã đơn hàng:</span>
                    <span className="font-semibold">
                      {orderData?.order._id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tên người nhận:</span>
                    <span className="font-semibold">
                      {orderData.order.guestName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold">
                      {orderData.order.guestEmail}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số điện thoại:</span>
                    <span className="font-semibold">
                      {orderData.order.guestPhone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Địa chỉ giao hàng:</span>
                    <span className="font-semibold text-right ml-4">
                      {orderData.order.guestShippingAddress}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Phương thức thanh toán:
                    </span>
                    <span className="font-semibold">
                      {orderData.order.paymentType}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600">Tổng tiền:</span>
                    <span className="font-bold text-red-600">
                      {orderData.order.orderTotal?.toLocaleString()}đ
                    </span>
                  </div>
                </div>
              </Card>

              <Card title="Trạng thái đơn hàng" className="mb-6">
                <Steps
                  current={getOrderStatusStep(orderData.order.orderStatus)}
                  status={
                    orderData.order.orderStatus === 'Cancelled'
                      ? 'error'
                      : 'process'
                  }
                >
                  <Step title="Đã đặt hàng" description="Chờ xác nhận" />
                  <Step title="Đang xử lý" description="Đang chuẩn bị hàng" />
                  <Step
                    title="Đang giao"
                    description="Đơn hàng đang được vận chuyển"
                  />
                  <Step
                    title="Hoàn thành"
                    description="Đã giao hàng thành công"
                  />
                </Steps>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="font-semibold text-blue-900 mb-2">
                    Trạng thái hiện tại:{' '}
                    {getStatusText(orderData.order.orderStatus)}
                  </div>
                </div>
              </Card>

              <Card title="Sản phẩm đã đặt">
                <div className="space-y-4">
                  {orderData.orderLines?.map((line: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 border rounded"
                    >
                      <img
                        src={
                          line.productItemId?.images?.[0] || '/placeholder.png'
                        }
                        alt="Product"
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium">
                          {line.productItemId?.productId?.productName ||
                            'Sản phẩm'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Số lượng: {line.qty}
                        </div>
                        <div className="font-semibold text-red-600">
                          {line.price?.toLocaleString()}đ
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {!isTracking && !orderData && orderId && (
            <Card>
              <Empty
                description="Không tìm thấy đơn hàng với thông tin này"
                className="py-8"
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
