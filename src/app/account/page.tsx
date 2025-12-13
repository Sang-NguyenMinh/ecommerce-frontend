'use client';
import React from 'react';
import { Card, Button, Avatar, Divider, Badge, message } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  EditOutlined,
  ShoppingOutlined,
  HeartOutlined,
  HistoryOutlined,
  SettingOutlined,
  GiftOutlined,
  CrownOutlined,
} from '@ant-design/icons';

// Mock user data
const userData = {
  _id: '67fbc3463a14a30bf933064e',
  username: 'Adminnn',
  phone: '+12345678',
  avatar: 'https://example.com/avatar.jpg',
  role: 'Admin',
  createdAt: '2025-04-13T13:59:34.756Z',
};

const AccountPage: React.FC = () => {
  const handleLogout = () => {
    message.loading('Đang đăng xuất...', 0.5).then(() => {
      message.success('Đã đăng xuất thành công!');
      // Logic logout: localStorage.removeItem('token'); router.push('/login');
    });
  };

  const menuItems = [
    {
      icon: <ShoppingOutlined className="text-xl" />,
      title: 'Đơn hàng của tôi',
      description: 'Theo dõi, quản lý đơn hàng',
      badge: 3,
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <HeartOutlined className="text-xl" />,
      title: 'Yêu thích',
      description: 'Sản phẩm đã lưu',
      badge: 12,
      color: 'from-red-500 to-orange-500',
    },
    {
      icon: <HistoryOutlined className="text-xl" />,
      title: 'Lịch sử mua hàng',
      description: 'Xem lại đơn đã mua',
      badge: 0,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <GiftOutlined className="text-xl" />,
      title: 'Voucher của tôi',
      description: 'Mã giảm giá & ưu đãi',
      badge: 5,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: <SettingOutlined className="text-xl" />,
      title: 'Cài đặt tài khoản',
      description: 'Bảo mật & thông tin',
      badge: 0,
      color: 'from-gray-600 to-gray-800',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20 pb-32 px-6">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAxMmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIuNSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

        <div className="max-w-6xl mx-auto relative">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-xl opacity-50"></div>
              <Avatar
                size={140}
                src={userData.avatar}
                icon={<UserOutlined />}
                className="relative border-4 border-white/20 shadow-2xl"
              />
              {userData.role === 'Admin' && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-full shadow-lg">
                  <CrownOutlined className="text-white text-lg" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {userData.username}
              </h1>
              <p className="text-gray-400 text-lg mb-4">{userData.phone}</p>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Badge dot color="gold">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full text-sm font-semibold">
                    {userData.role}
                  </span>
                </Badge>
                <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                  Thành viên từ {new Date(userData.createdAt).getFullYear()}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="large"
                className="bg-white text-black hover:bg-gray-200 border-0 font-semibold h-12 px-6"
              >
                Chỉnh sửa
              </Button>
              <Button
                icon={<LogoutOutlined />}
                size="large"
                onClick={handleLogout}
                className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30 font-semibold h-12 px-6"
              >
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Đơn hàng', value: '24', icon: '🛍️' },
            { label: 'Điểm tích lũy', value: '1,250', icon: '⭐' },
            { label: 'Yêu thích', value: '38', icon: '❤️' },
            { label: 'Voucher', value: '5', icon: '🎁' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 gap-4 pb-12">
          {menuItems.map((item, index) => (
            <Card
              key={index}
              className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 hover:border-gray-600 cursor-pointer transition-all hover:scale-[1.02] overflow-hidden"
              styles={{ body: { padding: 0 } }}
            >
              <div className="p-6 flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white flex-shrink-0`}
                >
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                    {item.badge > 0 && (
                      <Badge
                        count={item.badge}
                        className="[&_.ant-badge-count]:bg-red-500"
                      />
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
                <div className="text-gray-600 text-2xl">›</div>
              </div>
            </Card>
          ))}
        </div>

        {/* VIP Section */}
        <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/30 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl">
                👑
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  Nâng cấp VIP thành viên
                </h3>
                <p className="text-gray-300">
                  Nhận ưu đãi độc quyền, freeship & quà tặng đặc biệt
                </p>
              </div>
            </div>
            <Button
              size="large"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 border-0 text-black font-bold h-12 px-8 hover:scale-105 transition-transform"
            >
              Nâng cấp ngay
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AccountPage;
