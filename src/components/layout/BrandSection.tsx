import React from 'react';
import { Row, Col } from 'antd';
import {
  TruckIcon,
  RefreshCcwIcon,
  HeadphonesIcon,
  CreditCardIcon,
} from 'lucide-react';

const ServiceSection: React.FC = () => {
  const services = [
    {
      icon: <TruckIcon className="w-8 h-8" />,
      title: 'Miễn phí vận chuyển',
      description: 'Áp dụng cho  đơn hàng từ 500k',
    },
    {
      icon: <RefreshCcwIcon className="w-8 h-8" />,
      title: 'Đổi hàng dễ dàng',
      description: '7 ngày đổi hàng vì bất kì lí do gì',
    },
    {
      icon: <HeadphonesIcon className="w-8 h-8" />,
      title: 'Hỗ trợ nhanh chóng',
      description: 'HOTLINE 24/7 : 0964942121',
    },
    {
      icon: <CreditCardIcon className="w-8 h-8" />,
      title: 'Thanh toán đa dạng',
      description: 'Thanh toán khi nhận hàng, Chuyển Khoản, Momo, ZaloPay',
    },
  ];

  return (
    <section className="py-16 px-4 lg:px-8 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-800">
            Dịch Vụ Của Chúng Tôi
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Cam kết mang đến trải nghiệm mua sắm tuyệt vời với các dịch vụ chất
            lượng cao
          </p>
        </div>

        <Row gutter={[32, 32]} justify="center" align="middle">
          {services.map((service, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <div className="flex flex-col justify-center items-center p-6 hover:shadow-lg hover:bg-gray-50 rounded-lg transition-all duration-300">
                <div className=" mb-4 text-blue-600">{service.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-center text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default ServiceSection;
