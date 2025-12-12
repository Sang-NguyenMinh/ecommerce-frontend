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
  Row,
  Col,
  message,
  Checkbox,
  Image,
  Empty,
} from 'antd';
import {
  TruckOutlined,
  DollarOutlined,
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import {
  selectCartItems,
  removeFromCart,
  updateQuantity,
  clearCart,
  removeSelectedItems,
} from '@/redux/cartSlice';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { useCreateShopOrder } from '@/hooks/order';
import { useUserAddress } from '@/hooks/user-address';
import { provinceApi } from '@/services/ProvinceAPI';

const { Option } = Select;

enum PaymentTypeEnum {
  CASH = 'Cash',
  BANK_TRANSFER = 'Bank Transfer',
  MOMO = 'MoMo',
  PAYPAL = 'PayPal',
}

const PaymentPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const { mutate: createShopOrder, isPending: isCreating } =
    useCreateShopOrder();

  const cartItems = useAppSelector(selectCartItems);
  const user = useAppSelector((state: any) => state.user);

  console.log('user2', user);

  const { data: address } = useUserAddress();

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');

  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const data = await provinceApi.getProvinces();
        setProvinces(data);
      } catch (error) {
        message.error('Không thể tải danh sách tỉnh thành');
      }
    };
    loadProvinces();
  }, []);

  // Auto-fill form when address data is available
  useEffect(() => {
    const fillAddressData = async () => {
      if (address?.data && address.data.length > 0) {
        const firstAddress = address.data[0];
        console.log('firstAddress', firstAddress);
        try {
          form.setFieldsValue({
            fullName: firstAddress.recipientName,
            phone: firstAddress.phoneNumber,
            address: firstAddress.address,
            email: user.email,
          });

          const provinceMatch = provinces.find(
            (p) => p.name === firstAddress.city || p.code === firstAddress.city,
          );

          if (provinceMatch) {
            setSelectedProvince(provinceMatch.code);
            form.setFieldsValue({ province: provinceMatch.code });

            const districtData = await provinceApi.getDistricts(
              provinceMatch.code,
            );
            setDistricts(districtData);

            const districtMatch = districtData.find(
              (d) =>
                d.name === firstAddress.district ||
                d.code === firstAddress.district,
            );

            if (districtMatch) {
              setSelectedDistrict(districtMatch.code);
              form.setFieldsValue({ district: districtMatch.code });

              const wardData = await provinceApi.getWards(districtMatch.code);
              setWards(wardData);

              const wardMatch = wardData.find(
                (w) =>
                  w.name === firstAddress.ward || w.code === firstAddress.ward,
              );

              if (wardMatch) {
                form.setFieldsValue({ ward: wardMatch.code });
              }
            }
          }
        } catch (error) {
          console.error('Error filling address data:', error);
          message.error('Không thể tải đầy đủ thông tin địa chỉ');
        }
      }
    };

    if (provinces.length > 0 && address?.data && address.data.length > 0) {
      fillAddressData();
    }
  }, [address, form, provinces]);

  const handleProvinceChange = async (value: string) => {
    setSelectedProvince(value);
    setSelectedDistrict('');
    setDistricts([]);
    setWards([]);

    form.setFieldsValue({ district: undefined, ward: undefined });

    try {
      const districtData = await provinceApi.getDistricts(value);
      setDistricts(districtData);
    } catch (error) {
      message.error('Không thể tải danh sách quận huyện');
    }
  };

  const handleDistrictChange = async (value: string) => {
    setSelectedDistrict(value);
    setWards([]);

    form.setFieldsValue({ ward: undefined });
    try {
      const wardData = await provinceApi.getWards(value);
      setWards(wardData);
    } catch (error) {
      message.error('Không thể tải danh sách phường xã');
    }
  };

  const [loading, setLoading] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] =
    useState<PaymentTypeEnum>(PaymentTypeEnum.CASH);
  const [voucherCode, setVoucherCode] = useState('');
  const [isVoucherApplied, setIsVoucherApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [selectAll, setSelectAll] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    console.log('Cart items:', cartItems);
    setSelectedItems(new Set(cartItems.map((item) => item._id)));
  }, [cartItems]);

  const subtotal = cartItems
    .filter((item) => selectedItems.has(item._id))
    .reduce((sum, item) => sum + item.productItemId.price * item.qty, 0);

  const shippingFee = subtotal >= 200000 ? 0 : 30000;
  const total = subtotal - discount + shippingFee;

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedItems(new Set(cartItems.map((item) => item._id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
    setSelectAll(newSelected.size === cartItems.length);
  };

  const handleDeleteAll = () => {
    dispatch(clearCart());
    setSelectedItems(new Set());
  };

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    dispatch(updateQuantity({ itemId, quantity: newQty }));
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart(itemId));
    const newSelected = new Set(selectedItems);
    newSelected.delete(itemId);
    setSelectedItems(newSelected);
  };

  const applyVoucher = () => {
    if (voucherCode.trim()) {
      if (voucherCode.toUpperCase() === 'DISCOUNT50K') {
        setDiscount(50000);
        setIsVoucherApplied(true);
        message.success('Áp dụng voucher thành công! Giảm 50,000đ');
      } else if (voucherCode.toUpperCase() === 'DISCOUNT100K') {
        setDiscount(100000);
        setIsVoucherApplied(true);
        message.success('Áp dụng voucher thành công! Giảm 100,000đ');
      } else {
        message.error('Mã voucher không hợp lệ');
      }
    }
  };

  const handleSubmitOrder = async (values: any) => {
    console.log('values', values);

    if (selectedItems.size === 0) {
      message.error('Vui lòng chọn ít nhất một sản phẩm để đặt hàng');
      return;
    }

    // Helper functions để convert code sang name
    const getProvinceName = () => {
      const province = provinces.find((p) => p.code === values.province);
      return province?.name || values.province;
    };

    const getDistrictName = () => {
      const district = districts.find((d) => d.code === values.district);
      return district?.name || values.district;
    };

    const getWardName = () => {
      const ward = wards.find((w) => w.code === values.ward);
      return ward?.name || values.ward;
    };

    // Chuẩn bị dữ liệu order items
    const orderItems = cartItems
      .filter((item) => selectedItems.has(item._id))
      .map((item) => ({
        productItemId: item.productItemId._id,
        qty: item.qty,
        price: item.productItemId.price,
      }));

    // Lấy tên thay vì code
    const provinceName = getProvinceName();
    const districtName = getDistrictName();
    const wardName = getWardName();

    // Chuẩn bị địa chỉ giao hàng đầy đủ với NAME
    const fullAddress = `${values.address}, ${wardName}, ${districtName}, ${provinceName}`;

    // Tạo payload tùy theo user đã đăng nhập hay chưa
    let orderPayload: any;

    if (user && user._id) {
      // USER ORDER
      orderPayload = {
        isGuestOrder: false,
        userId: user._id,
        orderItems,
        paymentType: selectedPaymentType,
        shippingMethodId: '507f1f77bcf86cd799439011',
        note: values.note,
      };

      // Nếu user chưa có address, gửi thông tin từ form
      if (!address?.data || address.data.length === 0) {
        orderPayload.recipientName = values.fullName;
        orderPayload.phoneNumber = values.phone;
        orderPayload.address = values.address;
        orderPayload.city = provinceName; // Gửi NAME thay vì CODE
        orderPayload.district = districtName; // Gửi NAME thay vì CODE
        orderPayload.ward = wardName; // Gửi NAME thay vì CODE
      } else {
        // User đã có address - dùng address mặc định
        orderPayload.shippingAddress = address.data[0]._id;
      }

      // Thêm email để nhận thông báo
      if (values.email) {
        orderPayload.guestEmail = values.email;
      }
    } else {
      // GUEST ORDER
      orderPayload = {
        isGuestOrder: true,
        guestEmail: values.email,
        guestPhone: values.phone,
        guestName: values.fullName,
        guestShippingAddress: fullAddress, // Đã chứa NAME
        orderItems,
        paymentType: selectedPaymentType,
        shippingMethodId: '507f1f77bcf86cd799439011',
        note: values.note,
      };
    }

    console.log('Order payload:', orderPayload);

    // Gọi API tạo đơn hàng
    createShopOrder(orderPayload, {
      onSuccess: (response) => {
        console.log('Order response:', response);

        if (response.data.order._id) {
          localStorage.setItem(
            'lastGuestOrder',
            JSON.stringify({
              orderId: response.data.order._id,
            }),
          );
        }

        // Xóa các item đã đặt hàng khỏi giỏ
        const orderedItemIds = Array.from(selectedItems);
        dispatch(removeSelectedItems(orderedItemIds));

        // Redirect về trang thành công
        setTimeout(() => {
          if (response.data.order?.isGuestOrder) {
            router.push(`/track-order?orderId=${response.data.order._id}`);
          } else {
            router.push(`/track-order`);
          }
        }, 1500);
      },
      onError: (error: any) => {
        console.error('Error creating order:', error);
      },
    });
  };

  if (cartItems.length === 0) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gray-50 py-6">
          <div className="container mx-auto px-4 lg:!w-[80%]">
            <Card>
              <Empty
                description="Giỏ hàng của bạn đang trống"
                className="py-12"
              >
                <Button type="primary" onClick={() => router.push('/')}>
                  Tiếp tục mua sắm
                </Button>
              </Empty>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="container mx-auto px-4 lg:!w-[80%]">
          <Row gutter={24}>
            <Col lg={12} md={24}>
              <Card title="Thông tin đặt hàng" className="mb-6">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmitOrder}
                >
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
                          {
                            pattern: /^[0-9]{10,11}$/,
                            message: 'Số điện thoại không hợp lệ',
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
                    rules={[
                      { required: true, message: 'Vui lòng nhập địa chỉ' },
                    ]}
                  >
                    <Input
                      placeholder="Địa chỉ (ví dụ: 103 Văn Phúc, phường Văn Phúc)"
                      size="large"
                    />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        name="province"
                        label="Tỉnh/Thành phố"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng chọn tỉnh/thành phố',
                          },
                        ]}
                      >
                        <Select
                          placeholder="Chọn tỉnh/thành phố"
                          onChange={handleProvinceChange}
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            `${option?.children}`
                              ?.toLowerCase()
                              .includes(input.toLowerCase())
                          }
                        >
                          {provinces.map((province) => (
                            <Option key={province.code} value={province.code}>
                              {province.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="district"
                        label="Quận/Huyện"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng chọn quận/huyện',
                          },
                        ]}
                      >
                        <Select
                          placeholder="Chọn quận/huyện"
                          onChange={handleDistrictChange}
                          disabled={!selectedProvince}
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            `${option?.children}`
                              ?.toLowerCase()
                              .includes(input.toLowerCase())
                          }
                        >
                          {districts.map((district) => (
                            <Option key={district.code} value={district.code}>
                              {district.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="ward"
                        label="Phường/Xã"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng chọn phường/xã',
                          },
                        ]}
                      >
                        <Select
                          placeholder="Chọn phường/xã"
                          disabled={!selectedDistrict}
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            `${option?.children}`
                              ?.toLowerCase()
                              .includes(input.toLowerCase())
                          }
                        >
                          {wards.map((ward) => (
                            <Option key={ward.code} value={ward.code}>
                              {ward.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item name="note">
                    <Input
                      placeholder="Ghi chú thêm (Ví dụ: Giao hàng giờ hành chính)"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item name="callOtherPerson" valuePropName="checked">
                    <Checkbox>Gọi cho người khác nhận hàng (nếu có)</Checkbox>
                  </Form.Item>
                </Form>
              </Card>

              <Card title="Hình thức thanh toán">
                <Radio.Group
                  value={selectedPaymentType}
                  onChange={(e) => setSelectedPaymentType(e.target.value)}
                  className="w-full"
                >
                  <div className="space-y-3">
                    <Radio
                      value={PaymentTypeEnum.CASH}
                      className="w-full !py-2"
                    >
                      <div className="flex items-center">
                        <TruckOutlined className="mr-2" />
                        <span className="font-medium">
                          Thanh toán khi nhận hàng (COD)
                        </span>
                      </div>
                    </Radio>

                    <Radio
                      value={PaymentTypeEnum.BANK_TRANSFER}
                      className="w-full p-4"
                    >
                      <div className="flex items-center">
                        <DollarOutlined className="mr-2" />
                        <span className="font-medium">
                          Chuyển khoản ngân hàng
                        </span>
                      </div>
                    </Radio>
                  </div>
                </Radio.Group>
              </Card>
            </Col>

            <Col lg={12} md={24}>
              <Card title="Giỏ hàng">
                <div className="mb-4 flex justify-between items-center">
                  <Checkbox
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  >
                    <span className="text-blue-600 font-medium">
                      TẤT CẢ SẢN PHẨM ({cartItems.length})
                    </span>
                  </Checkbox>
                  <button
                    className="text-red-500 hover:text-red-600 font-medium"
                    onClick={handleDeleteAll}
                  >
                    XÓA TẤT CẢ
                  </button>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-2 space-x-3 p-3 border rounded-lg"
                    >
                      <Checkbox
                        checked={selectedItems.has(item._id)}
                        onChange={(e) =>
                          handleSelectItem(item._id, e.target.checked)
                        }
                      />
                      <Image
                        src={
                          item.productItemId.productId.thumbnail ||
                          item.productItemId.images[0]
                        }
                        alt={item.productItemId.productId.productName}
                        width={100}
                        height={100}
                        className="rounded object-cover"
                        preview={true}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm leading-tight mb-2">
                          {item.productItemId.productId.productName}
                        </h4>
                        <div className="text-xs text-gray-500 mb-2">
                          {item.selectedColor && `${item.selectedColor}`}
                          {item.selectedColor && item.selectedSize && ' / '}
                          {item.selectedSize && `${item.selectedSize}`}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="small"
                              icon={<MinusOutlined />}
                              onClick={() =>
                                handleUpdateQuantity(item._id, item.qty - 1)
                              }
                              disabled={item.qty <= 1}
                            />
                            <span className="px-2 font-medium">{item.qty}</span>
                            <Button
                              size="small"
                              icon={<PlusOutlined />}
                              onClick={() =>
                                handleUpdateQuantity(item._id, item.qty + 1)
                              }
                            />
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-red-600">
                              {item.productItemId.price.toLocaleString()}đ
                            </div>
                            <Button
                              type="text"
                              size="small"
                              icon={<DeleteOutlined />}
                              onClick={() => handleRemoveItem(item._id)}
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

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <GiftOutlined className="!text-xl" />
                    <Input
                      placeholder="Nhập mã voucher (DISCOUNT50K / DISCOUNT100K)"
                      value={voucherCode}
                      onChange={(e) =>
                        setVoucherCode(e.target.value.toUpperCase())
                      }
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
                  {isVoucherApplied && (
                    <div className="mt-2 text-green-600 text-sm">
                      ✓ Voucher đã được áp dụng
                    </div>
                  )}
                </div>

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
                    <div className="flex justify-between">
                      <span>Phí giao hàng:</span>
                      <span
                        className={shippingFee === 0 ? 'text-green-600' : ''}
                      >
                        {shippingFee === 0
                          ? 'Miễn phí'
                          : `${shippingFee.toLocaleString()}đ`}
                      </span>
                    </div>
                    {subtotal < 200000 && subtotal > 0 && (
                      <div className="text-xs text-orange-600">
                        Mua thêm {(200000 - subtotal).toLocaleString()}đ để được
                        freeship
                      </div>
                    )}

                    <Divider className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-red-600">
                        {total.toLocaleString()}đ
                      </span>
                    </div>
                  </div>

                  <Button
                    type="primary"
                    size="large"
                    className="w-full mt-4 bg-black hover:bg-gray-800 border-black"
                    loading={isCreating}
                    onClick={() => form.submit()}
                    disabled={selectedItems.size === 0}
                  >
                    ĐẶT HÀNG ({selectedItems.size} SẢN PHẨM)
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
    </div>
  );
};

export default PaymentPage;
