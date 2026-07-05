import { createSlice } from '@reduxjs/toolkit';

interface CartItem {
  id: string | number;
  quantity: number;
  
}

interface CartState {
  items: CartItem[];
  total: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    
    
    
    
    
    
    
    
    
    
    
  },
});

export default cartSlice.reducer;


