import React from 'react';
import { Layout, Row, Col, Button, Typography, Input } from 'antd';
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  TikTokOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  SendOutlined,
  CrownOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const { Footer: AntFooter } = Layout;
const { Title, Text, Paragraph } = Typography;

const Footer: React.FC = () => {
  const footerLinks = {
    company: [
      { name: 'About YINSEN', href: '#' },
      { name: 'Our Story', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press & Media', href: '#' },
      { name: 'Store Locations', href: '#' },
    ],
    support: [
      { name: 'Size Guide', href: '#' },
      { name: 'Customer Care', href: '#' },
      { name: 'Return & Exchange', href: '#' },
      { name: 'Shipping Info', href: '#' },
      { name: 'Care Instructions', href: '#' },
    ],
    collections: [
      { name: 'New Arrivals', href: '#' },
      { name: 'Premium Collection', href: '#' },
      { name: 'Business Wear', href: '#' },
      { name: 'Casual Style', href: '#' },
      { name: 'Accessories', href: '#' },
    ],
    policy: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Payment Security', href: '#' },
    ],
  };

  const socialMediaLinks = [
    {
      icon: FacebookOutlined,
      color: 'hover:bg-blue-600',
      label: 'Facebook',
      followers: '120K',
    },
    {
      icon: InstagramOutlined,
      color:
        'hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-600 hover:to-orange-400',
      label: 'Instagram',
      followers: '250K',
    },
    {
      icon: TwitterOutlined,
      color: 'hover:bg-sky-500',
      label: 'X (Twitter)',
      followers: '85K',
    },
    {
      icon: YoutubeOutlined,
      color: 'hover:bg-red-600',
      label: 'YouTube',
      followers: '95K',
    },
    {
      icon: TikTokOutlined,
      color: 'hover:bg-black',
      label: 'TikTok',
      followers: '180K',
    },
  ];

  return (
    <AntFooter className="!bg-gradient-to-br !from-slate-900 !via-slate-800 !to-slate-900  !p-0 relative overflow-hidden">
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Row gutter={[48, 48]}>
            <Col xs={24} lg={6}>
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <CrownOutlined className="text-white text-xl" />
                  </div>
                  <Title level={2} className="!text-white !mb-0   ">
                    YINSEN
                  </Title>
                </div>

                <Paragraph className="!text-gray-300 ">
                  Redefining men's fashion with premium quality, contemporary
                  designs, and unmatched craftsmanship since 2018.
                </Paragraph>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <HeartOutlined className="!text-blue-400 text-lg" />
                    <Text className="!text-blue-400">STAY UPDATE</Text>
                  </div>
                  <div className="flex flex-col space-y-3">
                    <Input
                      placeholder="Enter your email address"
                      className="!bg-gray-300  !border-white/20 !text-gray-700 custom-placeholder !py-3 !px-4 !rounded-lg hover:!border-blue-400 focus:!border-blue-400"
                      suffix={
                        <Button
                          type="text"
                          icon={<SendOutlined />}
                          className="!text-blue-400 hover:!text-blue-500"
                        />
                      }
                    />
                    <Text className="!text-gray-400 !text-xs">
                      Get exclusive offers, new arrivals & style tips
                    </Text>
                  </div>
                </div>

                <div className="space-y-4">
                  <Text className="!text-white tracking-wider">
                    FOLLOW OUR JOURNEY
                  </Text>
                  <div className="flex flex-wrap gap-3">
                    {socialMediaLinks.map((social, index) => (
                      <div key={index} className="group relative">
                        <Button
                          shape="circle"
                          size="large"
                          icon={<social.icon className="text-lg" />}
                          className={`!border-white/20 !text-gray-300 !bg-white/10 hover:!text-white ${social.color} !transition-all !duration-300 transform hover:scale-110 hover:!border-transparent backdrop-blur-sm`}
                        />
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {social.followers}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={24} lg={18}>
              <Row gutter={[32, 32]}>
                <Col xs={12} sm={6}>
                  <div className="space-y-5">
                    <Title
                      level={5}
                      className="!text-white !mb-0  tracking-widest border-b border-blue-300 pb-2"
                    >
                      COMPANY
                    </Title>
                    <ul className="space-y-3">
                      {footerLinks.company.map((link, index) => (
                        <li key={index}>
                          <Link
                            href={link.href}
                            className="!text-gray-300 hover:text-blue-400 hover:translate-x-1 transition-all duration-200 text-sm flex items-center group"
                          >
                            <span className="w-0 group-hover:w-2 h-px bg-blue-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Col>

                <Col xs={12} sm={6}>
                  <div className="space-y-5">
                    <Title
                      level={5}
                      className="!text-white !mb-0  tracking-widest border-b border-blue-300 pb-2"
                    >
                      SUPPORT
                    </Title>
                    <ul className="space-y-3">
                      {footerLinks.support.map((link, index) => (
                        <li key={index}>
                          <Link
                            href={link.href}
                            className="!text-gray-300 hover:text-blue-400 hover:translate-x-1 transition-all duration-200 text-sm flex items-center group"
                          >
                            <span className="w-0 group-hover:w-2 h-px bg-blue-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Col>

                <Col xs={12} sm={6}>
                  <div className="space-y-5">
                    <Title
                      level={5}
                      className="!text-white !mb-0  tracking-widest border-b border-blue-300 pb-2"
                    >
                      COLLECTIONS
                    </Title>
                    <ul className="space-y-3">
                      {footerLinks.collections.map((link, index) => (
                        <li key={index}>
                          <Link
                            href={link.href}
                            className="!text-gray-300 hover:text-blue-400 hover:translate-x-1 transition-all duration-200 text-sm flex items-center group"
                          >
                            <span className="w-0 group-hover:w-2 h-px bg-blue-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Col>

                <Col xs={12} sm={6}>
                  <div className="space-y-5">
                    <Title
                      level={5}
                      className="!text-white !mb-0  tracking-widest border-b border-blue-300 pb-2"
                    >
                      CONTACT
                    </Title>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 group">
                        <EnvironmentOutlined className="!text-blue-400 mt-1 group-hover:scale-110 transition-transform duration-200" />
                        <div>
                          <Text className="!text-gray-300  block">
                            123 Nguyen Hue Street
                          </Text>
                          <Text className="!text-gray-300">
                            District 1, Ho Chi Minh City
                          </Text>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 group">
                        <PhoneOutlined className="!text-blue-400 group-hover:scale-110 transition-transform duration-200" />
                        <Text className="!text-gray-300  ">1900 1234</Text>
                      </div>
                      <div className="flex items-center space-x-3 group">
                        <MailOutlined className="!text-blue-400 group-hover:scale-110 transition-transform duration-200" />
                        <Text className="!text-gray-300   ">
                          hello@yinsen.com
                        </Text>
                      </div>
                      <div className="pt-2">
                        <Text className="!text-gray-400 ">
                          Mon - Sat: 9:00 AM - 10:00 PM
                          <br />
                          Sunday: 10:00 AM - 9:00 PM
                        </Text>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>

        <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Row justify="space-between" align="middle" gutter={[16, 16]}>
              <Col xs={24} md={12} className="text-center md:text-left">
                <Text className="!text-gray-400 text-sm">
                  © 2025 YINSEN Fashion. Crafted with{' '}
                  <HeartOutlined className="!text-blue-400 mx-1" />
                  in Vietnam
                </Text>
              </Col>
              <Col xs={24} md={12} className="text-center md:text-right">
                <div className="flex flex-wrap justify-center md:justify-end gap-6">
                  {footerLinks.policy.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      className="!text-gray-400 hover:!text-blue-400"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
