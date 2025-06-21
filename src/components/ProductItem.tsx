import { Image, Typography } from 'antd';

import type { IProduct } from '@/types/product';

const { Text } = Typography;

interface ProductItemProps {
  product: IProduct;
  className?: string;
  onClick?: (productId: number) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onClick }) => {
  const { id, name, price, originalPrice, image, colors = [] } = product;
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleClick = () => {
    onClick?.(id);
  };

  return (
    <div
      className={`flex flex-col gap-2 cursor-pointer `}
      onClick={handleClick}
    >
      {/* Product Image */}
      <div className="h-74 w-60 overflow-hidden rounded-lg bg-gray-100">
        <Image
          alt="Product Image"
          preview={false}
          src={image}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
        />
      </div>

      {/* Colors */}
      <div className="flex gap-1">
        {colors.map((color, index) => (
          <div
            key={index}
            className="w-4 h-4 rounded-full border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
            title={`Color ${index + 1}`}
          />
        ))}
      </div>

      {/* Product Info */}
      <div>
        <Text className="text-sm block">{name}</Text>
        <Text className="text-gray-500 font-medium text-sm">
          {formatPrice(price)}{' '}
          {originalPrice && (
            <span className="line-through text-red-500">
              {formatPrice(originalPrice)}
            </span>
          )}
        </Text>
      </div>
    </div>
  );
};

export default ProductItem;
