import { describe, expect, it } from 'vitest';
import reducer, {
  addToCart,
  clearCart,
  decreaseQuantity,
  getCartSummary,
  removeFromCart
} from './cartSlice';

const headphones = {
  id: 'sony-wh-1000xm5',
  name: 'Sony WH-1000XM5',
  price: 85000,
  discountPrice: 79999,
  images: ['headphones.jpg']
};

describe('cartSlice', () => {
  it('adds products, increments quantity, and calculates totals with free shipping threshold', () => {
    let state = reducer(undefined, addToCart(headphones));
    state = reducer(state, addToCart(headphones));

    expect(state.items).toHaveLength(1);
    expect(state.items[0].cartQuantity).toBe(2);
    expect(getCartSummary(state)).toEqual({
      itemCount: 2,
      subtotal: 159998,
      shipping: 0,
      total: 159998,
      freeShippingRemaining: 0
    });
  });

  it('decreases and removes products without leaving zero quantity rows', () => {
    let state = reducer(undefined, addToCart(headphones));
    state = reducer(state, addToCart(headphones));
    state = reducer(state, decreaseQuantity(headphones.id));

    expect(state.items[0].cartQuantity).toBe(1);

    state = reducer(state, decreaseQuantity(headphones.id));
    expect(state.items).toHaveLength(0);

    state = reducer(undefined, addToCart(headphones));
    state = reducer(state, removeFromCart(headphones.id));
    expect(state.items).toHaveLength(0);

    state = reducer(undefined, clearCart());
    expect(state.items).toEqual([]);
  });
});
