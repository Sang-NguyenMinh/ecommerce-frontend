import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Badge,
  Drawer,
  Input,
  Button,
  Dropdown,
  Avatar,
  MenuProps,
} from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  MenuOutlined,
  DownOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  SettingOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import CartIcon from '../base/CartIcon';
import { on } from 'events';
const { Header: AntHeader } = Layout;
const { Search } = Input;

const Header: React.FC = () => {
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Mock user data - thay thế bằng data thực từ Redux/Context của bạn
  const user = {
    _id: '67fbc3463a14a30bf933064e',
    username: 'Adminnn',
    phone: '+12345678',
    avatar: 'https://example.com/avatar.jpg',
    role: 'Admin',
    createdAt: '2025-04-13T13:59:34.756Z',
  };

  const isLoggedIn = !!user._id; // Kiểm tra user có đăng nhập không

  const handleLogout = () => {
    // Xử lý logout
    console.log('Logout clicked');
    // router.push('/login');
  };

  const handleLogin = () => {
    // Chuyển đến trang login
    console.log('Login clicked');
    // router.push('/login');
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'profile':
        console.log('View profile');
        // router.push('/profile');
        break;
      case 'orders':
        console.log('View orders');
        // router.push('/orders');
        break;
      case 'settings':
        console.log('View settings');
        // router.push('/settings');
        break;
      case 'logout':
        handleLogout();
        break;
      case 'login':
        handleLogin();
        break;
    }
  };

  const userMenuItems = isLoggedIn
    ? [
        {
          key: 'user-info',
          label: (
            <div className="px-2 py-2 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Avatar
                  size={48}
                  src={user.avatar}
                  icon={<UserOutlined />}
                  className="flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">
                    {user.username}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {user.phone}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">{user.role}</div>
                </div>
              </div>
            </div>
          ),
          disabled: true,
        },
        {
          type: 'divider',
        },
        {
          key: 'profile',
          icon: <UserOutlined />,
          label: 'Thông tin tài khoản',
        },
        {
          key: 'orders',
          icon: <ShoppingOutlined />,
          onClick: () => {
            router.push('/track-order');
          },

          label: 'Đơn hàng của tôi',
        },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: 'Cài đặt',
        },
        {
          type: 'divider',
        },
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: 'Đăng xuất',
          danger: true,
        },
      ]
    : [
        {
          key: 'login',
          icon: <LoginOutlined />,
          label: 'Đăng nhập',
        },
      ];

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
      onClick: () => {
        router.push(`/search?sort=newest`);
      },
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

      <div className="bg-blue-950 text-white py-1.5 sm:py-2 md:py-3 lg:py-4 overflow-hidden relative ">
        <div className="animate-marquee whitespace-nowrap absolute top-1/2 transform -translate-y-1/2 w-full  ">
          <span className="text-xs sm:text-sm md:text-base lg:text-sm font-medium space-x-4 sm:space-x-6">
            {promotionalMessages.map((message, index) => (
              <span key={index} className="mr-4 sm:mr-6 md:mr-8">
                {message}
              </span>
            ))}
          </span>
        </div>
      </div>

      <AntHeader className="!bg-white shadow-sm lg:!px-30 !px-4   max-h-[50px]! sm:min-h-[70px] md:min-h-[80px] flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center x">
          <div
            onClick={() => {
              router.push('/');
            }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-black tracking-wider cursor-pointer"
          >
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
            className="!text-xl "
            icon={
              <SearchOutlined className="text-base sm:text-lg md:text-xl" />
            }
          />

          <Dropdown
            menu={{
              items: userMenuItems as MenuProps['items'],
              onClick: handleMenuClick,
            }}
            trigger={['click']}
            placement="bottomRight"
            overlayClassName="min-w-[280px]"
          >
            <Button type="text" className="!text-xl" icon={<UserOutlined />} />
          </Dropdown>

          <CartIcon />

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
          width={300}
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
