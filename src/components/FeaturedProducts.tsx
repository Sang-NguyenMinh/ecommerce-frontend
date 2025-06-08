// components/Home/FeaturedProducts.tsx
import React, { useState } from 'react';
import { Card, Row, Col, Button, Tag, Rate } from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  EyeOutlined,
} from '@ant-design/icons';

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
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

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
    {
      id: 4,
      name: 'Giày Oxford Da Thật',
      price: 3200000,
      originalPrice: 3800000,
      image:
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=500&fit=crop',
      rating: 4.7,
      reviews: 203,
      colors: ['#8B4513', '#000000'],
    },
    {
      id: 5,
      name: 'Polo Pique Cotton',
      price: 650000,
      image:
        'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=500&fit=crop',
      rating: 4.5,
      reviews: 67,
      tag: 'Bestseller',
      colors: ['#ffffff', '#000000', '#FF6B6B', '#4ECDC4'],
    },
    {
      id: 6,
      name: 'Thắt Lưng Da Cao Cấp',
      price: 890000,
      image:
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop',
      rating: 4.8,
      reviews: 92,
      colors: ['#8B4513', '#000000'],
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Sale':
        return 'red';
      case 'Hot':
        return 'orange';
      case 'New':
        return 'green';
      case 'Bestseller':
        return 'blue';
      default:
        return 'default';
    }
  };

  return (
    <section className="py-16 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Sản Phẩm Nổi Bật
          </h2>
          <p className="text-gray-600 text-lg">
            Những món đồ được yêu thích nhất
          </p>
        </div>

        <Row gutter={[24, 24]}>
          {products.map((product) => (
            <Col xs={12} md={8} lg={6} key={product.id}>
              <Card
                hoverable
                className="border-0 shadow-lg overflow-hidden h-full"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                cover={
                  <div className="relative h-64 overflow-hidden">
                    <img
                      alt={product.name}
                      src={product.image}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    {product.tag && (
                      <Tag
                        color={getTagColor(product.tag)}
                        className="absolute top-2 left-2 z-10"
                      >
                        {product.tag}
                      </Tag>
                    )}

                    {/* Overlay Actions */}
                    <div
                      className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-2 transition-opacity duration-300 ${
                        hoveredProduct === product.id
                          ? 'opacity-100'
                          : 'opacity-0'
                      }`}
                    >
                      <Button
                        type="primary"
                        shape="circle"
                        icon={<EyeOutlined />}
                      />
                      <Button
                        type="primary"
                        shape="circle"
                        icon={<HeartOutlined />}
                      />
                      <Button
                        type="primary"
                        shape="circle"
                        icon={<ShoppingCartOutlined />}
                      />
                    </div>
                  </div>
                }
              >
                <div className="space-y-2">
                  <h3 className="font-semibold text-base line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center space-x-1">
                    <Rate
                      disabled
                      defaultValue={product.rating}
                      className="text-sm"
                    />
                    <span className="text-gray-500 text-sm">
                      ({product.reviews})
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg text-red-600">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1">
                    {product.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="text-center mt-12">
          <Button type="default" size="large" className="px-8">
            Xem Tất Cả Sản Phẩm
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
