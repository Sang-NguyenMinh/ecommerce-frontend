'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  Form,
  Input,
  Select,
  Space,
  Typography,
  Tag,
  Tabs,
  InputNumber,
  Drawer,
  Image,
  Row,
  Col,
  Badge,
  Button,
} from 'antd';
import {
  PlusOutlined,
  ShoppingOutlined,
  TagOutlined,
  BgColorsOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import {
  ActionButton,
  ActionButtons,
  CustomModal,
  CustomTable,
  ImageUpload,
  PageHeader,
  StatisticItem,
  StatisticsCards,
  useModal,
} from './component/custom';
import {
  useDeleteProduct,
  useProducts,
  useCreateProduct,
  useUpdateProduct,
} from '@/hooks/product';
import { useCategories } from '@/hooks/category';
import RichTextEditor from '@/components/rich-text-editor';
import { Storage } from '@/libs/storage';

const { Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const mockVariationOptions = {
  var1: [
    { _id: 'opt1', value: 'S', variationId: 'var1' },
    { _id: 'opt2', value: 'M', variationId: 'var1' },
  ],
  var2: [
    { _id: 'opt5', value: 'Đỏ', variationId: 'var2', color: '#ff0000' },
    { _id: 'opt6', value: 'Xanh', variationId: 'var2', color: '#0000ff' },
  ],
};

const mockProductItems = [
  {
    _id: 'item1',
    productId: '1',
    SKU: 'TSN-001-S-RED',
    price: 299000,
    qtyInStock: 25,
    images: ['https://via.placeholder.com/300x300/ff0000'],
    configurations: [
      {
        variationOptionId: 'opt1',
        variationOption: { value: 'S', color: null },
      },
      {
        variationOptionId: 'opt5',
        variationOption: { value: 'Đỏ', color: '#ff0000' },
      },
    ],
  },
];

const ProductManagement = () => {
  const [form] = Form.useForm();
  const [variantForm] = Form.useForm();
  const [productItems, setProductItems] = useState(mockProductItems);
  const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [fileList, setFileList] = useState([]);

  console.log(Storage.Cookie.get('token'));

  // API hooks
  const { data: productRes, isLoading } = useProducts();
  const { data: categoriesRes } = useCategories();
  const { mutate: deleteProduct, isLoading: isDeleting } = useDeleteProduct();
  const { mutate: createProduct, isLoading: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isLoading: isUpdating } = useUpdateProduct();

  // Modal hooks
  const {
    isVisible: isModalVisible,
    isEditing,
    openModal,
    closeModal,
  } = useModal();

  const {
    isVisible: isVariantModalVisible,
    openModal: openVariantModal,
    closeModal: closeVariantModal,
  } = useModal();

  const transformedProducts = useMemo(() => {
    if (!productRes?.products || !Array.isArray(productRes.products)) {
      return [];
    }

    return productRes.products.map((product) => ({
      id: product._id || '',
      productName: product.productName || 'Không có tên',
      categoryName: product.categoryId?.categoryName || 'Chưa phân loại',
      categoryId: product.categoryId?._id || product.categoryId || null,
      thumbnails:
        Array.isArray(product.thumbnails) && product.thumbnails.length > 0
          ? product.thumbnails
          : ['https://via.placeholder.com/150x150/87CEEB'],
      content: product.content || '',
      status: product.status || 'active',
      createdAt: product.createdAt
        ? new Date(product.createdAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      totalVariants: product.totalVariants || 0,
      totalStock: product.totalStock || 0,
      minPrice: product.minPrice || 0,
      maxPrice: product.maxPrice || product.minPrice || 0,
    }));
  }, [productRes]);

  // Statistics data based on API data
  const statisticsData: StatisticItem[] = useMemo(
    () => [
      {
        title: 'Tổng sản phẩm',
        value: transformedProducts.length,
        prefix: <ShoppingOutlined />,
        valueStyle: { color: '#1890ff' },
      },
      {
        title: 'Đang hoạt động',
        value: transformedProducts.filter((p) => p.status === 'active').length,
        prefix: <TagOutlined />,
        valueStyle: { color: '#52c41a' },
      },
      {
        title: 'Tổng biến thể',
        value: productItems.length,
        prefix: <BgColorsOutlined />,
        valueStyle: { color: '#722ed1' },
      },
      {
        title: 'Tổng tồn kho',
        value: productItems.reduce((sum, item) => sum + item.qtyInStock, 0),
        prefix: <BarChartOutlined />,
        valueStyle: { color: '#fa8c16' },
      },
    ],
    [transformedProducts, productItems],
  );

  // Table columns
  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'thumbnails',
      key: 'thumbnails',
      width: 80,
      render: (thumbnails: any) => (
        <Image
          width={60}
          height={60}
          src={thumbnails?.[0]}
          className="rounded-lg object-cover"
          alt="Product Thumbnail"
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      width: 200,
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" className="text-xs">
            ID: {record.id}
          </Text>
        </div>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 120,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Biến thể',
      key: 'variants',
      width: 100,
      render: (_, record) => (
        <div className="text-center">
          <Badge count={record.totalVariants} showZero>
            <AppstoreOutlined className="text-lg" />
          </Badge>
        </div>
      ),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'totalStock',
      key: 'totalStock',
      width: 80,
      render: (stock) => (
        <Badge
          count={stock}
          showZero
          style={{
            backgroundColor:
              stock > 50 ? '#52c41a' : stock > 10 ? '#faad14' : '#ff4d4f',
          }}
        />
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => {
        const actions: ActionButton[] = [
          {
            type: 'view',
            tooltip: 'Xem chi tiết',
            onClick: () => handleViewDetail(record),
          },
          {
            type: 'edit',
            tooltip: 'Chỉnh sửa',
            onClick: () => handleEdit(record),
          },
          {
            type: 'delete',
            tooltip: 'Xóa',
            confirmTitle: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
            onClick: async () => {
              await deleteProduct(record.id);
            },
          },
        ];
        return <ActionButtons actions={actions} />;
      },
    },
  ];

  // Event handlers
  const handleViewDetail = useCallback((product) => {
    setSelectedProduct(product);
    setIsDetailDrawerVisible(true);
  }, []);

  const handleEdit = useCallback(
    (product) => {
      setSelectedProduct(product);
      openModal(product, true);
      form.setFieldsValue(product);
      setEditorContent(product.content || '');
      setFileList(
        product.thumbnails?.map((url, index) => ({
          uid: `${index}`,
          name: `image-${index}`,
          status: 'done',
          url,
        })) || [],
      );
    },
    [form, openModal],
  );

  const handleAddNew = useCallback(() => {
    openModal();
    form.resetFields();
    setFileList([]);
    setEditorContent('');
  }, [form, openModal]);

  const handleSaveProduct = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append('productName', values.productName || '');
      formData.append('categoryId', values.categoryId || '');
      formData.append('content', editorContent || '');

      // Phân loại files
      const newFiles = [];
      const existingUrls = [];

      fileList.forEach((file) => {
        if (file?.originFileObj) {
          // File mới được upload
          newFiles.push(file.originFileObj);
        } else if (file.url && !file.originFileObj) {
          // File đã tồn tại
          existingUrls.push(file.url);
        }
      });

      // Append files mới
      newFiles.forEach((file) => {
        formData.append('thumbnails', file);
      });

      // QUAN TRỌNG: Gửi existingThumbnails dưới dạng JSON string
      if (existingUrls.length > 0) {
        formData.append('existingThumbnails', JSON.stringify(existingUrls));
      }

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      if (isEditing) {
        await updateProduct({
          id: selectedProduct?.id ?? '',
          data: formData,
        });
      } else {
        await createProduct(formData);
      }

      closeModal();
      form.resetFields();
      setFileList([]);
      setEditorContent('');
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleAddVariant = useCallback(() => {
    openVariantModal();
    variantForm.resetFields();
  }, [openVariantModal, variantForm]);

  const handleEditVariant = useCallback(
    (variant) => {
      openVariantModal(variant, true);
      variantForm.setFieldsValue(variant);
    },
    [openVariantModal, variantForm],
  );

  const handleDeleteVariant = useCallback(
    (variantId) => {
      setProductItems(productItems.filter((item) => item._id !== variantId));
    },
    [productItems],
  );

  const handleSaveVariant = useCallback(async () => {
    try {
      const values = await variantForm.validateFields();
      const newVariant = {
        _id: Date.now().toString(),
        productId: selectedProduct.id,
        SKU: values.SKU,
        price: values.price,
        qtyInStock: values.qtyInStock,
        images:
          values.images?.map((file) => file.url || file.response?.url) || [],
        configurations: values.configurations || [],
      };

      setProductItems([...productItems, newVariant]);
      closeVariantModal();
      variantForm.resetFields();
    } catch (error) {
      console.error('Error saving variant:', error);
    }
  }, [variantForm, selectedProduct, productItems, closeVariantModal]);

  const currentProductItems = productItems.filter(
    (item) => item.productId === selectedProduct?.id,
  );

  const statisticsForDetail: StatisticItem[] = [
    {
      title: 'Tổng biến thể',
      value: currentProductItems.length,
      prefix: <AppstoreOutlined />,
    },
    {
      title: 'Tổng tồn kho',
      value: currentProductItems.reduce(
        (sum, item) => sum + item.qtyInStock,
        0,
      ),
      prefix: <BarChartOutlined />,
    },
    {
      title: 'Giá trung bình',
      value: currentProductItems.length
        ? Math.round(
            currentProductItems.reduce((sum, item) => sum + item.price, 0) /
              currentProductItems.length,
          )
        : 0,
      suffix: 'đ',
      prefix: <TagOutlined />,
    },
  ];

  // Variant table columns
  const variantColumns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'images',
      key: 'images',
      width: 80,
      render: (images) => (
        <Image
          width={50}
          height={50}
          src={images?.[0] || 'https://via.placeholder.com/50x50'}
          className="rounded object-cover"
        />
      ),
    },
    {
      title: 'SKU',
      dataIndex: 'SKU',
      key: 'SKU',
      width: 150,
      render: (text) => <Text code>{text}</Text>,
    },
    {
      title: 'Cấu hình',
      dataIndex: 'configurations',
      key: 'configurations',
      width: 200,
      render: (configs) => (
        <Space wrap>
          {configs?.map((config, index) => (
            <Tag
              key={index}
              color={config.variationOption.color ? 'default' : 'blue'}
              style={
                config.variationOption.color
                  ? {
                      backgroundColor: config.variationOption.color,
                      color:
                        config.variationOption.color === '#ffffff'
                          ? '#000'
                          : '#fff',
                    }
                  : {}
              }
            >
              {config.variationOption.value}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price) => <Text strong>{price?.toLocaleString('vi-VN')}đ</Text>,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'qtyInStock',
      key: 'qtyInStock',
      width: 100,
      render: (qty) => (
        <Badge
          count={qty}
          showZero
          style={{
            backgroundColor:
              qty > 20 ? '#52c41a' : qty > 5 ? '#faad14' : '#ff4d4f',
          }}
        />
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_, record) => {
        const actions: ActionButton[] = [
          {
            type: 'edit',
            onClick: () => handleEditVariant(record),
          },
          {
            type: 'delete',
            confirmTitle: 'Xóa biến thể này?',
            onClick: () => handleDeleteVariant(record._id),
          },
        ];
        return <ActionButtons actions={actions} size="small" />;
      },
    },
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Quản lý sản phẩm"
        actionButton={{
          text: 'Thêm sản phẩm mới',
          icon: <PlusOutlined />,
          onClick: handleAddNew,
        }}
      />

      <StatisticsCards statistics={statisticsData} />

      <CustomTable
        columns={columns}
        dataSource={transformedProducts}
        loading={isLoading}
        rowKey="id"
        paginationConfig={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: true,
        }}
      />

      <CustomModal
        title={isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        open={isModalVisible}
        onCancel={closeModal}
        onSave={handleSaveProduct}
        saveText={isEditing ? 'Cập nhật' : 'Tạo sản phẩm'}
        loading={isCreating || isUpdating}
        width={'60%'}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên sản phẩm"
                name="productName"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên sản phẩm' },
                ]}
              >
                <Input size="large" placeholder="Nhập tên sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Danh mục"
                name="categoryId"
                rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
              >
                <Select size="large" placeholder="Chọn danh mục">
                  {categoriesRes?.data?.map((cat) => (
                    <Option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Mô tả sản phẩm" name="content">
            <RichTextEditor
              content={editorContent}
              onChange={setEditorContent}
              uploadPreset="tiptap_image"
            />
          </Form.Item>

          <ImageUpload
            value={fileList}
            onChange={setFileList}
            maxCount={5}
            label="Hình ảnh sản phẩm"
            required
          />
        </Form>
      </CustomModal>

      {/* Product Detail Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-3">
            <img
              src={selectedProduct?.thumbnails?.[0]}
              alt="product"
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div>
              <div className="font-semibold">
                {selectedProduct?.productName}
              </div>
              <div className="text-sm text-gray-500">Chi tiết sản phẩm</div>
            </div>
          </div>
        }
        width={1000}
        open={isDetailDrawerVisible}
        onClose={() => setIsDetailDrawerVisible(false)}
        extra={
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={handleAddVariant}
          >
            Thêm biến thể
          </Button>
        }
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Thông tin cơ bản" key="basic">
            <div className="space-y-4">
              <Row gutter={16}>
                <Col span={12}>
                  <div className="border rounded-lg p-4">
                    <Text strong>Tên sản phẩm:</Text>
                    <div className="mt-1">{selectedProduct?.productName}</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="border rounded-lg p-4">
                    <Text strong>Danh mục:</Text>
                    <div className="mt-1">
                      <Tag color="blue">{selectedProduct?.categoryName}</Tag>
                    </div>
                  </div>
                </Col>
              </Row>

              <div className="border rounded-lg p-4">
                <Text strong>Mô tả:</Text>
                <div
                  className="mt-2"
                  dangerouslySetInnerHTML={{
                    __html: selectedProduct?.content || 'Chưa có mô tả',
                  }}
                />
              </div>

              <div className="border rounded-lg p-4">
                <Text strong>Hình ảnh:</Text>
                <div className="mt-2 flex gap-2">
                  {selectedProduct?.thumbnails?.map((img, index) => (
                    <Image
                      key={index}
                      width={100}
                      height={100}
                      src={img}
                      className="rounded-lg object-cover"
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabPane>

          <TabPane
            tab={`Biến thể (${currentProductItems.length})`}
            key="variants"
          >
            <CustomTable
              columns={variantColumns}
              dataSource={currentProductItems}
              rowKey="_id"
              showCard={false}
              paginationConfig={{ pageSize: 5 }}
              size="small"
            />
          </TabPane>

          <TabPane tab="Thống kê" key="statistics">
            <StatisticsCards statistics={statisticsForDetail} span={8} />
          </TabPane>
        </Tabs>
      </Drawer>

      {/* Variant Form Modal */}
      <CustomModal
        title="Thêm biến thể mới"
        open={isVariantModalVisible}
        onCancel={closeVariantModal}
        onSave={handleSaveVariant}
        width={600}
      >
        <Form form={variantForm} layout="vertical">
          <Form.Item
            label="SKU"
            name="SKU"
            rules={[{ required: true, message: 'Vui lòng nhập SKU' }]}
          >
            <Input placeholder="VD: TSN-001-S-RED" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Giá"
                name="price"
                rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="299000"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số lượng"
                name="qtyInStock"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="100"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Cấu hình biến thể">
            <div className="space-y-3">
              <div>
                <Text strong>Size:</Text>
                <Select
                  style={{ width: '100%', marginTop: 4 }}
                  placeholder="Chọn size"
                >
                  {mockVariationOptions.var1.map((opt) => (
                    <Option key={opt._id} value={opt._id}>
                      {opt.value}
                    </Option>
                  ))}
                </Select>
              </div>

              <div>
                <Text strong>Màu sắc:</Text>
                <Select
                  style={{ width: '100%', marginTop: 4 }}
                  placeholder="Chọn màu sắc"
                >
                  {mockVariationOptions.var2.map((opt) => (
                    <Option key={opt._id} value={opt._id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: opt.color }}
                        />
                        {opt.value}
                      </div>
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </Form.Item>

          <ImageUpload
            maxCount={3}
            label="Hình ảnh biến thể"
            uploadText="Tải ảnh"
            listType="picture-card"
          />
        </Form>
      </CustomModal>
    </div>
  );
};

export default ProductManagement;
