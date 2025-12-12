'use client';

import React, { useRef } from 'react';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useProductItems } from '@/hooks/product-item';
import ProductItem from '../ProductItem';

interface RelatedProductsProps {
  categoryId?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ categoryId }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: productItems, isLoading } = useProductItems({
    categoryId,
    pageSize: 10,
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (isLoading || !productItems?.data?.length) {
    return null;
  }

  const products = productItems.data.map((item: any) => {
    const colorConfig = item.configurations?.find(
      (config: any) =>
        config.variationOptionId?.variationId?.name === 'Màu sắc',
    );

    const sizeConfig = item.configurations?.find(
      (config: any) =>
        config.variationOptionId?.variationId?.name === 'Kích thước',
    );

    return {
      id: item._id,
      name: item.productId?.productName || 'Sản phẩm',
      price: item.price,
      image: item.images?.[0] || item.productId?.thumbnails?.[0] || '',
      rating: 4.5,
      reviews: 0,
      colors: colorConfig?.variationOptionId?.value
        ? [colorConfig.variationOptionId.value]
        : [],
      sizes: sizeConfig?.variationOptionId?.name
        ? [sizeConfig.variationOptionId.name]
        : [],
    };
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Sản phẩm cùng danh mục</h2>
        <div className="flex gap-2">
          <Button
            icon={<LeftOutlined />}
            onClick={() => scroll('left')}
            shape="circle"
          />
          <Button
            icon={<RightOutlined />}
            onClick={() => scroll('right')}
            shape="circle"
          />
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-64">
            <ProductItem product={product} onClick={() => {}} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
