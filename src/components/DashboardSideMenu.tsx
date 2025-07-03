'use client';
import { Menu, MenuProps } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState, useMemo } from 'react';

const menuKeys = {
  '/dashboard/statistics': '2',
  '/dashboard/categories': '3',
  '/dashboard/products': '4',
  '/dashboard/promotions': '5',
  '/dashboard/orders': '6',
  '/dashboard/users': '7',
  '/dashboard/variations': '8',
  '/dashboard/configurations': '9',
  '/dashboard/product-item': '10',
  '/dashboard': '1',
};

export default function DashboardSideMenu() {
  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = useState(['1']);

  useEffect(() => {
    let matchedKey = '1';

    for (const [path, key] of Object.entries(menuKeys)) {
      if (
        pathname === path ||
        (path !== '/dashboard' && pathname.startsWith(path))
      ) {
        matchedKey = key;
        break;
      }
    }

    setSelectedKey([matchedKey]);
  }, [pathname]);

  const menuItems: MenuProps['items'] = useMemo(
    () => [
      { label: <Link href="/dashboard">Home</Link>, key: '1' },
      { label: <Link href="/dashboard/statistics">Thống kê</Link>, key: '2' },
      { type: 'divider' },
      {
        label: <Link href="/dashboard/categories">Danh mục sản phẩm</Link>,
        key: '3',
      },
      { label: <Link href="/dashboard/products">Sản phẩm</Link>, key: '4' },
      { label: <Link href="/dashboard/promotions">Khuyến mãi</Link>, key: '5' },
      { label: <Link href="/dashboard/orders">Đơn hàng</Link>, key: '6' },
      { type: 'divider' },
      { label: <Link href="/dashboard/users">Khách hàng</Link>, key: '7' },
      { label: <Link href="/dashboard/variations">Biến thể</Link>, key: '8' },
      {
        label: <Link href="/dashboard/configurations">Cấu hình</Link>,
        key: '9',
      },
    ],
    [],
  );

  return (
    <Menu mode="inline" items={menuItems} selectedKeys={selectedKey}></Menu>
  );
}
