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
import { useVariationOptionByCategoryId } from '@/hooks/variation-option';
import {
  useCreateProductItem,
  useProductItems,
  useUpdateProductItem,
} from '@/hooks/product-item';

const { Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const ProductManagement = () => {
  const [form] = Form.useForm();
  const [variantForm] = Form.useForm();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data: productItems } = useProductItems({
    productId: selectedProduct?.id,
  });

  const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [fileList, setFileList] = useState([]);

  console.log(Storage.Cookie.get('token'));

  const { data: productRes, isLoading } = useProducts();
  const { data: categoriesRes } = useCategories();
  const { mutate: deleteProduct, isLoading: isDeleting } = useDeleteProduct();
  const { mutate: createProduct, isLoading: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isLoading: isUpdating } = useUpdateProduct();

  const {
    mutate: createProductVariation,
    isLoading: isCreatingProductVariation,
  } = useCreateProductItem();
  const {
    mutate: updateProductVariation,
    isLoading: isUpdatingProductVariation,
  } = useUpdateProductItem();

  const { data: variationsRes } = useVariationOptionByCategoryId(
    selectedProduct?.categoryId._id || null,
  );

  const {
    isVisible: isModalVisible,
    isEditing,
    openModal,
    closeModal,
  } = useModal();

  const {
    isVisible: isVariantModalVisible,
    isEditing: isVariantEditing,
    openModal: openVariantModal,
    closeModal: closeVariantModal,
  } = useModal();

  const transformedProducts = useMemo(() => {
    if (!productRes?.data || !Array.isArray(productRes.data)) {
      return [];
    }

    return productRes.data.map((product) => ({
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
        value: productItems?.total,
        prefix: <BgColorsOutlined />,
        valueStyle: { color: '#722ed1' },
      },
      {
        title: 'Tổng tồn kho',
        value: productItems?.data?.reduce(
          (sum, item) => sum + item.qtyInStock,
          0,
        ),
        prefix: <BarChartOutlined />,
        valueStyle: { color: '#fa8c16' },
      },
    ],
    [transformedProducts, productItems],
  );

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
        >
          <AppstoreOutlined className="text-lg" />
        </Badge>
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
            onClick: () => handleEditProduct(record),
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

  const handleViewDetail = useCallback((product) => {
    setSelectedProduct(product);
    setIsDetailDrawerVisible(true);
  }, []);

  const handleEditProduct = useCallback(
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

  const handleAddNewProduct = useCallback(() => {
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

      const newFiles: any = [];
      const existingUrls: any = [];

      fileList.forEach((file: any) => {
        if (file?.originFileObj) {
          newFiles.push(file.originFileObj);
        } else if (file.url && !file.originFileObj) {
          existingUrls.push(file.url);
        }
      });

      newFiles.forEach((file: any) => {
        formData.append('thumbnails', file);
      });

      if (existingUrls.length > 0) {
        formData.append('existingThumbnails', JSON.stringify(existingUrls));
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
    setFileList([]);
  }, [openVariantModal, variantForm]);

  const handleEditVariant = useCallback(
    (variant) => {
      openVariantModal(variant, true);
      variantForm.setFieldsValue(variant);
      setFileList(
        variant.images?.map((url, index) => ({
          uid: `${index}`,
          name: `image-${index}`,
          status: 'done',
          url,
        })) || [],
      );
    },
    [openVariantModal, variantForm],
  );

  const handleDeleteVariant = useCallback(
    (variantId) => {
      setProductItems(
        productItems?.data?.filter((item) => item._id !== variantId),
      );
    },
    [productItems],
  );

  const handleSaveProductVariant = useCallback(async () => {
    try {
      const values = await variantForm.validateFields();

      const formData = new FormData();
      formData.append('productId', selectedProduct?.id || '');
      formData.append('SKU', values.SKU || '');
      formData.append('price', values.price || '');
      formData.append('qtyInStock', values.qtyInStock || '');

      const optionIds =
        values.configurations
          ?.map((config) => config.optionId)
          .filter(Boolean) || [];
      if (optionIds.length > 0) {
        formData.append('configurations', JSON.stringify(optionIds));
      }

      const images = values.images || [];

      const newFiles: any = [];
      const existingUrls: any = [];

      images.forEach((file) => {
        if (file?.originFileObj) {
          newFiles.push(file.originFileObj);
        } else if (file.url && !file.originFileObj) {
          existingUrls.push(file.url);
        }
      });

      newFiles.forEach((file) => {
        formData.append('images', file);
      });

      if (existingUrls.length > 0) {
        formData.append('existingImages', JSON.stringify(existingUrls));
      }

      if (isVariantEditing) {
        await updateProductVariation({
          id: selectedProduct?._id ?? '',
          data: formData,
        });
      } else {
        await createProductVariation(formData);
      }

      closeVariantModal();
      variantForm.resetFields();
    } catch (error) {
      console.error('Error saving product variant:', error);
    }
  }, [variantForm, selectedProduct, , isVariantEditing, closeVariantModal]);

  const currentProductItems = productItems?.data?.filter(
    (item) => item.productId === selectedProduct?.id,
  );

  const statisticsForDetail: StatisticItem[] = [
    {
      title: 'Tổng biến thể',
      value: productItems?.total,
      prefix: <AppstoreOutlined />,
    },
    {
      title: 'Tổng tồn kho',
      value: currentProductItems?.reduce(
        (sum, item) => sum + item.qtyInStock,
        0,
      ),
      prefix: <BarChartOutlined />,
    },
    {
      title: 'Giá trung bình',
      value: currentProductItems?.length
        ? Math.round(
            currentProductItems.reduce((sum, item) => sum + item.price, 0) /
              currentProductItems?.length,
          )
        : 0,
      suffix: 'đ',
      prefix: <TagOutlined />,
    },
  ];

  const productVariantColumns = [
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
          alt="Product Image"
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
              color={
                config.variationOptionId.variationId.name === 'Màu sắc'
                  ? 'default'
                  : 'blue'
              }
              style={
                config.variationOptionId.variationId.name === 'Màu sắc' &&
                config.variationOptionId.value
                  ? {
                      backgroundColor:
                        config.variationOptionId.value === 'red'
                          ? '#ff4d4f'
                          : config.variationOptionId.value,
                      color:
                        config.variationOptionId.value === 'white' ||
                        config.variationOptionId.value === '#ffffff'
                          ? '#000'
                          : '#fff',
                    }
                  : {}
              }
            >
              {config.variationOptionId.name}
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
          onClick: handleAddNewProduct,
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
                      alt="Product Thumbnail"
                      className="rounded-lg object-cover"
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabPane>

          <TabPane tab={`Biến thể (${productItems?.total})`} key="variants">
            <CustomTable
              columns={productVariantColumns}
              dataSource={productItems?.data}
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

      <CustomModal
        title={
          isVariantEditing
            ? 'Chỉnh sửa biến thể sản phẩm'
            : 'Thêm biến thể sản phẩm mới'
        }
        open={isVariantModalVisible}
        onCancel={closeVariantModal}
        onSave={handleSaveProductVariant}
        width={600}
        saveText={isVariantEditing ? 'Cập nhật' : 'Tạo biến thể sản phẩm'}
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
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, '') ?? ''}
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

          {variationsRes?.map((item: any, index) => (
            <Form.Item
              key={index}
              name={['configurations', index, 'optionId']}
              label={item.variation.name}
              rules={[
                {
                  required: true,
                  message: `Vui lòng chọn ${item.variation.name.toLowerCase()}`,
                },
              ]}
            >
              <Select
                style={{ width: '100%' }}
                placeholder={`Chọn ${item.variation.name.toLowerCase()}`}
              >
                {item.options.map((opt: any) => (
                  <Option key={opt._id} value={opt._id}>
                    {opt.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          ))}

          <Form.Item name="images">
            <ImageUpload label="Hình ảnh biến thể" maxCount={3} />
          </Form.Item>
        </Form>
      </CustomModal>
    </div>
  );
};

export default ProductManagement;
