import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ProductData } from '../model/ProductData';


type CartProductData = ProductData & {
  id: string;
  _id?: string;
  price: number | string;
};

interface CartItem extends ProductData {
  quantity: number;
  id: string; 
}

interface UpdateQuantityPayload {
  id: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
}


const loadCartFromLocalStorage = (): CartState => {
  console.log('loadCartFromLocalStorage called');
  
  if (typeof window === 'undefined') {
    console.log('window is undefined, returning empty cart');
    return {
      items: [],
      totalQuantity: 0,
      totalAmount: 0,
    };
  }
  
  try {
    const savedCart = localStorage.getItem('cart');
    console.log('Loaded cart from localStorage:', savedCart);
    
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      console.log('Parsed cart:', parsedCart);
      
      
      if (Array.isArray(parsedCart.items) && 
          typeof parsedCart.totalQuantity === 'number' && 
          typeof parsedCart.totalAmount === 'number') {
        return parsedCart;
      } else {
        console.warn('Invalid cart structure in localStorage, returning empty cart');
      }
    } else {
      console.log('No cart found in localStorage');
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage', error);
  }
  
  console.log('Returning new empty cart');
  return {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
  };
};

const initialState: CartState = loadCartFromLocalStorage();


const ensureNumber = (price: number | string): number => {
  if (typeof price === 'number') return price;
  const num = parseFloat(price);
  return isNaN(num) ? 0 : num;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<ProductData>) => {
      console.group('=== addItemToCart ===');
      try {
        console.log('Action payload:', action.payload);
        const newItem = action.payload;
        
        if (!newItem) {
          console.error('No item provided to addItemToCart');
          return;
        }
        
        
        console.log('New item being added to cart:', {
          id: newItem.id,
          _id: newItem._id,
          title: newItem.title,
          name: newItem.name,
          price: newItem.price,
          image: newItem.image,
          images: newItem.images,
          stock: newItem.stock,
          description: newItem.description
        });
        
        
        const itemId = newItem.id || newItem._id || '';
        if (!itemId) {
          console.error('Item has no valid ID:', newItem);
          return;
        }
        console.log('Using itemId:', itemId);
        
        
        console.log('Current cart state before add:', {
          items: state.items,
          totalQuantity: state.totalQuantity,
          totalAmount: state.totalAmount
        });
        
        
        const existingItem = state.items.find(item => {
          const matches = (
            (item.id && (item.id === itemId || item.id === newItem._id)) || 
            (item._id && (item._id === itemId || item._id === newItem.id))
          );
          console.log(`Checking item:`, { 
            itemId: item.id, 
            _id: item._id, 
            matches,
            targetId: itemId,
            target_id: newItem._id
          });
          return matches;
        });
        
        console.log('Existing item in cart:', existingItem);
        
        
        let itemImage = '/images/network.jpg';
        if (newItem.images && newItem.images.length > 0) {
          itemImage = newItem.images[0];
        } else if (newItem.image) {
          itemImage = newItem.image;
        }
        console.log('Selected item image:', itemImage);
        
        if (existingItem) {
          
          console.log('Item exists in cart, increasing quantity');
          existingItem.quantity += 1;
        } else {
          
          const cartItem = {
            ...newItem,
            id: itemId,
            _id: newItem._id || newItem.id,
            quantity: 1,
            price: ensureNumber(newItem.price),
            image: itemImage,
            name: newItem.title || newItem.name || 'Unnamed Product',
            description: newItem.description || '',
            title: newItem.title || newItem.name || 'Unnamed Product',
            stock: newItem.stock || 1,
            images: newItem.images || [itemImage]
          };
          
          console.log('Adding new item to cart:', cartItem);
          state.items.push(cartItem);
        }
        
        
        state.totalQuantity += 1;
        state.totalAmount += ensureNumber(newItem.price);
        
        
        const cartState = {
          items: state.items.map(item => ({
            ...item,
            
            price: ensureNumber(item.price),
            quantity: item.quantity || 1
          })),
          totalQuantity: state.totalQuantity,
          totalAmount: state.totalAmount
        };
        
        console.log('Saving to localStorage:', cartState);
        
        
        try {
          localStorage.setItem('cart', JSON.stringify(cartState));
          console.log('Successfully saved to localStorage');
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }
        
        
        console.log('Cart state after add:', {
          items: state.items,
          totalQuantity: state.totalQuantity,
          totalAmount: state.totalAmount
        });
        
        
        try {
          const savedCart = localStorage.getItem('cart');
          console.log('Verified localStorage content:', savedCart ? JSON.parse(savedCart) : 'No cart data');
        } catch (error) {
          console.error('Error reading from localStorage:', error);
        }
      } catch (error) {
        console.error('Error in addItemToCart:', error);
      } finally {
        console.groupEnd();
      }
    },
    updateQuantity: (state, action: PayloadAction<{id: string; quantity: number}>) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === id || item._id === id);
      
      if (existingItem) {
        const price = ensureNumber(existingItem.price);
        const oldQuantity = existingItem.quantity;
        const quantityDiff = quantity - oldQuantity;
        
        existingItem.quantity = quantity;
        state.totalQuantity += quantityDiff;
        state.totalAmount += price * quantityDiff;
        
        
        state.totalQuantity = Math.max(0, state.totalQuantity);
        state.totalAmount = Math.max(0, state.totalAmount);
        
        
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id && item._id !== id);
        }
        
        
        localStorage.setItem('cart', JSON.stringify({
          items: state.items,
          totalQuantity: state.totalQuantity,
          totalAmount: state.totalAmount
        }));
      }
    },
    removeItemFromCart: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          existingItem.quantity -= 1;
        }
        
        state.totalQuantity -= 1;
        state.totalAmount -= ensureNumber(existingItem.price);
        
        
        state.totalQuantity = Math.max(0, state.totalQuantity);
        state.totalAmount = Math.max(0, state.totalAmount);
        
        
        localStorage.setItem('cart', JSON.stringify({
          items: state.items,
          totalQuantity: state.totalAmount,
          totalAmount: state.totalAmount
        }));
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      
      
      localStorage.removeItem('cart');
    },
  },
});


export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotalQuantity = (state: { cart: CartState }) => state.cart.totalQuantity;
export const selectCartTotalAmount = (state: { cart: CartState }) => state.cart.totalAmount;

export const { addItemToCart, removeItemFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;