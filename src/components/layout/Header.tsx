import React, { useState } from 'react';
import { Layout, Menu, Badge, Drawer, Input, Button } from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  MenuOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
const { Header: AntHeader } = Layout;
const { Search } = Input;

const Header: React.FC = () => {
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const promotionalMessages = [
    'VOUCHER 10% TỐI ĐA 10K',
    'VOUCHER 30K ĐƠN TỪ 599K',
    'VOUCHER 70K ĐƠN TỪ 899K',
    'VOUCHER 100K ĐƠN TỪ 1199K',
    '🚚 FREESHIP ĐƠN TỪ 399K',
    '⚡ BETTER TOGETHER - MUA CHUNG RẺ HƠN',
  ];

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
        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 25s;
          }
        }
      `}</style>

      <div className="bg-blue-950 text-white py-1.5 sm:py-2 md:py-3 lg:py-5 overflow-hidden relative ">
        <div className="animate-marquee whitespace-nowrap absolute top-1/2 transform -translate-y-1/2 w-full  ">
          <span className="text-xs sm:text-sm md:text-base lg:text-lg font-medium space-x-4 sm:space-x-6">
            {promotionalMessages.map((message, index) => (
              <span key={index} className="mr-4 sm:mr-6 md:mr-8">
                {message}
              </span>
            ))}
          </span>
        </div>
      </div>

      <AntHeader className="!bg-white shadow-sm lg:!px-30 !px-4   min-h-[60px] sm:min-h-[70px] md:min-h-[80px] flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center x">
          <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-black tracking-wider">
            ✓ TORANO
          </div>
        </div>

        <Menu
          mode="horizontal"
          items={menuItems}
          className="hidden !border-none   !text-base !font-medium"
          style={{ minWidth: 0 }}
        />

        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4">
          <Button
            type="text"
            className="!text-xl"
            icon={
              <SearchOutlined className="text-base sm:text-lg md:text-xl" />
            }
          />

          <Button type="text" className="!text-xl" icon={<UserOutlined />} />

          <Badge count={2} showZero={false} className="relative ">
            <Button
              onClick={() => router.push('/payment')}
              type="text"
              icon={
                <ShoppingCartOutlined className="text-base sm:text-lg md:text-xl" />
              }
              className="!text-xl "
            />
          </Badge>

          <Button
            type="text"
            icon={<MenuOutlined className="text-base sm:text-lg md:text-xl" />}
            className="lg:!hidden  p-1 sm:p-1.5 md:p-2"
            onClick={() => setDrawerVisible(true)}
          />
        </div>

        <Drawer
          title={<div className="text-base sm:text-lg font-bold">✓ TORANO</div>}
          placement="right"
          closable={true}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={Math.min(320, window.innerWidth * 0.9)}
          className="lg:hidden"
        >
          <Menu
            mode="vertical"
            items={menuItems}
            className="!border-none mb-4 text-sm sm:text-base"
          />

          <div className="space-y-3 pt-4 border-t border-gray-200">
            <Search
              placeholder="Tìm kiếm..."
              enterButton
              size="middle"
              className="w-full"
            />
            <Button
              block
              icon={<UserOutlined />}
              size="middle"
              className="h-10 sm:h-11 flex items-center justify-center text-sm sm:text-base"
            >
              Tài khoản
            </Button>
          </div>
        </Drawer>
      </AntHeader>
    </>
  );
};

export default Header;
