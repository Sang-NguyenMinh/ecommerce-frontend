'use client';
import React, { useEffect, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/layout/HeroSection';
import NewsletterSection from '@/components/layout/NewsletterSection';
import { useCategories } from '@/hooks/category';
import CategoryItem from '@/components/CategoryItem';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProductTestimonialSection from '@/components/layout/ProductTestimonialSection';
import { Leaf, MapPin, Package } from 'lucide-react';
import { Button, notification, Skeleton } from 'antd';
import ProductItem from '@/components/ProductItem';
import { useProducts } from '@/hooks/product';
import { useRouter } from 'next/navigation';
import SectionLayout from '@/components/layout/SectionLayout';
import FloatingLoginButton from '@/components/base/FloatingButton';

const features = [
  {
    id: 1,
    icon: Package,
    title: 'Miễn Phí Vận Chuyển',
    description: 'Miễn phí giao hàng cho đơn hàng trên 1000k.',
  },
  {
    id: 2,
    icon: Leaf,
    title: 'Sản Xuất Bền Vững',
    description: 'Thiết kế thân thiện với bạn và môi trường.',
  },
  {
    id: 3,
    icon: MapPin,
    title: 'Hệ Thống Cửa Hàng',
    description: 'Chúng tôi có 11 cửa hàng trên khắp Việt Nam.',
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
    title: 'MEN ACTIVE',
    subtitle: 'Nhập CMVSEAMLESS Giảm 50K cho BST Seamless Nam',
    image:
      'https://res.cloudinary.com/ddrrh2cxt/image/upload/v1765608581/download_4_s3bbn9.jpg',
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
  const { data: categoriesRes, isLoading: isLoadingCategories } =
    useCategories();
  const swiperRef = useRef(null);
  const { data: products, isLoading: isLoadingProducts } = useProducts({
    limit: 10,
  });

  useEffect(() => {
    notification.open({
      message: 'Thông báo',
      description: (
        <div className="text-sm">
          Backend NestJS được deploy miễn phí trên Render.
          <br />
          Nếu API chưa có dữ liệu, vui lòng reload sau <b>1 phút</b>.
        </div>
      ),
      duration: 20,
    });
  }, []);

  return (
    <MainLayout>
      <HeroSection />

      {/* Categories Section */}
      <SectionLayout
        enableHorizontalScroll={false}
        title="Danh Mục Sản Phẩm"
        subtitle="Khám phá bộ sưu tập đa dạng dành cho phái mạnh"
        isLoading={isLoadingCategories}
        skeletonType="category"
        skeletonCount={5}
      >
        <Swiper
          ref={swiperRef}
          className="max-w-[85%] mx-auto"
          slidesPerView="auto"
          spaceBetween={40}
        >
          {Array.isArray(categoriesRes?.data) &&
            categoriesRes.data.map((category) => (
              <SwiperSlide key={category._id} style={{ width: 'auto' }}>
                <CategoryItem category={category} />
              </SwiperSlide>
            ))}
        </Swiper>
      </SectionLayout>

      {/* Collections Section */}
      <SectionLayout
        title="Bộ Sưu Tập Nổi Bật"
        subtitle="Khám phá những collection độc đáo và ưu đãi hấp dẫn"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {defaultCollections.slice(0, 3).map((collection, index) => (
            <div
              key={index}
              className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[480px] overflow-hidden rounded-xl sm:rounded-2xl group shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${collection.image})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent group-hover:from-black/80 group-hover:via-black/50 transition-all duration-300" />
              </div>

              <div className="relative h-full flex flex-col justify-end p-4 sm:p-5 md:p-6 lg:p-8">
                <div className="text-white space-y-2 sm:space-y-3 lg:space-y-4 transform transition-transform duration-300 group-hover:translate-y-[-8px]">
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold tracking-wide sm:tracking-wider uppercase leading-tight">
                    {collection.title}
                  </h3>

                  <p className="text-xs sm:text-sm font-light leading-relaxed line-clamp-2 opacity-90">
                    {collection.subtitle}
                  </p>

                  <div className="pt-1 sm:pt-2">
                    <Button
                      type="primary"
                      size="middle"
                      className="bg-white text-gray-900 font-semibold hover:bg-gray-900 hover:text-white border-0 px-4 sm:px-6 lg:px-8 h-9 sm:h-10 lg:h-11 text-xs sm:text-sm rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
                      onClick={() => (window.location.href = collection.link)}
                    >
                      {collection.buttonText}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 border-t-2 border-r-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </SectionLayout>

      <ProductTestimonialSection />

      {/* Products Section */}
      <SectionLayout
        title="Sản phẩm nổi bật"
        subtitle="Khám phá bộ sưu tập đa dạng dành cho phái mạnh"
        enableHorizontalScroll={true}
        viewAllText="Xem thêm"
        onViewAllClick={() => router.push('/search')}
        showViewAllButton
        isLoading={isLoadingProducts}
        skeletonType="product"
        skeletonCount={5}
      >
        {products?.data?.map((product: any) => (
          <ProductItem key={product._id} product={product} />
        ))}
      </SectionLayout>

      {/* Features Section */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-4 sm:gap-8 lg:gap-12">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="flex flex-col items-center text-center"
                >
                  <div className="mb-2 sm:mb-4">
                    <Icon
                      className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-800"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-xs sm:text-base lg:text-lg font-semibold mb-1 sm:mb-2 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <NewsletterSection />
      <FloatingLoginButton />
    </MainLayout>
  );
};

export default HomePage;
