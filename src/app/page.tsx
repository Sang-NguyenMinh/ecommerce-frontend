'use client';
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/layout/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import NewsletterSection from '@/components/layout/NewsletterSection';
import { useCategories } from '@/hooks/category';
import CategoryItem, { ICategory } from '@/components/CategoryItem';

const HomePage: React.FC = () => {
  const { data: categoriesRes, isLoading } = useCategories();
  return (
    <MainLayout>
      <HeroSection />

      <section className="py-8 lg:py-16 px-4 lg:px-8 ">
        <div className="max-w-[90%] mx-auto">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-2xl lg:text-4xl font-bold mb-2 lg:mb-4">
              Danh Mục Sản Phẩm
            </h2>
            <p className="text-gray-600 text-base lg:text-lg">
              Khám phá bộ sưu tập đa dạng dành cho phái mạnh
            </p>
          </div>

          <div className="relative">
            <div
              className="flex flex-nowrap gap-10 overflow-x-auto scrollbar-hide justify-center"
              style={{
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              {categoriesRes?.data.map((category: ICategory) => (
                <CategoryItem category={category} key={category._id} />
              ))}
            </div>
          </div>
        </div>
      </section>
      <FeaturedProducts />

      <NewsletterSection />
    </MainLayout>
  );
};

export default HomePage;
