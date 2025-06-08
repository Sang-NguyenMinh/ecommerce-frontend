// components/Home/BrandSection.tsx
import React from 'react';
import { Row, Col } from 'antd';

const BrandSection: React.FC = () => {
  const brands = [
    {
      name: 'Hugo Boss',
      logo: 'https://via.placeholder.com/120x60/000000/FFFFFF?text=HUGO+BOSS',
    },
    {
      name: 'Calvin Klein',
      logo: 'https://via.placeholder.com/120x60/000000/FFFFFF?text=CK',
    },
    {
      name: 'Tommy Hilfiger',
      logo: 'https://via.placeholder.com/120x60/000000/FFFFFF?text=TOMMY',
    },
    {
      name: 'Ralph Lauren',
      logo: 'https://via.placeholder.com/120x60/000000/FFFFFF?text=POLO',
    },
    {
      name: 'Armani',
      logo: 'https://via.placeholder.com/120x60/000000/FFFFFF?text=ARMANI',
    },
    {
      name: 'Zara',
      logo: 'https://via.placeholder.com/120x60/000000/FFFFFF?text=ZARA',
    },
  ];

  return (
    <section className="py-16 px-4 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Thương Hiệu Đối Tác
          </h2>
          <p className="text-gray-600 text-lg">
            Hợp tác cùng những thương hiệu hàng đầu thế giới
          </p>
        </div>

        <Row gutter={[24, 24]} justify="center" align="middle">
          {brands.map((brand, index) => (
            <Col xs={12} md={8} lg={4} key={index}>
              <div className="text-center p-4 hover:scale-105 transition-transform duration-200">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="mx-auto opacity-60 hover:opacity-100 transition-opacity duration-200"
                />
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default BrandSection;
