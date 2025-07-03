import React from 'react';
import { Button } from 'antd';
import Section from './ui/Section';
import ProductItem from './ProductItem';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  tag?: string;
  colors: string[];
}

const FeaturedProducts: React.FC = () => {
  const products: Product[] = [
    {
      id: 1,
      name: 'Áo Sơ Mi Oxford Premium',
      price: 899000,
      originalPrice: 1200000,
      image:
        'https://images.unsplash.com/photo-1602810316693-3667c854239a?w=400&h=500&fit=crop',
      rating: 4.8,
      reviews: 124,
      tag: 'Sale',
      colors: ['#ffffff', '#87CEEB', '#E6E6FA'],
    },
    {
      id: 2,
      name: 'Quần Tây Slim Fit',
      price: 1290000,
      image:
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop',
      rating: 4.6,
      reviews: 89,
      tag: 'Hot',
      colors: ['#000000', '#36454F', '#8B4513'],
    },
    {
      id: 3,
      name: 'Áo Blazer Linen',
      price: 2590000,
      image:
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
      rating: 4.9,
      reviews: 156,
      tag: 'New',
      colors: ['#36454F', '#8B4513', '#000000'],
    },
  ];

  return (
    <Section
      heading="Sản Phẩm Nổi Bật"
      title="Những món đồ được yêu thích bán chạy nhất"
      className="!bg-gray-50"
    >
      <div className="flex flex-wrap justify-center gap-10">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} onClick={() => {}} />
        ))}
      </div>
      <div className="text-center mt-12">
        <Button type="default" size="large" className="px-8">
          Xem Tất Cả Sản Phẩm
        </Button>
      </div>
    </Section>
  );
};

export default FeaturedProducts;
