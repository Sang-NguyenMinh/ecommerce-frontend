'use client';
import {
  Select,
  Button,
  Card,
  Badge,
  Breadcrumb,
  Typography,
  Row,
  Col,
  Divider,
  Tag,
  Checkbox,
  Radio,
} from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;

interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  colors: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  isNew?: boolean;
  code: string;
  category: string;
  subcategory: string;
}

const ProductPage: React.FC = () => {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [sortBy, setSortBy] = useState('popularity');

  const subcategories: Category[] = [
    {
      id: 'home',
      name: 'Mặc ở nhà',
      image: '/api/placeholder/300/300',
      productCount: 45,
    },
    {
      id: 'daily',
      name: 'Mặc hàng ngày',
      image: '/api/placeholder/300/300',
      productCount: 78,
    },
    {
      id: 'sport',
      name: 'Thể thao',
      image: '/api/placeholder/300/300',
      productCount: 32,
    },
  ];

  const products: Product[] = [
    {
      id: '1',
      name: 'Áo polo trơn bo tay kẻ thêu logo',
      price: 549000,
      image: '/api/placeholder/300/400',
      colors: ['#87CEEB', '#FFFFFF', '#000000'],
      rating: 4.5,
      reviews: 15,
      inStock: true,
      code: 'GSTP602',
      category: 'polo',
      subcategory: 'daily',
    },
    {
      id: '2',
      name: 'Áo polo kẻ ngang bo tay phối màu',
      price: 550000,
      image: '/api/placeholder/300/400',
      colors: ['#FFFFFF', '#000000'],
      rating: 4.2,
      reviews: 8,
      inStock: true,
      code: 'GSTP039',
      category: 'polo',
      subcategory: 'daily',
    },
    {
      id: '3',
      name: 'Áo polo kẻ ngang bo tay kẻ line',
      price: 550000,
      image: '/api/placeholder/300/400',
      colors: ['#FFFFFF', '#000000'],
      rating: 4.3,
      reviews: 12,
      inStock: true,
      code: 'GSTP040',
      category: 'polo',
      subcategory: 'sport',
    },
    {
      id: '4',
      name: 'Áo polo trơn bo kẻ thêu logo ngực',
      price: 329000,
      originalPrice: 520000,
      discount: 37,
      image: '/api/placeholder/300/400',
      colors: ['#8B0000', '#000000'],
      rating: 4.6,
      reviews: 22,
      inStock: true,
      code: 'GSTP066',
      category: 'polo',
      subcategory: 'home',
    },
    {
      id: '5',
      name: 'Áo polo trơn cổ kẻ thêu logo chest',
      price: 449000,
      originalPrice: 589000,
      discount: 24,
      image: '/api/placeholder/300/400',
      colors: ['#FFFFFF', '#000000'],
      rating: 4.4,
      reviews: 18,
      inStock: true,
      isNew: true,
      code: 'GSTP075',
      category: 'polo',
      subcategory: 'daily',
    },
    {
      id: '6',
      name: 'Áo polo kẻ ngang bo tay line classic',
      price: 479000,
      originalPrice: 629000,
      discount: 24,
      image: '/api/placeholder/300/400',
      colors: ['#1e3a8a', '#000000'],
      rating: 4.1,
      reviews: 9,
      inStock: true,
      code: 'GSTP080',
      category: 'polo',
      subcategory: 'sport',
    },
    {
      id: '7',
      name: 'Áo polo premium cotton blend',
      price: 599000,
      originalPrice: 759000,
      discount: 21,
      image: '/api/placeholder/300/400',
      colors: ['#374151', '#000000'],
      rating: 4.7,
      reviews: 31,
      inStock: true,
      code: 'GSTP090',
      category: 'polo',
      subcategory: 'daily',
    },
    {
      id: '8',
      name: 'Áo polo sport active fit',
      price: 389000,
      originalPrice: 499000,
      discount: 22,
      image: '/api/placeholder/300/400',
      colors: ['#1f2937', '#FFFFFF'],
      rating: 4.3,
      reviews: 14,
      inStock: true,
      code: 'GSTP095',
      category: 'polo',
      subcategory: 'sport',
    },
  ];

  const colors = [
    { name: 'Trắng', value: '#FFFFFF', count: 25 },
    { name: 'Đen', value: '#000000', count: 18 },
    { name: 'Xanh dương', value: '#1e3a8a', count: 12 },
    { name: 'Đỏ đô', value: '#8B0000', count: 8 },
    { name: 'Xám', value: '#374151', count: 15 },
    { name: 'Xanh nhạt', value: '#87CEEB', count: 6 },
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
  const materials = ['Cotton', 'Excool', 'Modal (gỗ sồi)'];

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  const handleColorChange = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const filteredProducts = products.filter((product) => {
    if (selectedSubcategory && selectedSubcategory !== 'all') {
      return product.subcategory === selectedSubcategory;
    }
    return true;
  });

  const SubcategoryCard: React.FC<{ category: Category }> = ({ category }) => (
    <div
      className="text-center cursor-pointer group"
      onClick={() => setSelectedSubcategory(category.id)}
    >
      <div className="relative mb-4">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
        />
        {selectedSubcategory === category.id && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-lg" />
        )}
      </div>
      <Title
        level={4}
        className={`!mb-0 ${selectedSubcategory === category.id ? 'text-blue-600' : 'text-gray-800'}`}
      >
        {category.name}
      </Title>
    </div>
  );

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <Card
      className="relative overflow-hidden group transition-all duration-300 hover:shadow-lg border-0"
      cover={
        <div className="relative overflow-hidden">
          <img
            alt={product.name}
            src={product.image}
            className="w-full h-80 object-cover"
          />
          {product.discount && (
            <Badge.Ribbon
              text={`-${product.discount}%`}
              color="red"
              className="absolute top-2 right-2"
            />
          )}
          {product.isNew && (
            <Tag color="blue" className="absolute top-2 left-2">
              NEW
            </Tag>
          )}
          <div className="absolute top-2 right-2">
            <Tag color="orange" className="text-xs font-medium">
              SAVING PACKS
            </Tag>
          </div>
        </div>
      }
      bodyStyle={{ padding: '12px' }}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-1 mb-1">
          <Text className="text-blue-600 font-medium text-sm">
            {product.rating}★
          </Text>
          <Text type="secondary" className="text-xs">
            ({product.reviews})
          </Text>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <Text strong className="text-lg text-red-600">
              {formatPrice(product.price)}
            </Text>
            {product.originalPrice && (
              <Text delete type="secondary" className="text-sm">
                {formatPrice(product.originalPrice)}
              </Text>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb>
            <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
            <Breadcrumb.Item>Đồ Nam</Breadcrumb.Item>
            <Breadcrumb.Item>Áo Nam</Breadcrumb.Item>
            <Breadcrumb.Item>Áo Thun Nam</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white p-6 mb-6">
          <Title level={2} className="!mb-6 font-bold">
            ÁO THUN NAM VÀNG
          </Title>

          <Row gutter={[24, 24]} className="mb-8">
            {subcategories.map((category) => (
              <Col key={category.id} xs={24} sm={8} md={8}>
                <SubcategoryCard category={category} />
              </Col>
            ))}
          </Row>
        </div>

        <Row gutter={24}>
          <Col xs={24} lg={6}>
            <Card className="mb-6">
              <Title level={4} className="flex items-center gap-2 !mb-4">
                <FilterOutlined /> Phù hợp với
              </Title>

              <div className="mb-6">
                <Radio.Group
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="w-full"
                >
                  <div className="space-y-3">
                    <Radio value="">Tất cả</Radio>
                    <Radio value="home">Mặc ở nhà</Radio>
                    <Radio value="daily">Mặc hàng ngày</Radio>
                    <Radio value="sport">Thể thao</Radio>
                  </div>
                </Radio.Group>
              </div>

              <Divider />

              <div className="mb-6">
                <Title level={5}>Kích cỡ</Title>
                <div className="grid grid-cols-4 gap-2">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      size="small"
                      type={
                        selectedSizes.includes(size) ? 'primary' : 'default'
                      }
                      onClick={() => handleSizeChange(size)}
                      className="h-10"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <Divider />

              <div className="mb-6">
                <Title level={5}>Màu sắc</Title>
                <div className="space-y-2">
                  {colors.map((color) => (
                    <div
                      key={color.value}
                      className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50"
                      onClick={() => handleColorChange(color.value)}
                    >
                      <Checkbox
                        checked={selectedColors.includes(color.value)}
                        onChange={() => handleColorChange(color.value)}
                      />
                      <div
                        className="w-5 h-5 rounded border border-gray-300"
                        style={{ backgroundColor: color.value }}
                      />
                      <Text className="text-sm flex-1">{color.name}</Text>
                    </div>
                  ))}
                </div>
              </div>

              <Divider />

              <div className="mb-6">
                <Title level={5}>Chất liệu</Title>
                <div className="space-y-2">
                  {materials.map((material) => (
                    <div key={material} className="flex items-center gap-2">
                      <Checkbox />
                      <Text className="text-sm">{material}</Text>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={18}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Text className="text-lg font-medium">
                  <span className="font-bold">{filteredProducts.length}</span>{' '}
                  kết quả
                </Text>

                <div className="flex items-center gap-2">
                  {selectedSubcategory && (
                    <Tag
                      closable
                      onClose={() => setSelectedSubcategory('')}
                      color="blue"
                    >
                      {
                        subcategories.find((s) => s.id === selectedSubcategory)
                          ?.name
                      }
                    </Tag>
                  )}
                  <Button type="link" className="text-blue-600 p-0 h-auto">
                    Xóa lọc
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Text>SẮP XẾP THEO</Text>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  className="w-32"
                  size="small"
                >
                  <Option value="popularity">Bán chạy</Option>
                  <Option value="newest">Mới nhất</Option>
                  <Option value="price-low">Giá thấp đến cao</Option>
                  <Option value="price-high">Giá cao đến thấp</Option>
                  <Option value="rating">Đánh giá cao</Option>
                </Select>
              </div>
            </div>

            <Row gutter={[12, 16]}>
              {filteredProducts.map((product) => (
                <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>

            {filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <Text type="secondary">
                  Không tìm thấy sản phẩm phù hợp với bộ lọc đã chọn
                </Text>
              </div>
            )}

            {filteredProducts.length > 0 && (
              <div className="flex justify-center mt-8">
                <Button.Group>
                  <Button>« Trước</Button>
                  <Button type="primary">1</Button>
                  <Button>2</Button>
                  <Button>3</Button>
                  <Button>Sau »</Button>
                </Button.Group>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProductPage;
