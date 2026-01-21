'use client';

import React, { useState, useMemo } from 'react';
import {
  Breadcrumb,
  Select,
  Checkbox,
  Slider,
  Spin,
  Empty,
  Skeleton,
} from 'antd';
import { HomeOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import ProductItem from '../ProductItem';
import { useProducts } from '@/hooks/product';
import FilterSection from '../base/FilterSection';
import { useVariations } from '@/hooks/variation';
import { useCategory } from '@/hooks/category';

const { Option } = Select;

interface CategoryClientProps {
  categoryId?: string;
  searchKeyword?: string;
  initialSort?: string;
}

const CategoryClient: React.FC<CategoryClientProps> = ({
  categoryId,
  searchKeyword,
  initialSort = 'default',
}) => {
  const [sortBy, setSortBy] = useState(initialSort);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0, 2000000000,
  ]);
  const [expandSize, setExpandSize] = useState(true);
  const [expandColor, setExpandColor] = useState(true);
  const [expandPrice, setExpandPrice] = useState(true);

  const { data: category, isLoading: isLoadingCategories } =
    useCategory(categoryId);

  const { data: variations = [] } = useVariations();

  const { data: productsData, isLoading } = useProducts({
    categoryId: categoryId,
    search: searchKeyword,
  });

  const products = productsData?.data || [];

  const { allSizes, allColors } = useMemo(() => {
    const sizesSet = new Set<string>();
    const colorsSet = new Set<string>();

    variations.data?.forEach((variation) => {
      if (variation?.name === 'Kích thước') {
        variation.options?.forEach((opt) => sizesSet.add(opt.name));
      }
      if (variation?.name === 'Màu sắc') {
        variation.options?.forEach((opt) => colorsSet.add(opt.name));
      }
    });

    console.log('all sizes', Array.from(sizesSet));

    return {
      allSizes: Array.from(sizesSet),
      allColors: Array.from(colorsSet),
    };
  }, [variations]);
  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by size
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((product) =>
        product.variations?.some(
          (v) =>
            v.name === 'Kích thước' &&
            v.options?.some((opt) => selectedSizes.includes(opt.name)),
        ),
      );
    }

    // Filter by color
    if (selectedColors.length > 0) {
      filtered = filtered.filter((product) =>
        product.variations?.some(
          (v) =>
            v.name === 'Màu sắc' &&
            v.options?.some((opt) => selectedColors.includes(opt.name)),
        ),
      );
    }

    // Filter by price
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1],
    );

    // Sort products
    switch (sortBy) {
      case 'newest':
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      // case 'bestseller':
      //   filtered.sort((a, b) => (b.itemsCount || 0) - (a.itemsCount || 0));
      //   break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        // Add discount logic if available
        break;
      default:
        break;
    }

    return filtered;
  }, [products, selectedSizes, selectedColors, priceRange, sortBy]);

  const handleSizeChange = (checkedValues: string[]) => {
    setSelectedSizes(checkedValues);
  };

  const handleColorChange = (checkedValues: string[]) => {
    setSelectedColors(checkedValues);
  };

  const colorMap: Record<string, string> = {
    Đỏ: '#FF0000',
    Đen: '#000000',
    Trắng: '#FFFFFF',
    Xanh: '#0000FF',
    'Xanh lam': '#4169E1',
    'Xanh lá': '#00FF00',
    Vàng: '#FFFF00',
    Cam: '#FFA500',
    Hồng: '#FFC0CB',
    Tím: '#800080',
    Nâu: '#8B4513',
    Xám: '#808080',
    'Đen xám': '#36454F',
    Be: '#F5F5DC',
  };

  return (
    <div className=" min-h-screen">
      <div className="bg-white">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb
            items={[
              { href: '/', title: <HomeOutlined /> },
              {
                title: searchKeyword
                  ? `Tìm kiếm: ${searchKeyword}`
                  : (category?.categoryName ?? 'Sản phẩm'),
              },
            ]}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Filters */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4">
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Bộ lọc
                  </h2>
                  <span className="text-sm text-gray-500">
                    {filteredProducts.length} kết quả
                  </span>
                </div>
              </div>

              {/* Size Filter */}
              {isLoading ? (
                <div className="px-6 py-5 border-b border-gray-200">
                  <Skeleton.Input
                    active
                    style={{ width: 100, height: 20, marginBottom: 16 }}
                  />
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <Skeleton.Button
                        key={i}
                        active
                        style={{ width: '100%', height: 44, borderRadius: 6 }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                allSizes.length > 0 && (
                  <FilterSection
                    title="Kích thước"
                    expanded={expandSize}
                    onToggle={() => setExpandSize(!expandSize)}
                  >
                    <div className="grid grid-cols-4 gap-2">
                      {allSizes.map((size) => (
                        <label
                          key={size}
                          className={`flex items-center justify-center h-11 border rounded-md cursor-pointer transition-all ${
                            selectedSizes.includes(size)
                              ? 'border-black bg-black text-white'
                              : 'border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={selectedSizes.includes(size)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSizes([...selectedSizes, size]);
                              } else {
                                setSelectedSizes(
                                  selectedSizes.filter((s) => s !== size),
                                );
                              }
                            }}
                          />
                          <span className="text-sm font-medium">{size}</span>
                        </label>
                      ))}
                    </div>
                  </FilterSection>
                )
              )}

              {/* Color Filter */}
              {isLoading ? (
                <div className="px-6 py-5 border-b border-gray-200">
                  <Skeleton.Input
                    active
                    style={{ width: 80, height: 20, marginBottom: 16 }}
                  />
                  <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <Skeleton.Avatar active size={44} shape="circle" />
                        <Skeleton.Input
                          active
                          style={{ width: 40, height: 12 }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                allColors.length > 0 && (
                  <FilterSection
                    title="Màu sắc"
                    expanded={expandColor}
                    onToggle={() => setExpandColor(!expandColor)}
                  >
                    <div className="grid grid-cols-4 gap-4">
                      {allColors.map((color) => (
                        <label
                          key={color}
                          className="flex flex-col items-center cursor-pointer group"
                          title={color}
                        >
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={selectedColors.includes(color)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedColors([...selectedColors, color]);
                              } else {
                                setSelectedColors(
                                  selectedColors.filter((c) => c !== color),
                                );
                              }
                            }}
                          />
                          <div
                            className={`w-11 h-11 rounded-full border-2 transition-all ${
                              selectedColors.includes(color)
                                ? 'border-black ring-2 ring-gray-300 ring-offset-2'
                                : 'border-gray-200 group-hover:border-gray-400'
                            }`}
                            style={{
                              backgroundColor:
                                colorMap[color] || color.toLowerCase(),
                            }}
                          />
                          <span className="text-xs text-gray-600 mt-2 text-center">
                            {color}
                          </span>
                        </label>
                      ))}
                    </div>
                  </FilterSection>
                )
              )}

              {/* Price Filter */}
              {isLoading ? (
                <div className="px-6 py-5">
                  <Skeleton.Input
                    active
                    style={{ width: 60, height: 20, marginBottom: 16 }}
                  />
                  <Skeleton.Input active block style={{ height: 20 }} />
                  <div className="flex justify-between mt-4">
                    <Skeleton.Input active style={{ width: 80, height: 16 }} />
                    <Skeleton.Input active style={{ width: 80, height: 16 }} />
                  </div>
                </div>
              ) : (
                <FilterSection
                  title="Giá"
                  expanded={expandPrice}
                  onToggle={() => setExpandPrice(!expandPrice)}
                >
                  <Slider
                    range
                    min={0}
                    max={200000000}
                    step={10000}
                    value={priceRange}
                    onChange={(value) =>
                      setPriceRange(value as [number, number])
                    }
                    tooltip={{
                      formatter: (value) =>
                        `${value?.toLocaleString('vi-VN')}đ`,
                    }}
                  />
                  <div className="flex justify-between mt-4 text-sm">
                    <span className="text-gray-600">
                      {priceRange[0].toLocaleString('vi-VN')}đ
                    </span>
                    <span className="text-gray-900 font-medium">
                      {priceRange[1].toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </FilterSection>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4  flex items-center justify-between">
              <h1 className="text-2xl font-bold mb-0!">
                {searchKeyword
                  ? `Tìm kiếm: "${searchKeyword}"`
                  : (category?.categoryName ?? 'Sản phẩm')}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Sắp xếp:</span>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  style={{ width: 200 }}
                >
                  <Option value="default">Mặc định</Option>
                  <Option value="newest">Mới nhất</Option>
                  {/* <Option value="bestseller">Bán chạy</Option> */}
                  <Option value="price-asc">Giá thấp đến cao</Option>
                  <Option value="price-desc">Giá cao đến thấp</Option>
                  <Option value="discount">% Giảm giá nhiều</Option>
                </Select>
              </div>
            </div>

            {/* Products */}
            {isLoading ? (
              <div className="flex py-4 gap-10 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} style={{ width: 280 }}>
                    <Skeleton.Image
                      active
                      style={{ width: 280, height: 350, borderRadius: 12 }}
                    />
                    <div className="mt-3 space-y-2">
                      <Skeleton.Input
                        active
                        style={{ width: '100%', height: 20 }}
                      />
                      <Skeleton.Input
                        active
                        style={{ width: '60%', height: 24 }}
                      />
                      <Skeleton.Button
                        active
                        style={{ width: '40%', height: 20 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="flex py-4 gap-10 flex-wrap">
                {filteredProducts.map((product) => (
                  <ProductItem key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12">
                <Empty description="Không tìm thấy sản phẩm nào" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryClient;
