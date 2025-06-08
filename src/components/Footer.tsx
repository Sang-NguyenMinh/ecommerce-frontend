// components/Layout/Footer.tsx
import React from 'react';
import { Layout, Row, Col, Button, Divider, Typography, Input } from 'antd';
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  RightOutlined,
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const Footer: React.FC = () => {
  const footerLinks = {
    company: ['Về chúng tôi', 'Tuyển dụng', 'Tin tức', 'Liên hệ'],
    support: [
      'Hướng dẫn mua hàng',
      'Chăm sóc khách hàng',
      'Chính sách đổi trả',
      'Bảo hành',
    ],
    policy: [
      'Chính sách bảo mật',
      'Điều khoản sử dụng',
      'Chính sách vận chuyển',
      'Phương thức thanh toán',
    ],
  };

  return (
    <AntFooter className="bg-black text-white overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <Row gutter={[60, 40]}>
          {/* Brand Section */}
          <Col xs={24} lg={8}>
            <div className="space-y-8">
              <div>
                <Title
                  level={1}
                  className="!text-white !mb-4 !font-light tracking-widest"
                >
                  YINSEN
                </Title>
                <Text className="text-gray-300 text-lg font-light leading-relaxed">
                  Thương hiệu thời trang nam hàng đầu Việt Nam, mang đến phong
                  cách lịch lãm và sang trọng.
                </Text>
              </div>

              {/* Newsletter */}
              <div className="space-y-4">
                <Text className="text-red-900 font-medium tracking-wide">
                  ĐĂNG KÝ NHẬN TIN
                </Text>
                <div className="relative">
                  <Input
                    placeholder="Nhập email của bạn"
                    className="bg-transparent border-white border-opacity-30 text-white placeholder-gray-400 py-3 pr-12 focus:border-white hover:border-white"
                    suffix={
                      <Button
                        type="text"
                        icon={<RightOutlined />}
                        className="text-white hover:text-gray-300 p-0"
                      />
                    }
                  />
                </div>
              </div>

              {/* Social Media */}
              <div className="flex space-x-4">
                {[
                  { icon: FacebookOutlined, hover: 'hover:bg-blue-600' },
                  { icon: InstagramOutlined, hover: 'hover:bg-pink-600' },
                  { icon: TwitterOutlined, hover: 'hover:bg-blue-400' },
                  { icon: YoutubeOutlined, hover: 'hover:bg-red-600' },
                ].map((social, index) => (
                  <Button
                    key={index}
                    shape="circle"
                    size="large"
                    icon={<social.icon />}
                    className={`border-white border-opacity-30 text-white bg-transparent hover:text-black transition-all duration-300 ${social.hover}`}
                  />
                ))}
              </div>
            </div>
          </Col>

          {/* Links Sections */}
          <Col xs={24} lg={16}>
            <Row gutter={[40, 40]}>
              {/* Company */}
              <Col xs={12} md={8}>
                <div className="space-y-6">
                  <Title
                    level={5}
                    className="!text-white !mb-0 tracking-wide font-medium"
                  >
                    CÔNG TY
                  </Title>
                  <ul className="space-y-4">
                    {footerLinks.company.map((link, index) => (
                      <li key={index}>
                        <a
                          href="#"
                          className="text-gray-300 hover:text-white transition-colors font-light text-sm tracking-wide"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>

              {/* Support */}
              <Col xs={12} md={8}>
                <div className="space-y-6">
                  <Title
                    level={5}
                    className="!text-white !mb-0 tracking-wide font-medium"
                  >
                    HỖ TRỢ
                  </Title>
                  <ul className="space-y-4">
                    {footerLinks.support.map((link, index) => (
                      <li key={index}>
                        <a
                          href="#"
                          className="text-gray-300 hover:text-white transition-colors font-light text-sm tracking-wide"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>

              {/* Contact */}
              <Col xs={24} md={8}>
                <div className="space-y-6">
                  <Title
                    level={5}
                    className="!text-white !mb-0 tracking-wide font-medium"
                  >
                    LIÊN HỆ
                  </Title>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <EnvironmentOutlined className="text-gray-400 text-sm" />
                      <Text className="text-gray-300 text-sm font-light">
                        123 Nguyễn Huệ, Q.1, TP.HCM
                      </Text>
                    </div>
                    <div className="flex items-center space-x-3">
                      <PhoneOutlined className="text-gray-400 text-sm" />
                      <Text className="text-gray-300 text-sm font-light">
                        1900 1234
                      </Text>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MailOutlined className="text-gray-400 text-sm" />
                      <Text className="text-red-900 text-sm font-light">
                        info@yinsen.com
                      </Text>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-white border-opacity-10">
          <Row justify="space-between" align="middle" gutter={[16, 16]}>
            <Col xs={24} md={12} className="text-center md:text-left">
              <Text className="text-gray-400 text-sm font-light">
                © 2024 YINSEN. Tất cả quyền được bảo lưu.
              </Text>
            </Col>
            <Col xs={24} md={12} className="text-center md:text-right">
              <div className="flex flex-wrap justify-center md:justify-end gap-6">
                {footerLinks.policy.map((link, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-gray-400 hover:text-white text-xs tracking-wide transition-colors"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
