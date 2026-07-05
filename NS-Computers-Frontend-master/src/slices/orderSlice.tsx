import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store/store';


export interface Order {
    _id: string | number;
    orderNumber: string;
    customerName?: string;
    customerEmail?: string;
    items: Array<{
        productId: string | number;
        name: string;
        quantity: number;
        price: number;
    }>;
    totalAmount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: string;
    paymentMethod: string;
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    createdAt: string;
    updatedAt: string;
    userId?: string | number;
    username?: string;
}


interface OrderState {
    orders: Order[];
    isLoading: boolean;
    error: string | null;
    currentOrder: Order | null;
}

const initialState: OrderState = {
    orders: [],
    isLoading: false,
    error: null,
    currentOrder: null,
};


export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (_, { rejectWithValue }) => {
        try {
            console.log('Fetching orders from API...');
            
            const response = await fetch('http://localhost:3000/api/orders/get-all-orders', {
                method: 'GET',
                credentials: 'include' 
            });
            if (!response.ok) {
                const errorData = await response.text();
                console.error('Failed to fetch orders. Status:', response.status, 'Response:', errorData);
                throw new Error('Failed to fetch orders');
            }
            const data = await response.json();
            console.log('Fetched orders data:', data);
            return data.data; 
        } catch (error: any) {
            console.error('Error in fetchOrders:', error);
            return rejectWithValue(error.message || 'An error occurred while fetching orders');
        }
    }
);


export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (orderData: Omit<Order, '_id' | 'createdAt' | 'updatedAt' | 'orderNumber'>, { rejectWithValue }) => {
        try {
            
            
            let itemName = '';
            let itemPrice = 0;
            if (orderData.items && Array.isArray(orderData.items) && orderData.items.length > 0) {
                itemName = orderData.items[0].name || '';
                itemPrice = orderData.items[0].price || 0;
            }
            const payload = {
                userId: orderData.userId,
                username: orderData.username,
                itemName,
                itemPrice,
                status: orderData.status || 'pending',
            };
            console.log('Sending order payload:', payload);
            const response = await fetch('http://localhost:3000/api/orders/save-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', 
                body: JSON.stringify(payload),
            });
            
            let data;
            const responseText = await response.text();
            
            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch (jsonError) {
                console.error('Failed to parse JSON response. Raw response:', responseText);
                throw new Error(`Invalid JSON response from server: ${responseText.substring(0, 200)}`);
            }
            
            if (!response.ok) {
                console.error('Order creation failed:', {
                    status: response.status,
                    statusText: response.statusText,
                    headers: Object.fromEntries(response.headers.entries()),
                    response: data,
                    rawResponse: responseText
                });
                
                const errorMessage = data?.message || 
                                  data?.error || 
                                  response.statusText || 
                                  `Server responded with status ${response.status}`;
                throw new Error(errorMessage);
            }
            
            console.log('Order created successfully:', data);
            return data.data || data; 
        } catch (error: any) {
            console.error('Error in createOrder thunk:', error);
            return rejectWithValue(error.message || 'Error creating order');
        }
    }
);


export const updateOrder = createAsyncThunk(
    'orders/updateOrder',
    async ({ id, updatedOrderData }: { id: string | number, updatedOrderData: Partial<Order> }, { rejectWithValue }) => {
        try {
            const stringId = String(id).trim();
            const response = await fetch(`http://localhost:3000/api/orders/update-order/${stringId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedOrderData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update order');
            }
            return data.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Error updating order');
        }
    }
);


export const deleteOrder = createAsyncThunk(
    'orders/deleteOrder',
    async (id: string | number, { rejectWithValue }) => {
        try {
            const stringId = String(id).trim();
            const response = await fetch(`http://localhost:3000/api/orders/delete-order/${stringId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete order');
            }
            return id; 
        } catch (error: any) {
            return rejectWithValue(error.message || 'Error deleting order');
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
            state.currentOrder = action.payload;
        },
        clearOrderError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        
        builder.addCase(fetchOrders.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
            state.isLoading = false;
            state.orders = action.payload;
        });
        builder.addCase(fetchOrders.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        
        builder.addCase(createOrder.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
            state.isLoading = false;
            state.orders.push(action.payload);
        });
        builder.addCase(createOrder.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        
        builder.addCase(updateOrder.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(updateOrder.fulfilled, (state, action: PayloadAction<Order>) => {
            state.isLoading = false;
            const index = state.orders.findIndex(order => order._id === action.payload._id);
            if (index !== -1) {
                state.orders[index] = action.payload;
            }
            if (state.currentOrder?._id === action.payload._id) {
                state.currentOrder = action.payload;
            }
        });
        builder.addCase(updateOrder.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        
        builder.addCase(deleteOrder.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(deleteOrder.fulfilled, (state, action: PayloadAction<string | number>) => {
            state.isLoading = false;
            state.orders = state.orders.filter(order => order._id !== action.payload);
            if (state.currentOrder?._id === action.payload) {
                state.currentOrder = null;
            }
        });
        builder.addCase(deleteOrder.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });
    },
});

export const { setCurrentOrder, clearOrderError } = orderSlice.actions;
export const selectOrders = (state: RootState) => state.orders.orders;
export const selectOrderById = (orderId: string | number) => (state: RootState) =>
    state.orders.orders.find(order => order._id === orderId);

export default orderSlice.reducer;
