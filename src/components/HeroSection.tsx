// components/Home/HeroSection.tsx
import React from 'react';
import { Button, Carousel } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const HeroSection: React.FC = () => {
  const slides = [
    {
      id: 1,
      title: 'Bộ Sưu Tập Thu Đông 2024',
      subtitle: 'Phong cách lịch lãm cho quý ông hiện đại',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop',
      ctaText: 'Khám phá ngay',
    },
    {
      id: 2,
      title: 'Ưu Đại Lên Đến 50%',
      subtitle: 'Các sản phẩm thời trang cao cấp',
      image:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop',
      ctaText: 'Mua sắm ngay',
    },
    {
      id: 3,
      title: 'Phong Cách Công Sở',
      subtitle: 'Tự tin trong mọi cuộc họp',
      image:
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&h=600&fit=crop',
      ctaText: 'Xem bộ sưu tập',
    },
  ];

  return (
    <section className="relative">
      <Carousel autoplay dots={{ className: 'custom-dots' }}>
        {slides.map((slide) => (
          <div key={slide.id} className="relative">
            <div
              className="h-[500px] lg:h-[600px] bg-cover bg-center relative"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-2xl px-4">
                  <h2 className="text-3xl lg:text-5xl font-bold mb-4">
                    {slide.title}
                  </h2>
                  <p className="text-lg lg:text-xl mb-8 opacity-90">
                    {slide.subtitle}
                  </p>
                  <Button
                    type="primary"
                    size="large"
                    className="bg-white text-black hover:bg-gray-100 border-white"
                    icon={<ArrowRightOutlined />}
                  >
                    {slide.ctaText}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default HeroSection;
