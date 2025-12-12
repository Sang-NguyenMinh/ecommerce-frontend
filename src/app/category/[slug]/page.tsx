import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CategoryClient from '@/components/category/CategoryClient';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { search } = await searchParams;
  const categoryId = slug.split('-').pop();
  return (
    <MainLayout>
      <CategoryClient categoryId={categoryId} searchKeyword={search} />
    </MainLayout>
  );
}
