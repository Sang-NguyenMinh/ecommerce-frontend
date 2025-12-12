import React from 'react';
import { Metadata } from 'next';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import MainLayout from '@/components/layout/MainLayout';

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const productId = slug.split('-').pop();

  return {
    title: 'Chi tiết sản phẩm',
    description: 'Xem chi tiết sản phẩm',
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const productId = slug.split('-').pop();
  return (
    <MainLayout>
      <ProductDetailClient productId={productId || ''} />
    </MainLayout>
  );
}
