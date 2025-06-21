'use client';
import { useCategories } from '@/hooks/category';
import { Image } from 'antd';

const CategorySection: React.FC = () => {
  const { data: categoriesRes, isLoading } = useCategories();

  return (
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
            {categoriesRes?.data.map((category: any) => (
              <div key={category.id} className="flex flex-col gap-2">
                <div className="h-72 w-54 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    preview={false}
                    alt={category.categoryName}
                    src={category.thumbnail}
                    className="!w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <span className="text-base lg:text-lg font-medium text-center">
                  {category.categoryName}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
