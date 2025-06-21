'use client';
import { Image } from 'antd';

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
  return (
    <div key={category._id} className="flex flex-col gap-2">
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
  );
};

export default CategoryItem;
