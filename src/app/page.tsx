'use client';
import React, { use, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/layout/HeroSection';
import NewsletterSection from '@/components/layout/NewsletterSection';
import { useCategories } from '@/hooks/category';
import CategoryItem from '@/components/CategoryItem';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProductTestimonialSection from '@/components/layout/ProductTestimonialSection';
import { Leaf, MapPin, Package } from 'lucide-react';
import SectionLayout from '@/components/layout/SectionLayout';
import { Button } from 'antd';
import ProductItem from '@/components/ProductItem';
import { useProducts } from '@/hooks/product';
import { useRouter } from 'next/navigation';

const features = [
  {
    id: 1,
    icon: Package,
    title: 'Complimentary Shipping',
    description: 'Enjoy free shipping on U.S. orders over $100.',
  },
  {
    id: 2,
    icon: Leaf,
    title: 'Consciously Crafted',
    description: 'Designed with you and the planet in mind.',
  },
  {
    id: 3,
    icon: MapPin,
    title: 'Come Say Hi',
    description: 'We have 11 stores across the U.S.',
  },
];

const defaultCollections: any[] = [
  {
    title: 'MEN WEAR',
    subtitle: 'Nhập COOLNEW giảm ngay 50K cho đơn đầu tiên từ 299K',
    image:
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&h=600&fit=crop',
    buttonText: 'KHÁM PHÁ',
    link: '/collection/men-wear',
  },
  {
    title: 'WOMEN ACTIVE',
    subtitle: 'Nhập CMVSEAMLESS Giảm 50K cho BST Seamless',
    image:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop',
    buttonText: 'KHÁM PHÁ',
    link: '/collection/women-active',
  },
  {
    title: 'SPORT COLLECTION',
    subtitle: 'Ưu đãi 30% cho trang phục thể thao cao cấp',
    image:
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&h=600&fit=crop',
    buttonText: 'KHÁM PHÁ',
    link: '/collection/sport',
  },
];
const HomePage: React.FC = () => {
  const router = useRouter();
  const { data: categoriesRes, isLoading } = useCategories();
  const swiperRef = useRef(null);
  const { data: products } = useProducts({ limit: 10 });
  console.log('products', products);
  return (
    <MainLayout>
      <HeroSection />
      <SectionLayout
        title=" Danh Mục Sản Phẩm"
        subtitle="Khám phá bộ sưu tập đa dạng dành cho phái mạnh"
      >
        <Swiper
          ref={swiperRef}
          className="max-w-[85%] mx-auto"
          slidesPerView="auto"
          spaceBetween={40}
        >
          {categoriesRes?.data.map((category) => (
            <SwiperSlide key={category._id} style={{ width: 'auto' }}>
              <CategoryItem category={category} />
            </SwiperSlide>
          ))}
        </Swiper>
      </SectionLayout>

      <SectionLayout
        title="Bộ Sưu Tập Nổi Bật"
        subtitle="Khám phá những collection độc đáo và ưu đãi hấp dẫn"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {defaultCollections.slice(0, 3).map((collection, index) => (
            <div
              key={index}
              className="relative h-[350px] lg:h-[480px] overflow-hidden rounded-2xl group shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${collection.image})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent group-hover:from-black/80 group-hover:via-black/50 transition-all duration-300" />
              </div>

              <div className="relative h-full flex flex-col justify-end p-5 lg:p-8">
                <div className="text-white space-y-3 lg:space-y-4 transform transition-transform duration-300 group-hover:translate-y-[-8px]">
                  <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold tracking-wider uppercase">
                    {collection.title}
                  </h3>

                  <p className="text-xs lg:text-sm font-light leading-relaxed line-clamp-2">
                    {collection.subtitle}
                  </p>

                  <div className="pt-1 lg:pt-2">
                    <Button
                      type="primary"
                      size="middle"
                      className="bg-white text-gray-900 font-semibold hover:bg-gray-900 hover:text-white border-0 px-6 lg:px-8 h-10 lg:h-11 text-xs lg:text-sm rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
                      onClick={() => (window.location.href = collection.link)}
                    >
                      {collection.buttonText}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </SectionLayout>
      <ProductTestimonialSection />

      <SectionLayout
        title=" Danh Mục Sản Phẩm"
        subtitle="Khám phá bộ sưu tập đa dạng dành cho phái mạnh"
      >
        <div>
          <div className="flex flex-wrap justify-center gap-10">
            {products?.data?.map((product: any) => (
              <ProductItem key={product._id} product={product} />
            ))}
          </div>
          <div className="text-center mt-4">
            <Button
              onClick={() => {
                router.push('/search');
              }}
              type="default"
              size="large"
              className="px-8"
            >
              Xem Tất Cả Sản Phẩm
            </Button>
          </div>
        </div>
      </SectionLayout>
      <section className="py-12 lg:py-16 px-4 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="flex flex-col items-center text-center"
                >
                  <div className="mb-4">
                    <Icon
                      className="w-12 h-12 text-gray-800"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <NewsletterSection />
    </MainLayout>
  );
};

export default HomePage;
