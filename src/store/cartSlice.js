import { createSlice } from '@reduxjs/toolkit';

const hasUsableStorage = () =>
  typeof localStorage !== 'undefined' &&
  typeof localStorage.getItem === 'function' &&
  typeof localStorage.setItem === 'function';

const readCart = () => {
  if (!hasUsableStorage()) return [];

  try {
    return JSON.parse(localStorage.getItem('cartItems') || '[]');
  } catch {
    return [];
  }
};

const persistCart = (items) => {
  if (hasUsableStorage()) {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }
};

const effectivePrice = (product) => Number(product.discountPrice || product.price || 0);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: readCart()
  },
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existing = state.items.find((item) => item.id === product.id);

      if (existing) {
        existing.cartQuantity += 1;
      } else {
        state.items.push({ ...product, cartQuantity: 1 });
      }

      persistCart(state.items);
    },
    decreaseQuantity(state, action) {
      const productId = action.payload;
      const existing = state.items.find((item) => item.id === productId);

      if (!existing) return;
      existing.cartQuantity -= 1;
      if (existing.cartQuantity <= 0) {
        state.items = state.items.filter((item) => item.id !== productId);
      }

      persistCart(state.items);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      persistCart(state.items);
    },
    clearCart(state) {
      state.items = [];
      persistCart(state.items);
    }
  }
});

export const { addToCart, clearCart, decreaseQuantity, removeFromCart } = cartSlice.actions;

export const getCartSummary = (cartState) => {
  const subtotal = cartState.items.reduce(
    (sum, item) => sum + effectivePrice(item) * item.cartQuantity,
    0
  );
  const itemCount = cartState.items.reduce((sum, item) => sum + item.cartQuantity, 0);
  const shipping = subtotal === 0 || subtotal >= 5000 ? 0 : 250;

  return {
    itemCount,
    subtotal,
    shipping,
    total: subtotal + shipping,
    freeShippingRemaining: subtotal >= 5000 || subtotal === 0 ? 0 : 5000 - subtotal
  };
};

export default cartSlice.reducer;
