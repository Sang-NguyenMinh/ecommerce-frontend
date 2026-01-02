export enum OrderStatusEnum {
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

export enum PaymentTypeEnum {
  CASH = 'Cash',
  BANK_TRANSFER = 'Bank Transfer',
  MOMO = 'MoMo',
  PAYPAL = 'PayPal',
}
export const ORDER_STATUS_META: Record<
  OrderStatusEnum,
  {
    text: string;
    color: string;
    next: OrderStatusEnum[];
  }
> = {
  PAYMENT_FAILED: {
    text: 'Thanh toán thất bại',
    color: 'red',
    next: [],
  },
  PAYMENT_PENDING: {
    text: 'Chờ thanh toán',
    color: 'orange',
    next: [OrderStatusEnum.PAYMENT_SUCCESS, OrderStatusEnum.PAYMENT_FAILED],
  },
  PAYMENT_SUCCESS: {
    text: 'Đã thanh toán',
    color: 'green',
    next: [OrderStatusEnum.PENDING],
  },

  PENDING: {
    text: 'Chờ xác nhận',
    color: 'default',
    next: [OrderStatusEnum.CONFIRMED, OrderStatusEnum.CANCELLED],
  },
  CONFIRMED: {
    text: 'Đã xác nhận',
    color: 'blue',
    next: [OrderStatusEnum.PROCESSING, OrderStatusEnum.CANCELLED],
  },
  PROCESSING: {
    text: 'Đang xử lý',
    color: 'cyan',
    next: [OrderStatusEnum.SHIPPING],
  },
  SHIPPING: {
    text: 'Đang vận chuyển',
    color: 'purple',
    next: [OrderStatusEnum.DELIVERED, OrderStatusEnum.RETURNED],
  },
  DELIVERED: {
    text: 'Đã giao hàng',
    color: 'green',
    next: [],
  },
  CANCELLED: {
    text: 'Đã hủy',
    color: 'red',
    next: [],
  },
  RETURNED: {
    text: 'Hoàn trả',
    color: 'volcano',
    next: [],
  },
};

export function getStatusText(status?: string) {
  return ORDER_STATUS_META[status as OrderStatusEnum]?.text ?? 'Không xác định';
}

export function getStatusColor(status?: string) {
  return ORDER_STATUS_META[status as OrderStatusEnum]?.color ?? 'default';
}
