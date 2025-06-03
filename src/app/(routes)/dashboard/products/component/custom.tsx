// 1. components/common/PageHeader.tsx
import React from 'react';
import { Typography, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionButton?: {
    text: string;
    icon?: React.ReactNode;
    onClick: () => void;
    type?: 'primary' | 'default';
  };
  extra?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actionButton,
  extra,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <Title level={2} className="!mb-0">
          {title}
        </Title>
        {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <Space>
        {extra}
        {actionButton && (
          <Button
            type={actionButton.type || 'primary'}
            size="large"
            icon={actionButton.icon || <PlusOutlined />}
            onClick={actionButton.onClick}
          >
            {actionButton.text}
          </Button>
        )}
      </Space>
    </div>
  );
};

// 2. components/common/StatisticsCards.tsx
import { Row, Col, Card, Statistic } from 'antd';

export interface StatisticItem {
  title: string;
  value: number;
  prefix?: React.ReactNode;
  suffix?: string;
  valueStyle?: React.CSSProperties;
}

interface StatisticsCardsProps {
  statistics: StatisticItem[];
  gutter?: number;
  span?: number;
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  statistics,
  gutter = 16,
  span = 6,
}) => {
  return (
    <Row gutter={gutter} className="mb-6">
      {statistics.map((stat, index) => (
        <Col span={span} key={index}>
          <Card>
            <Statistic
              title={stat.title}
              value={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
              valueStyle={stat.valueStyle}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

// 3. components/common/CustomTable.tsx
import { Table, TableProps } from 'antd';

interface CustomTableProps extends Omit<TableProps<any>, 'pagination'> {
  title?: string;
  showCard?: boolean;
  paginationConfig?: {
    pageSize?: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    showTotal?: boolean;
  };
}

export const CustomTable: React.FC<CustomTableProps> = ({
  title,
  showCard = true,
  paginationConfig = {},
  ...tableProps
}) => {
  const { showTotal: showTotalEnabled, ...restPaginationConfig } =
    paginationConfig;

  const defaultPagination = {
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    ...(showTotalEnabled !== false && {
      showTotal: (total: number, range: [number, number]) =>
        `${range[0]}-${range[1]} của ${total} mục`,
    }),
    ...restPaginationConfig,
  };

  const tableElement = <Table {...tableProps} pagination={defaultPagination} />;

  if (showCard) {
    return <Card title={title}>{tableElement}</Card>;
  }

  return tableElement;
};

// 4. components/common/CustomModal.tsx
import { Modal, ModalProps } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

interface CustomModalProps extends Omit<ModalProps, 'footer'> {
  form?: any;
  onSave?: () => void;
  onCancel?: () => void;
  saveText?: string;
  cancelText?: string;
  loading?: boolean;
  showFooter?: boolean;
  customFooter?: React.ReactNode;
}

export const CustomModal: React.FC<CustomModalProps> = ({
  form,
  onSave,
  onCancel,
  saveText = 'Lưu',
  cancelText = 'Hủy',
  loading = false,
  showFooter = true,
  customFooter,
  children,
  ...modalProps
}) => {
  const footer = showFooter
    ? customFooter || (
        <Space>
          <Button size="large" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={onSave}
            loading={loading}
            icon={<SaveOutlined />}
          >
            {saveText}
          </Button>
        </Space>
      )
    : null;

  return (
    <Modal {...modalProps} onCancel={onCancel} footer={footer}>
      {children}
    </Modal>
  );
};

// 5. components/common/ImageUpload.tsx
import { Upload, Form } from 'antd';
import { PictureOutlined } from '@ant-design/icons';

interface ImageUploadProps {
  value?: any[];
  onChange?: (fileList: any[]) => void;
  maxCount?: number;
  listType?: 'picture-card' | 'picture';
  label?: string;
  required?: boolean;
  uploadText?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value = [],
  onChange,
  maxCount = 5,
  listType = 'picture-card',
  label = 'Hình ảnh',
  required = false,
  uploadText = 'Tải ảnh',
}) => {
  const handleChange = ({ fileList }: any) => {
    onChange?.(fileList);
  };

  const uploadButton = (
    <div>
      {listType === 'picture-card' ? <PlusOutlined /> : <PictureOutlined />}
      <div style={{ marginTop: 8 }}>{uploadText}</div>
    </div>
  );

  return (
    <Form.Item label={label} required={required}>
      <Upload
        listType={listType}
        fileList={value}
        onChange={handleChange}
        beforeUpload={() => false}
        maxCount={maxCount}
      >
        {value.length >= maxCount ? null : uploadButton}
      </Upload>
    </Form.Item>
  );
};

import { Tooltip, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

export interface ActionButton {
  type: 'view' | 'edit' | 'delete' | 'custom';
  tooltip?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  confirmTitle?: string;
  confirmOkText?: string;
  confirmCancelText?: string;
}

interface ActionButtonsProps {
  actions: ActionButton[];
  size?: 'small' | 'middle' | 'large';
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  actions,
  size = 'small',
}) => {
  const getDefaultIcon = (type: string) => {
    switch (type) {
      case 'view':
        return <EyeOutlined />;
      case 'edit':
        return <EditOutlined />;
      case 'delete':
        return <DeleteOutlined />;
      default:
        return null;
    }
  };

  const renderButton = (action: ActionButton, index: number) => {
    // Đối với button delete có confirm, không set onClick trực tiếp
    const shouldUseDirectClick = !(
      action.type === 'delete' && action.confirmTitle
    );

    const button = (
      <Button
        type={
          action.type === 'view'
            ? 'primary'
            : action.type === 'edit'
              ? 'primary'
              : 'default'
        }
        ghost={action.type === 'view'}
        danger={action.danger || action.type === 'delete'}
        size={size}
        icon={action.icon || getDefaultIcon(action.type)}
        onClick={shouldUseDirectClick ? action.onClick : undefined} // ✅ Chỉ set onClick nếu không có confirm
        disabled={action.disabled}
      />
    );

    const wrappedButton = action.tooltip ? (
      <Tooltip title={action.tooltip} key={index}>
        {button}
      </Tooltip>
    ) : (
      <div key={index}>{button}</div>
    );

    // Nếu là delete action và có confirmTitle, wrap với Popconfirm
    if (action.type === 'delete' && action.confirmTitle) {
      return (
        <Popconfirm
          key={index}
          title={action.confirmTitle}
          description="Hành động này không thể hoàn tác!"
          onConfirm={action.onClick} // ✅ Chỉ gọi khi user confirm
          okText={action.confirmOkText || 'Xóa'}
          cancelText={action.confirmCancelText || 'Hủy'}
          okType="danger" // Thêm style cho button OK
          placement="topRight" // Vị trí hiển thị popup
        >
          {wrappedButton}
        </Popconfirm>
      );
    }

    return wrappedButton;
  };

  return <Space>{actions.map(renderButton)}</Space>;
};

import { useState, useCallback } from 'react';

export function useModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const openModal = useCallback((item = null, editing = false) => {
    setSelectedItem(item);
    setIsEditing(editing);
    setIsVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsVisible(false);
    setSelectedItem(null);
    setIsEditing(false);
  }, []);

  return {
    isVisible,
    selectedItem,
    isEditing,
    openModal,
    closeModal,
  };
}
