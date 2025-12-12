import React from 'react';
import { Metadata } from 'next';
import CategoryClient from '@/components/category/CategoryClient';
import MainLayout from '@/components/layout/MainLayout';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;

  return {
    title: q ? `Tìm kiếm: ${q}` : 'Tìm kiếm sản phẩm',
    description: q ? `Kết quả tìm kiếm cho "${q}"` : 'Tìm kiếm sản phẩm',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, sort } = await searchParams;

  return (
    <MainLayout>
      <CategoryClient searchKeyword={q} initialSort={sort || 'newest'} />
    </MainLayout>
  );
}
