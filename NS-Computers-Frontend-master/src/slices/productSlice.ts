
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ProductData } from "../model/ProductData";
import { backendApi } from "../services/api";
import { toast } from 'react-toastify';

interface ProductState {
    list: ProductData[];
    error: string | null | undefined;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: ProductState = {
    list: [],
    error: null,
    loading: 'idle'
}

export const getAllProducts = createAsyncThunk('products/getAllProducts',
    async (_, { rejectWithValue }) => {
        try {
            const url = "/products/get-all-products";
            console.log('🔵 [Redux] Fetching products from:', url);

            
            console.log('🔍 [Redux] Making API request to:', url);

            const response = await backendApi.get(url);

            
            console.log('🟢 [Redux] Complete API Response:', {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                data: response.data,
                dataType: typeof response.data,
                dataKeys: Object.keys(response.data || {})
            });

            if (!response.data) {
                const errorMsg = '❌ [Redux] No data in response';
                console.error(errorMsg);
                toast.error('Failed to load products: No data received');
                return rejectWithValue(errorMsg);
            }

            
            console.log('📊 [Redux] Response data structure:', {
                hasSuccess: 'success' in response.data,
                hasData: response.data && 'data' in response.data,
                hasProducts: response.data && 'products' in response.data,
                dataIsArray: Array.isArray(response.data),
                dataLength: Array.isArray(response.data) ? response.data.length : 'N/A',
                firstFewItems: Array.isArray(response.data)
                    ? response.data.slice(0, 2)
                    : 'Not an array'
            });

            
            if (Array.isArray(response.data)) {
                console.log(`✅ [Redux] Successfully fetched ${response.data.length} products`);
                if (response.data.length > 0) {
                    console.log('📦 [Redux] First product structure:', Object.keys(response.data[0]));
                }
                return response.data as ProductData[];
            }
            
            else if (response.data && response.data.success && Array.isArray(response.data.data)) {
                console.log(`✅ [Redux] Successfully fetched ${response.data.data.length} products`);
                if (response.data.data.length > 0) {
                    console.log('📦 [Redux] First product structure:', Object.keys(response.data.data[0]));
                }
                return response.data.data as ProductData[];
            }
            
            else if (response.data) {
                console.log('⚠️ [Redux] Unexpected response format, trying to extract products', response.data);
                
                const products = response.data.data || response.data.products || [];
                if (Array.isArray(products)) {
                    return products as ProductData[];
                }
                return [];
            }
            
            else {
                const errorMsg = 'Failed to load products: Invalid response format';
                console.error(`❌ [Redux] ${errorMsg}`, response.data);
                toast.error(errorMsg);
                return rejectWithValue(errorMsg);
            }
        } catch (error: any) {
            const errorDetails = {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                url: error.config?.url,
                method: error.config?.method
            };
            console.error('❌ [Redux] Error in getAllProducts:', errorDetails);
            const errorMsg = error.response?.data?.message || error.message || "Failed to fetch products";
            toast.error(`Error: ${errorMsg}`);
            return rejectWithValue(errorMsg);
        }
    }
);

export const createProduct = createAsyncThunk('products/createProduct',
    async (productData: Partial<ProductData>, { rejectWithValue }) => {
        try {
            const response = await backendApi.post("/products/save-product", productData);
            return response.data; 
        } catch (error: any) {
            console.error('Error creating product:', error);
            return rejectWithValue(error.response?.data?.message || error.message || "Failed to create product");
        }
    }
);

export const updateProduct = createAsyncThunk('products/updateProduct',
    async (productData: ProductData, { rejectWithValue }) => {
        try {
            const response = await backendApi.put(`/products/${productData.id}`, productData);
            return response.data; 
        } catch (error: any) {
            console.error('Error updating product:', error);
            return rejectWithValue(error.response?.data?.message || error.message || "Failed to update product");
        }
    }
);

export const deleteProduct = createAsyncThunk('products/deleteProduct',
    async (id: string, { rejectWithValue }) => {
        try {
            await backendApi.delete(`/products/${id}`);
            return id; 
        } catch (error: any) {
            console.error('Error deleting product:', error);
            return rejectWithValue(error.response?.data?.message || error.message || "Failed to delete product");
        }
    }
);

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            
            .addCase(createProduct.fulfilled, (state: ProductState, action: PayloadAction<ProductData>) => {
                state.list.push(action.payload);
            })
            
            .addCase(updateProduct.fulfilled, (state: ProductState, action: PayloadAction<ProductData>) => {
                const index = state.list.findIndex(product => product.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            
            .addCase(deleteProduct.fulfilled, (state: ProductState, action: PayloadAction<string>) => {
                state.list = state.list.filter(product => product.id !== action.payload);
            })
            
            .addMatcher(
                (action) =>
                    action.type === 'product/getAllProducts/fulfilled' ||
                    action.type.endsWith('getAllProducts/fulfilled'),
                (state, action: PayloadAction<ProductData[]>) => {
                    console.log('✅ [Redux] Products loaded:', action.payload?.length || 0, 'products');
                    console.log('📦 [Redux] First product:', action.payload?.[0]);
                    state.loading = 'succeeded';
                    state.list = action.payload || [];
                    state.error = null;
                    console.log('🔄 [Redux] State after update:', {
                        loading: state.loading,
                        listLength: state.list.length,
                        error: state.error
                    });
                }
            )
            .addMatcher(
                (action) =>
                    action.type === 'product/getAllProducts/pending' ||
                    action.type.endsWith('getAllProducts/pending'),
                (state) => {
                    console.log('🔄 [Redux] Loading products...');
                    state.loading = 'pending';
                    state.error = null;
                }
            )
            .addMatcher(
                (action) =>
                    action.type === 'product/getAllProducts/rejected' ||
                    action.type.endsWith('getAllProducts/rejected'),
                (state, action) => {
                    const error = action.error?.message || 'Failed to load products';
                    console.error('❌ [Redux] Failed to load products:', error);
                    state.loading = 'failed';
                    state.error = error;
                    toast.error(error);
                }
            );
    }
});

export default productSlice.reducer;
