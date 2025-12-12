'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  HomeOutlined,
  ShareAltOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Image, message } from 'antd';
import { useProduct, useProducts } from '@/hooks/product';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProductItem from '../ProductItem';
import { Typography } from 'antd';
import { useAppDispatch } from '@/redux/store';
import { addToCart } from '@/redux/cartSlice';
import { useRouter } from 'next/navigation';

const { Text } = Typography;

interface ProductDetailClientProps {
  productId: string;
}

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  productId,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const swiperRef = useRef(null);
  const { data: product, isLoading: isLoading } = useProduct(productId);
  const { data: products } = useProducts();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);

  const variations = useMemo(() => product?.variations || [], [product]);

  const colorVariation = useMemo(() => {
    return variations.find((v) => v.name === 'Màu sắc');
  }, [variations]);

  const colorImages = useMemo(() => {
    if (!colorVariation || !product?.items) return [];

    const imagesByColor = new Map();

    colorVariation.options?.forEach((option) => {
      const itemWithColor = product.items.find((item) =>
        item.configurations?.some((config) => config.optionId === option._id),
      );

      if (itemWithColor?.images?.[0]) {
        imagesByColor.set(option._id, {
          image: itemWithColor.images[0],
          optionId: option._id,
          colorName: option.name,
        });
      }
    });

    return Array.from(imagesByColor.values());
  }, [colorVariation, product]);

  const selectedItem = useMemo(() => {
    if (!product?.items || product.items.length === 0) return null;
    if (variations.length === 0) return product.items[0];

    const selectedOptionIds = Object.values(selectedOptions);
    if (selectedOptionIds.length === 0) return product.items[0];

    const matchingItem = product.items.find((item) => {
      if (!item.configurations || item.configurations.length === 0)
        return false;
      return selectedOptionIds.every((optionId) =>
        item.configurations.some((config) => config.optionId === optionId),
      );
    });

    return matchingItem || product.items[0];
  }, [product, selectedOptions, variations]);

  useEffect(() => {
    if (variations.length > 0 && Object.keys(selectedOptions).length === 0) {
      const initialOptions = {};
      variations.forEach((variation) => {
        if (variation.options && variation.options.length > 0) {
          initialOptions[variation._id] = variation.options[0]._id;
        }
      });
      setSelectedOptions(initialOptions);
    }
  }, [variations]);

  useEffect(() => {
    setSelectedImage(0);
  }, [selectedItem]);

  const displayImages = useMemo(() => {
    if (selectedItem?.images && selectedItem.images.length > 0) {
      return selectedItem.images;
    }
    if (product?.thumbnails && product.thumbnails.length > 0) {
      return product.thumbnails;
    }
    return [];
  }, [selectedItem, product]);

  const productName = product?.productName ?? 'Sản phẩm';
  const price = selectedItem?.price ?? 0;
  const qtyInStock = selectedItem?.qtyInStock ?? 0;
  const inStock = selectedItem?.inStock ?? false;

  const handleThumbnailClick = (colorInfo) => {
    if (!colorVariation) return;

    setSelectedOptions((prev) => ({
      ...prev,
      [colorVariation._id]: colorInfo.optionId,
    }));

    setSelectedImage(0);
  };

  const handleOptionChange = (variationId, optionId) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [variationId]: optionId,
    }));
  };

  const getSelectedOptionName = (variationId) => {
    const selectedOptionId = selectedOptions[variationId];
    const variation = variations.find((v) => v._id === variationId);
    const option = variation?.options.find((o) => o._id === selectedOptionId);
    return option?.name || '';
  };

  const handleAddToCart = () => {
    if (!selectedItem || !inStock) {
      message.error('Sản phẩm hiện không có sẵn');
      return;
    }

    if (quantity > qtyInStock) {
      message.error(`Chỉ còn ${qtyInStock} sản phẩm trong kho`);
      return;
    }

    // Get selected color and size names
    const colorVariation = variations.find((v) => v.name === 'Màu sắc');
    const sizeVariation = variations.find((v) => v.name === 'Kích thước');

    const selectedColor = colorVariation
      ? getSelectedOptionName(colorVariation._id)
      : undefined;
    const selectedSize = sizeVariation
      ? getSelectedOptionName(sizeVariation._id)
      : undefined;

    const cartItem = {
      _id: `${selectedItem._id}-${Date.now()}`, // Unique ID for cart item
      productItemId: {
        _id: selectedItem._id,
        productId: {
          _id: product._id,
          productName: product.productName,
          thumbnail: product.thumbnails?.[0] || selectedItem.images?.[0],
        },
        SKU: selectedItem.SKU,
        price: selectedItem.price,
        images: selectedItem.images,
      },
      qty: quantity,
      selectedColor,
      selectedSize,
    };

    dispatch(addToCart(cartItem));
    setQuantity(1); // Reset quantity after adding
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate to payment page
    setTimeout(() => {
      router.push('/shop-order');
    }, 500);
  };
  const [visible, setVisible] = useState(false);
  return (
    <div className="bg-white min-h-screen">
      <Breadcrumb
        style={{ padding: 20 }}
        items={[
          { href: '/', title: <HomeOutlined /> },
          {
            href: '',
            title: (
              <>
                <UserOutlined />
                <span>{product?.categoryId.categoryName}</span>
              </>
            ),
          },
          { title: product?.productName },
        ]}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Images */}
          <div className="flex gap-4">
            {colorImages.length > 0 && (
              <div className="flex flex-col gap-3">
                {colorImages.map((colorInfo) => {
                  const isSelected =
                    colorVariation &&
                    selectedOptions[colorVariation._id] === colorInfo.optionId;

                  return (
                    <div
                      key={colorInfo.optionId}
                      className={`cursor-pointer border-2 rounded-lg overflow-hidden w-20 h-20 ${
                        isSelected
                          ? 'border-gray-900 ring-2 ring-gray-300'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      onClick={() => handleThumbnailClick(colorInfo)}
                      title={colorInfo.colorName}
                    >
                      <img
                        src={colorInfo.image}
                        alt={colorInfo.colorName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex-1 bg-gray-100 rounded-xl overflow-hidden max-w-md">
              {displayImages.length > 0 ? (
                <img
                  src={displayImages[selectedImage] || displayImages[0]}
                  alt={productName}
                  className="w-full h-100 object-contain"
                />
              ) : (
                <div className="w-full h-96 flex items-center justify-center text-gray-400">
                  Không có hình ảnh
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{productName}</h1>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i} className="text-xl">
                      {star}
                    </span>
                  ))}
                </div>
                <span className="text-gray-600 font-medium">(5)</span>
              </div>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                <ShareAltOutlined />
                <span>Chia sẻ</span>
              </button>
            </div>

            <div className="mb-6">
              <p className="text-4xl font-bold text-gray-900 mb-2">
                {price.toLocaleString('vi-VN')}đ
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <span>🚚</span>
                <span>Freeship đơn trên 200K</span>
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-gray-700 font-medium">Mã giảm giá</span>
                <span className="px-4 py-1.5 bg-orange-100 text-orange-600 rounded-md text-sm font-medium">
                  Giảm 60K
                </span>
                <span className="px-4 py-1.5 bg-orange-100 text-orange-600 rounded-md text-sm font-medium">
                  Giảm 100K
                </span>
              </div>
            </div>

            {/* Color Selection */}
            {variations.map((variation) => {
              if (variation.name !== 'Màu sắc') return null;

              return (
                <div key={variation._id} className="mb-8">
                  <p className="text-gray-800 mb-3">
                    Màu sắc:{' '}
                    <span className="font-semibold">
                      {getSelectedOptionName(variation._id)}
                    </span>
                  </p>
                  <div className="flex gap-3">
                    {variation.options?.map((option) => {
                      const isSelected =
                        selectedOptions[variation._id] === option._id;

                      let bgStyle = {};
                      if (option.value === 'red') {
                        bgStyle = {
                          background:
                            'linear-gradient(135deg, #fff 0%, #ffc0cb 50%, #ff69b4 100%)',
                        };
                      } else if (option.value === 'black') {
                        bgStyle = {
                          background:
                            'linear-gradient(135deg, #ff1493 0%, #8b008b 100%)',
                        };
                      } else {
                        bgStyle = { backgroundColor: option.value };
                      }

                      return (
                        <button
                          key={option._id}
                          className={`relative w-16 h-12 rounded-full border-2 transition-all ${
                            isSelected
                              ? 'border-gray-900 ring-2 ring-gray-300 ring-offset-2'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onClick={() =>
                            handleOptionChange(variation._id, option._id)
                          }
                          title={option.name}
                        >
                          <div
                            className="w-full h-full rounded-full"
                            style={bgStyle}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Size Selection */}
            {variations.map((variation) => {
              if (variation.name !== 'Kích thước') return null;

              return (
                <div key={variation._id} className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-gray-800">
                      Kích thước:{' '}
                      <span className="font-semibold">
                        {getSelectedOptionName(variation._id)}
                      </span>
                    </p>

                    <span
                      onClick={() => setVisible(true)}
                      className="inline-flex items-center gap-2 text-blue-500 cursor-pointer"
                    >
                      <span>Hướng dẫn chọn size</span>
                    </span>
                    <div style={{ display: 'none' }}>
                      <Image
                        preview={{
                          visible,
                          src: 'https://res.cloudinary.com/ddrrh2cxt/image/upload/v1749022771/e-commerce/yaw27kkmmklqwlzphq6j.jpg',
                          onVisibleChange: (value) => setVisible(value),
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {variation.options?.map((option) => {
                      const isSelected =
                        selectedOptions[variation._id] === option._id;

                      return (
                        <button
                          key={option._id}
                          className={`min-w-[68px] px-6 py-3 rounded-lg font-medium transition-all text-gray-700 bg-gray-300 ${
                            isSelected
                              ? 'border-gray-900 ring-2 ring-gray-300 ring-offset-2'
                              : 'border-gray-300 hover:border-gray-400'
                          }  `}
                          onClick={() =>
                            handleOptionChange(variation._id, option._id)
                          }
                        >
                          {option.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Quantity & Add to Cart */}
            <div className="flex gap-4 mb-4">
              <div className="flex items-center border-gray-300 border rounded-full px-2">
                <button
                  className="p-3 text-white hover:bg-gray-200 rounded-full transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!inStock}
                >
                  <MinusOutlined />
                </button>
                <input
                  type="number"
                  min={1}
                  max={qtyInStock}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-12 bg-transparent text-white text-center font-semibold outline-none"
                  disabled={!inStock}
                />
                <button
                  className="p-3 text-white hover:bg-gray-200 rounded-full transition-colors"
                  onClick={() =>
                    setQuantity(Math.min(qtyInStock, quantity + 1))
                  }
                  disabled={!inStock}
                >
                  <PlusOutlined />
                </button>
              </div>

              <button
                className="flex-1 border border-gray-300 text-white font-semibold py-4 px-8 rounded-full flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleAddToCart}
                disabled={!inStock}
              >
                <ShoppingCartOutlined className="text-lg" />
                <span>{inStock ? 'Thêm vào giỏ' : 'Hết hàng'}</span>
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              className="w-full bg-blue-400  text-white! font-semibold py-4 px-8 rounded-full transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={handleBuyNow}
              disabled={!inStock}
            >
              Mua ngay
            </button>

            {inStock && qtyInStock < 10 && qtyInStock > 0 && (
              <p className="text-orange-600 text-sm mt-4">
                ⚠️ Chỉ còn {qtyInStock} sản phẩm
              </p>
            )}
          </div>
        </div>

        {product?.content && (
          <div className="mt-16 border-t pt-12">
            <h2 className="text-2xl font-bold mb-6">Mô tả sản phẩm</h2>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: product.content }}
            />
          </div>
        )}

        <div>
          <h2 className="text-4xl font-bold mb-6 block text-center py-10">
            Sản phẩm liên quan
          </h2>
          <Swiper
            ref={swiperRef}
            className="pb-12 mr-10! ml-10!"
            slidesPerView="auto"
            spaceBetween={16}
          >
            {products?.data.map((p) => (
              <SwiperSlide key={p._id} style={{ width: 'auto' }}>
                <ProductItem product={p} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailClient;
