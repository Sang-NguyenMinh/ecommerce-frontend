// redux/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';

export interface CartItem {
  _id: string;
  productItemId: {
    _id: string;
    productId: {
      _id: string;
      productName: string;
      thumbnail?: string;
    };
    SKU: string;
    price: number;
    images: string[];
  };
  qty: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
}

const initialState: CartState = {
  items: [],
  isLoading: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const newItem = action.payload;

      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.productItemId._id === newItem.productItemId._id &&
          item.selectedColor === newItem.selectedColor &&
          item.selectedSize === newItem.selectedSize,
      );

      if (existingItemIndex > -1) {
        state.items[existingItemIndex].qty += newItem.qty;
        message.success('Đã cập nhật số lượng trong giỏ hàng');
      } else {
        state.items.push(newItem);
        message.success('Đã thêm sản phẩm vào giỏ hàng');
      }
    },

    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item._id !== action.payload);
      message.success('Đã xóa sản phẩm khỏi giỏ hàng');
    },

    updateQuantity(
      state,
      action: PayloadAction<{ itemId: string; quantity: number }>,
    ) {
      const { itemId, quantity } = action.payload;

      if (quantity < 1) return;

      const item = state.items.find((item) => item._id === itemId);
      if (item) {
        item.qty = quantity;
      }
    },

    clearCart(state) {
      state.items = [];
      message.success('Đã xóa tất cả sản phẩm trong giỏ hàng');
    },

    removeSelectedItems(state, action: PayloadAction<string[]>) {
      const itemIds = action.payload;
      state.items = state.items.filter((item) => !itemIds.includes(item._id));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  removeSelectedItems,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;

export const selectCartItemsCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.qty, 0);

export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce(
    (total, item) => total + item.productItemId.price * item.qty,
    0,
  );

export const selectSelectedItemsTotal = (
  state: { cart: CartState },
  selectedIds: string[],
) =>
  state.cart.items
    .filter((item) => selectedIds.includes(item._id))
    .reduce((total, item) => total + item.productItemId.price * item.qty, 0);

export default cartSlice.reducer;
