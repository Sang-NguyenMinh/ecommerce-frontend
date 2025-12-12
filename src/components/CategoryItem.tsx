'use client';
import { createSlug } from '@/utils/slug';
import { Image } from 'antd';
import { useRouter } from 'next/navigation';

export interface ICategory {
  categoryName: string;
  createdAt: string;
  parentCategory: null;
  status: boolean;
  thumbnail: string;
  updatedAt: string;
  _id: string;
}

interface ICategoryItemProps {
  category: ICategory;
}

const CategoryItem = ({ category }: ICategoryItemProps) => {
  const router = useRouter();

  const handleClick = () => {
    const slug = createSlug(category.categoryName, category._id);
    router.push(`/category/${slug}`);
  };
  return (
    <div className="flex flex-col gap-2 w-44" onClick={handleClick}>
      <div className="w-full h-44 overflow-hidden rounded-full bg-gray-100">
        <Image
          preview={false}
          alt={category.categoryName}
          src={category.thumbnail}
          className="!w-full !h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <span className="text-base lg:text-lg font-medium text-center  ">
        {category.categoryName}
      </span>
    </div>
  );
};
export default CategoryItem;
