'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Radio,
  Divider,
  Typography,
  Row,
  Col,
  message,
  Checkbox,
  Image,
} from 'antd';
import {
  TruckOutlined,
  DollarOutlined,
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  GiftOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

enum PaymentTypeEnum {
  CASH = 'Cash',
  BANK_TRANSFER = 'Bank Transfer',
  MOMO = 'MoMo',
  PAYPAL = 'PayPal',
}

interface CartItem {
  _id: string;
  productItemId: {
    _id: string;
    productId: {
      productName: string;
      thumbnail?: string;
    };
    SKU: string;
    price: number;
    images: string[];
  };
  qty: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface UserAddress {
  _id: string;
  address: string;
  isDefault: boolean;
}

const PaymentPage: React.FC = () => {
  const [form] = Form.useForm();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] =
    useState<PaymentTypeEnum>(PaymentTypeEnum.CASH);
  const [voucherCode, setVoucherCode] = useState('');
  const [isVoucherApplied, setIsVoucherApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Mock data giống như trong hình
  useEffect(() => {
    setCartItems([
      {
        _id: '1',
        productItemId: {
          _id: 'prod1',
          productId: {
            productName: 'Áo Singlet chạy bộ Advanced Vent Tech Graphic Pixel',
            thumbnail:
              'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/June2025/ao-polo-pique-premium-11-den_52.jpg',
          },
          SKU: 'SINGLET-PIXEL-VANG-XL',
          price: 219000,
          images: [
            'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/June2025/ao-polo-pique-premium-11-den_52.jpg',
          ],
        },
        qty: 1,
        selectedColor: 'Vàng',
        selectedSize: 'XL',
      },
      {
        _id: '2',
        productItemId: {
          _id: 'prod2',
          productId: {
            productName: 'Áo Polo nam Premium Piqué',
            thumbnail:
              'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/June2025/ao-polo-pique-premium-11-den_52.jpg',
          },
          SKU: 'POLO-PREMIUM-DEN-L',
          price: 399000,
          images: [
            'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/June2025/ao-polo-pique-premium-11-den_52.jpg',
          ],
        },
        qty: 1,
        selectedColor: 'Đen',
        selectedSize: 'L',
      },
    ]);
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.productItemId.price * item.qty,
    0,
  );
  const total = subtotal - discount;

  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === itemId ? { ...item, qty: newQty } : item,
      ),
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== itemId));
  };

  const applyVoucher = () => {
    if (voucherCode.trim()) {
      setDiscount(50000);
      setIsVoucherApplied(true);
      message.success('Áp dụng voucher thành công!');
    }
  };

  const handleSubmitOrder = async (values: any) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      message.success('Đặt hàng thành công!');
    } catch (error) {
      message.error('Đặt hàng thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4 lg:!w-[80%]">
        <Row gutter={24}>
          <Col lg={12} md={24}>
            <Card title="Thông tin đặt hàng" className="mb-6 ">
              <Form form={form} layout="vertical" onFinish={handleSubmitOrder}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Họ và tên"
                      name="fullName"
                      rules={[
                        { required: true, message: 'Vui lòng nhập họ tên' },
                      ]}
                    >
                      <Input placeholder="Nhập họ tên của bạn" size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Số điện thoại"
                      name="phone"
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập số điện thoại',
                        },
                      ]}
                    >
                      <Input
                        placeholder="Nhập số điện thoại của bạn"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email' },
                    { type: 'email', message: 'Email không hợp lệ' },
                  ]}
                >
                  <Input
                    placeholder="Theo dõi đơn hàng sẽ được gửi qua Email và ZNS"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Địa chỉ"
                  name="address"
                  rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                >
                  <Input
                    placeholder="Địa chỉ (ví dụ: 103 Văn Phúc, phường Văn Phúc)"
                    size="large"
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      label="Tỉnh/Thành phố"
                      name="province"
                      rules={[
                        { required: true, message: 'Chọn tỉnh/thành phố' },
                      ]}
                    >
                      <Select placeholder="Hồ Chí Minh" size="large">
                        <Option value="hcm">Hồ Chí Minh</Option>
                        <Option value="hanoi">Hà Nội</Option>
                        <Option value="danang">Đà Nẵng</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="Quận/Huyện"
                      name="district"
                      rules={[{ required: true, message: 'Chọn quận/huyện' }]}
                    >
                      <Select placeholder="Chọn Quận/Huyện" size="large">
                        <Option value="q1">Quận 1</Option>
                        <Option value="q3">Quận 3</Option>
                        <Option value="q7">Quận 7</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="Phường/Xã"
                      name="ward"
                      rules={[{ required: true, message: 'Chọn phường/xã' }]}
                    >
                      <Select placeholder="Chọn Phường/Xã" size="large">
                        <Option value="p1">Phường 1</Option>
                        <Option value="p2">Phường 2</Option>
                        <Option value="p3">Phường 3</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Input
                    placeholder="Ghi chú thêm (Ví dụ: Giao hàng giờ hành chính)"
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Checkbox>Gọi cho người khác nhận hàng (nếu có)</Checkbox>
                </Form.Item>
              </Form>
            </Card>

            {/* Hình thức thanh toán */}
            <Card title="Hình thức thanh toán">
              <Radio.Group
                value={selectedPaymentType}
                onChange={(e) => setSelectedPaymentType(e.target.value)}
                className="w-full"
              >
                <div className="space-y-3">
                  <Radio value={PaymentTypeEnum.CASH} className="w-full !py-2 ">
                    <div className="flex items-center">
                      <TruckOutlined className="mr-2" />
                      <span className="font-medium">
                        Thanh toán khi nhận hàng
                      </span>
                    </div>
                  </Radio>

                  <Radio
                    value={PaymentTypeEnum.BANK_TRANSFER}
                    className="w-full p-4 "
                  >
                    <div className="flex items-center">
                      <DollarOutlined className="mr-2" />
                      <span className="font-medium">
                        COD thanh toán khi nhận hàng
                      </span>
                    </div>
                  </Radio>
                </div>
              </Radio.Group>
            </Card>
          </Col>

          {/* Giỏ hàng */}
          <Col lg={12} md={24}>
            <Card title="Giỏ hàng">
              <div className="mb-4">
                <Checkbox defaultChecked>
                  <span className="text-blue-600">TẤT CẢ SẢN PHẨM</span>
                </Checkbox>
                <span className="float-right text-gray-500">XÓA TẤT CẢ</span>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-2 space-x-3 p-3 border rounded-lg"
                  >
                    <Checkbox defaultChecked />
                    <Image
                      src={item.productItemId.productId.thumbnail}
                      alt={item.productItemId.productId.productName}
                      width={100}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm leading-tight mb-2">
                        {item.productItemId.productId.productName}
                      </h4>
                      <div className="text-xs text-gray-500 mb-2">
                        {item.selectedColor} / {item.selectedSize}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="small"
                            icon={<MinusOutlined />}
                            onClick={() =>
                              updateQuantity(item._id, item.qty - 1)
                            }
                          />
                          <span className="px-2">{item.qty}</span>
                          <Button
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={() =>
                              updateQuantity(item._id, item.qty + 1)
                            }
                          />
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {item.productItemId.price.toLocaleString()}đ
                          </div>
                          <Button
                            type="text"
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => removeItem(item._id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Voucher Section */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <GiftOutlined className="!text-xl" />
                  <Input
                    placeholder="Chưa dùng voucher"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    disabled={isVoucherApplied}
                    className="flex-1"
                  />
                  <Button
                    type="primary"
                    onClick={applyVoucher}
                    disabled={isVoucherApplied || !voucherCode.trim()}
                  >
                    Áp dụng
                  </Button>
                </div>
              </div>

              {/* Tổng tiền */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Thành tiền:</span>
                    <span className="font-semibold">
                      {subtotal.toLocaleString()}đ
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá:</span>
                      <span>-{discount.toLocaleString()}đ</span>
                    </div>
                  )}
                  <div className="flex justify-between ">
                    <span>Phí giao hàng</span>
                    <span>{discount.toLocaleString()}đ</span>
                  </div>

                  <Divider className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tạm tính</span>
                    <span className="text-red-600">
                      {total.toLocaleString()}đ
                    </span>
                  </div>
                </div>

                <Button
                  type="primary"
                  size="large"
                  className="w-full mt-4 bg-black hover:bg-gray-800 border-black"
                  loading={loading}
                  onClick={() => form.submit()}
                  disabled={cartItems.length === 0}
                >
                  ĐẶT HÀNG
                </Button>
              </div>

              <div className="text-xs text-gray-500 mt-3 text-center">
                Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ
                047438473
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PaymentPage;
