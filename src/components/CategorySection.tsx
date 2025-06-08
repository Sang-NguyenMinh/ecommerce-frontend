// components/Home/CategorySection.tsx
import React from 'react';
import { Card, Row, Col } from 'antd';

const CategorySection: React.FC = () => {
  const categories = [
    {
      id: 1,
      title: 'Áo Sơ Mi',
      image:
        'https://images.unsplash.com/photo-1602810316693-3667c854239a?w=400&h=300&fit=crop',
      count: '120+ sản phẩm',
    },
    {
      id: 2,
      title: 'Quần Tây',
      image:
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=300&fit=crop',
      count: '85+ sản phẩm',
    },
    {
      id: 3,
      title: 'Áo Khoác',
      image:
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop',
      count: '60+ sản phẩm',
    },
    {
      id: 4,
      title: 'Giày Da',
      image:
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
      count: '45+ sản phẩm',
    },
  ];

  return (
    <section className="py-16 px-4 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Danh Mục Sản Phẩm
          </h2>
          <p className="text-gray-600 text-lg">
            Khám phá bộ sưu tập đa dạng dành cho phái mạnh 10%
          </p>
        </div>

        <Row gutter={[24, 24]}>
          {categories.map((category) => (
            <Col xs={12} md={6} key={category.id}>
              <Card
                hoverable
                cover={
                  <div className="h-48 overflow-hidden">
                    <img
                      alt={category.title}
                      src={category.image}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                }
                className="text-center border-0 shadow-lg"
              >
                <Card.Meta
                  title={
                    <span className="text-lg font-semibold">
                      {category.title}
                    </span>
                  }
                  description={
                    <span className="text-gray-500">{category.count}</span>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default CategorySection;
