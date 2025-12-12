import { createSlug } from '@/utils/slug';
import { Typography } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';

const { Text } = Typography;

interface ProductItemProps {
  product: any;
  className?: string;
  onClick?: (productId: string) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const router = useRouter();
  const {
    _id,
    productName,
    thumbnails = [],
    price,
    variations = [],
    items = [],
  } = product;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const colorVariation = variations.find((v: any) => v.name === 'Màu sắc');
  const colors = colorVariation?.options?.map((opt: any) => opt.value) || [];

  const sizeVariation = variations.find((v: any) => v.name === 'Kích thước');
  const sizes = sizeVariation?.options?.map((opt: any) => opt.name) || [];

  const mainImage = thumbnails[0] || 'https://via.placeholder.com/400';

  const minPrice =
    items.length > 0
      ? Math.min(...items.map((item: any) => item.price))
      : price;

  const handleClick = () => {
    const slug = createSlug(productName, _id);
    router.push(`/products/${slug}`);
  };

  return (
    <div
      className={`flex flex-col gap-2 cursor-pointer `}
      onClick={handleClick}
    >
      <div className="relative h-65 w-55 overflow-hidden rounded-lg bg-gray-100 group">
        <img
          alt={productName}
          src={mainImage}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400';
          }}
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log('Thêm vào giỏ:', _id);
          }}
          className="absolute bottom-0 left-0 right-0 h-14 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/80"
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m10 0l2-9m-12 9h14m-7-9v6m0 0v3"
              />
            </svg>
            <span className="text-white text-sm font-medium">Thêm vào giỏ</span>
          </div>
        </button>
      </div>

      <div className="flex justify-between items-center min-h-8">
        <div className="flex gap-1">
          {colors.slice(0, 5).map((color: string, index: number) => (
            <div
              key={index}
              className="w-4 h-4 rounded-full border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        {sizes.length > 0 && (
          <div className="flex gap-1 flex-wrap justify-end">
            {sizes.slice(0, 4).map((size: string, index: number) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium hover:bg-gray-200 transition-colors"
              >
                {size}
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <Text className="text-sm block">{productName}</Text>
        <Text className="text-gray-500 font-medium text-sm">
          {formatPrice(price)}{' '}
          {/* {price && (
            <span className="line-through text-red-500">
              {formatPrice(price)}
            </span>
          )} */}
        </Text>
      </div>
    </div>
  );
};

export default ProductItem;
