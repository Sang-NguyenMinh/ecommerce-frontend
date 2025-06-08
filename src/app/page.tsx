'use client';
import React from 'react';
import { ConfigProvider } from 'antd';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategorySection from '@/components/CategorySection';
import FeaturedProducts from '@/components/FeaturedProducts';
import BrandSection from '@/components/BrandSection';
import NewsletterSection from '@/components/NewsletterSection';
import Footer from '@/components/Footer';

const HomePage: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#000000',
          colorLink: '#000000',
          borderRadius: 8,
        },
      }}
    >
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <HeroSection />
          <CategorySection />
          <FeaturedProducts />
          <BrandSection />
          <NewsletterSection />
        </main>
        <Footer />
      </div>
    </ConfigProvider>
  );
};

export default HomePage;
