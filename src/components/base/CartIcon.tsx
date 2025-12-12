'use client';

import React from 'react';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import { useAppSelector } from '@/redux/store';
import { selectCartItemsCount } from '@/redux/cartSlice';
import { useRouter } from 'next/navigation';

const CartIcon: React.FC = () => {
  const router = useRouter();
  const totalItems = useAppSelector(selectCartItemsCount);

  return (
    <Badge count={totalItems} offset={[0, 0]} className="cursor-pointer">
      <div
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
        onClick={() => router.push('/shop-order')}
      >
        <ShoppingCartOutlined className="text-2xl" />
      </div>
    </Badge>
  );
};

export default CartIcon;
