import { createSlice } from '@reduxjs/toolkit';

const hasUsableStorage = () =>
  typeof localStorage !== 'undefined' &&
  typeof localStorage.getItem === 'function' &&
  typeof localStorage.setItem === 'function';

const readWishlist = () => {
  if (!hasUsableStorage()) return [];
  try {
    return JSON.parse(localStorage.getItem('wishlistItems') || '[]');
  } catch {
    return [];
  }
};

const persistWishlist = (items) => {
  if (hasUsableStorage()) {
    localStorage.setItem('wishlistItems', JSON.stringify(items));
  }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: readWishlist()
  },
  reducers: {
    toggleWishlist(state, action) {
      const id = action.payload;
      const idx = state.items.indexOf(id);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.push(id);
      }
      persistWishlist(state.items);
    }
  }
});

export const { toggleWishlist } = wishlistSlice.actions;
export const selectIsWishlisted = (state, id) => state.wishlist.items.includes(id);
export default wishlistSlice.reducer;
