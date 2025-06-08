import React, { useState, useEffect } from 'react';
import { Layout, Menu, Badge, Drawer, Input, Button, Dropdown } from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  HeartOutlined,
  SearchOutlined,
  MenuOutlined,
  DownOutlined,
} from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Search } = Input;

const Header: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Promotional banner messages
  const promotionalMessages = [
    'VOUCHER 10% TỐI ĐA 10K',
    'VOUCHER 30K ĐƠN TỪ 599K',
    'VOUCHER 70K ĐƠN TỪ 899K',
    'VOUCHER 100K ĐƠN TỪ 1199K',
    '🚚 FREESHIP ĐƠN TỪ 399K',
    '⚡ BETTER TOGETHER - MUA CHUNG RẺ HƠN',
  ];

  // Create menu items similar to TORANO website
  const menuItems = [
    {
      key: 'sanpham-moi',
      label: 'Sản phẩm mới',
    },
    {
      key: 'sale',
      label: <span className="text-red-600 font-semibold">Sale</span>,
    },
    {
      key: 'ao-nam',
      label: (
        <span className="flex items-center">
          Áo nam <DownOutlined className="ml-1 text-xs" />
        </span>
      ),
      children: [
        { key: 'ao-so-mi-nam', label: 'Áo sơ mi nam' },
        { key: 'ao-thun-nam', label: 'Áo thun nam' },
        { key: 'ao-polo-nam', label: 'Áo polo nam' },
        { key: 'ao-khoac-nam', label: 'Áo khoác nam' },
      ],
    },
    {
      key: 'quan-nam',
      label: (
        <span className="flex items-center">
          Quần nam <DownOutlined className="ml-1 text-xs" />
        </span>
      ),
      children: [
        { key: 'quan-jean', label: 'Quần jean' },
        { key: 'quan-tay', label: 'Quần tây' },
        { key: 'quan-short', label: 'Quần short' },
        { key: 'quan-kaki', label: 'Quần kaki' },
      ],
    },
    {
      key: 'bo-suu-tap',
      label: (
        <span className="flex items-center">
          Bộ sưu tập <DownOutlined className="ml-1 text-xs" />
        </span>
      ),
      children: [
        { key: 'voyages-ss25', label: 'Voyages SS25' },
        { key: 'kim-ly-collection', label: 'Kim Lý Collection' },
        { key: 'spring-summer', label: 'Spring Summer 2025' },
      ],
    },
    {
      key: 'he-thong-cua-hang',
      label: 'Hệ thống cửa hàng',
    },
    {
      key: 'uu-dai',
      label: 'Ưu đãi',
    },
  ];

  return (
    <>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Promotional Banner */}
      <div className="bg-blue-950 text-white py-6 overflow-hidden relative h-auto">
        <div className="animate-marquee whitespace-nowrap absolute top-1/2 transform -translate-y-1/2">
          <span className="text-xl font-medium space-x-6">
            {promotionalMessages.map((message, index) => (
              <span key={index} className="inline-block mr-10">
                {message}
              </span>
            ))}
          </span>
        </div>
      </div>

      <AntHeader className="!bg-white shadow-sm !py-10 px-4 lg:px-8 h-16 flex items-center justify-between sticky top-0 z-50">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <div className="text-2xl font-bold text-black tracking-wider">
            ✓ TORANO
          </div>
        </div>

        {/* Main Navigation Menu */}
        <Menu
          mode="horizontal"
          items={menuItems}
          className="hidden lg:flex !border-none flex-1 justify-center !text-2xl font-medium "
        />

        <div className="flex items-center space-x-6">
          <Button
            type="text"
            icon={<SearchOutlined className="!text-2xl" />}
            className="hidden md:flex hover:bg-gray-100"
          />

          <Button
            type="text"
            icon={<UserOutlined className="!text-2xl" />}
            className="hidden sm:flex hover:bg-gray-100"
          />

          <Badge count={2} showZero={false} className="relative">
            <Button
              type="text"
              icon={<ShoppingCartOutlined className="!text-2xl" />}
              className="hover:bg-gray-100"
            />
          </Badge>

          <Button
            type="text"
            icon={<MenuOutlined />}
            className="lg:hidden !text-2xl hover:bg-gray-100 ml-4"
            onClick={() => setDrawerVisible(true)}
          />
        </div>

        <Drawer
          title="Menu"
          placement="right"
          closable={true}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={280}
        >
          <Menu mode="vertical" items={menuItems} />
          <div className="mt-4 space-y-2">
            <Search placeholder="Tìm kiếm..." enterButton />
            <Button block icon={<UserOutlined />}>
              Tài khoản
            </Button>
            <Button block icon={<HeartOutlined />}>
              Yêu thích
            </Button>
          </div>
        </Drawer>
      </AntHeader>
    </>
  );
};

export default Header;
