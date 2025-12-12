import React from 'react';
import { Button, Carousel } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const HeroSection = () => {
  const slides = [
    {
      id: 1,
      title: 'Bộ Sưu Tập Thu Đông 2024',
      subtitle: 'Phong cách lịch lãm cho quý ông hiện đại',
      image:
        'https://res.cloudinary.com/ddrrh2cxt/image/upload/v1764078989/download_uhorwl.jpg',
      ctaText: 'Khám phá ngay',
    },
    {
      id: 2,
      title: 'Ưu Đại Lên Đến 50%',
      subtitle: 'Các sản phẩm thời trang cao cấp',
      image:
        'https://res.cloudinary.com/ddrrh2cxt/image/upload/v1764082409/download_1_gnv3tm.jpg',
      ctaText: 'Mua sắm ngay',
    },
    {
      id: 3,
      title: 'Phong Cách Công Sở',
      subtitle: 'Tự tin trong mọi cuộc họp',
      image:
        'https://res.cloudinary.com/ddrrh2cxt/image/upload/v1764082462/download_2_tiursd.jpg',
      ctaText: 'Xem bộ sưu tập',
    },
  ];

  return (
    <section className="relative ">
      <Carousel
        swipeToSlide={true}
        draggable={true}
        touchMove={true}
        arrows={true}
        autoplay
      >
        {slides.map((slide) => (
          <div key={slide.id} className="relative">
            <div
              className="h-[500px] lg:h-[800px] bg-cover bg-center relative"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-2xl px-4">
                  <h2 className="text-3xl lg:text-5xl font-bold mb-4 opacity-90">
                    {slide.title}
                  </h2>

                  <p className="text-lg lg:text-xl mb-8 !opacity-90">
                    {slide.subtitle}
                  </p>
                  <Button
                    type="primary"
                    size="large"
                    className="!bg-blue-500 text-white "
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
