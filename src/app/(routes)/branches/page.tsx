'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Input,
  Select,
  Tag,
  Button,
} from 'antd';
import {
  EnvironmentOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  ShopOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
export interface Store {
  id: number;
  name: string;
  city: string;
  district: string;
  address: string;
  phone: string;
  hours: string;
  type: 'flagship' | 'standard' | 'outlet' | 'premium';
  lat: number;
  lng: number;
  image: string;
}

const StoreSystemPage = () => {
  const [selectedCity, setSelectedCity] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store>();
  const mapRef = useRef<any>(null);

  const stores: Store[] = [
    {
      id: 3,
      name: 'NMS Crescent Mall',
      city: 'HCM',
      district: 'Quận 7',
      address: '101 Tôn Dật Tiên, Phường Tân Phú',
      phone: '028 3456 7890',
      hours: '10:00 - 22:00',
      type: 'standard',
      lat: 10.7291,
      lng: 106.7195,
      image:
        'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80',
    },

    {
      id: 5,
      name: 'NMS Vincom Trần Duy Hưng',
      city: 'HN',
      district: 'Cầu Giấy',
      address: '119 Trần Duy Hưng, Phường Trung Hòa',
      phone: '024 1234 5678',
      hours: '9:30 - 22:00',
      type: 'flagship',
      lat: 21.0049,
      lng: 105.8124,
      image:
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
    },
    {
      id: 6,
      name: 'NMS Tràng Tiền Plaza',
      city: 'HN',
      district: 'Hoàn Kiếm',
      address: '24 Hai Bà Trưng, Phường Tràng Tiền',
      phone: '024 2345 6789',
      hours: '9:00 - 21:30',
      type: 'premium',
      lat: 21.0245,
      lng: 105.8544,
      image:
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
    },
  ];

  const cities = [
    { value: 'all', label: 'Tất Cả Thành Phố' },
    { value: 'HCM', label: 'TP. Hồ Chí Minh' },
    { value: 'HN', label: 'Hà Nội' },
  ];

  const filteredStores = stores.filter((store: Store) => {
    const matchCity = selectedCity === 'all' || store.city === selectedCity;
    const matchSearch =
      store.name.toLowerCase().includes(searchText.toLowerCase()) ||
      store.address.toLowerCase().includes(searchText.toLowerCase()) ||
      store.district.toLowerCase().includes(searchText.toLowerCase());
    return matchCity && matchSearch;
  });

  useEffect(() => {
    if (filteredStores.length > 0 && !selectedStore) {
      setSelectedStore(filteredStores[0]);
    }
  }, [filteredStores]);

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const getStoreTypeTag = (type) => {
    const typeConfig = {
      flagship: { color: 'gold', text: 'Flagship Store' },
      premium: { color: 'purple', text: 'Premium Store' },
      standard: { color: 'blue', text: 'Standard Store' },
    };
    return typeConfig[type] || typeConfig.standard;
  };

  return (
    <MainLayout>
      <Layout className="min-h-screen bg-gray-50">
        <Content className="max-w-7xl  w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="mb-8">
            <Title level={2} className="!mb-2">
              Hệ Thống Cửa Hàng NMS
            </Title>
            <Text className="text-gray-600">Tìm cửa hàng NMS gần bạn nhất</Text>
          </div>

          <div className="mb-6 bg-white p-4 lg:p-6 rounded-xl shadow-sm w-full">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={16}>
                <Search
                  placeholder="Tìm kiếm cửa hàng theo tên, địa chỉ, quận..."
                  size="large"
                  prefix={<SearchOutlined />}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} md={8}>
                <Select
                  size="large"
                  value={selectedCity}
                  onChange={setSelectedCity}
                  className="w-full"
                >
                  {cities.map((city) => (
                    <Option key={city.value} value={city.value}>
                      {city.label}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </div>

          <div className="mb-6">
            <Text className="text-gray-600">
              Tìm thấy{' '}
              <span className="font-semibold text-slate-900">
                {filteredStores.length}
              </span>{' '}
              cửa hàng
            </Text>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
            {filteredStores.map((store) => (
              <Card
                key={store.id}
                hoverable
                onClick={() => handleStoreSelect(store)}
                className={`overflow-hidden rounded-xl border-2 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  selectedStore?.id === store.id
                    ? 'border-blue-500'
                    : 'border-transparent'
                }`}
                cover={
                  <div className="relative h-40 lg:h-48 overflow-hidden">
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <Tag
                        color={getStoreTypeTag(store.type).color}
                        className="!m-0"
                      >
                        {getStoreTypeTag(store.type).text}
                      </Tag>
                    </div>
                  </div>
                }
              >
                <div className="space-y-3">
                  <Title level={5} className="!mb-2">
                    {store.name}
                  </Title>

                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <EnvironmentOutlined className="text-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <Text className="text-gray-700 text-sm block">
                          {store.address}
                        </Text>
                        <Text className="text-gray-500 text-xs">
                          {store.district},{' '}
                          {store.city === 'HCM' ? 'TP.HCM' : 'Hà Nội'}
                        </Text>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <PhoneOutlined className="text-green-500 flex-shrink-0" />
                      <a
                        href={`tel:${store.phone}`}
                        className="text-gray-700 hover:text-blue-500 text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {store.phone}
                      </a>
                    </div>

                    <div className="flex items-center space-x-2">
                      <ClockCircleOutlined className="text-orange-500 flex-shrink-0" />
                      <Text className="text-gray-700 text-sm">
                        {store.hours}
                      </Text>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {selectedStore && filteredStores.length > 0 && (
            <div
              ref={mapRef}
              className="bg-white rounded-xl shadow-lg p-4 lg:p-6"
            >
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div>
                  <Title level={4} className="!mb-1">
                    {selectedStore.name}
                  </Title>
                  <Text className="text-gray-600 text-sm">
                    {selectedStore.address}
                  </Text>
                </div>
                <Button
                  type="primary"
                  icon={<EnvironmentOutlined />}
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedStore.lat},${selectedStore.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chỉ đường
                </Button>
              </div>

              <div className="w-full h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${selectedStore.lat},${selectedStore.lng}&zoom=16`}
                  allowFullScreen
                />
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <PhoneOutlined className="text-blue-500 text-xl" />
                  <div>
                    <Text className="text-xs text-gray-600 block">
                      Điện thoại
                    </Text>
                    <a
                      href={`tel:${selectedStore.phone}`}
                      className="text-sm font-medium text-gray-900 hover:text-blue-500"
                    >
                      {selectedStore.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <ClockCircleOutlined className="text-orange-500 text-xl" />
                  <div>
                    <Text className="text-xs text-gray-600 block">
                      Giờ mở cửa
                    </Text>
                    <Text className="text-sm font-medium text-gray-900">
                      {selectedStore.hours}
                    </Text>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <ShopOutlined className="text-purple-500 text-xl" />
                  <div>
                    <Text className="text-xs text-gray-600 block">
                      Loại cửa hàng
                    </Text>
                    <Text className="text-sm font-medium text-gray-900">
                      {getStoreTypeTag(selectedStore.type).text}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Content>
      </Layout>
    </MainLayout>
  );
};

export default StoreSystemPage;
