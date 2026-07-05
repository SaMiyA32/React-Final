import { Product, IProduct } from '../models/product.model';
import { FilterQuery, UpdateQuery } from 'mongoose';

class ProductService {
    
    async getAllProducts(filter: FilterQuery<IProduct> = {}): Promise<IProduct[]> {
        try {
            return await Product.find(filter).sort({ createdAt: -1 });
        } catch (error) {
            console.error('Error in getAllProducts:', error);
            throw new Error('Error fetching products');
        }
    }

    
    async getProductById(id: string | number): Promise<IProduct | null> {
        try {
            
            return await Product.findById(id);
        } catch (error) {
            console.error('Error in getProductById:', error);
            throw new Error('Error finding product');
        }
    }

    
    async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
        try {
            const product = new Product(productData);
            return await product.save();
        } catch (error) {
            console.error('Error in createProduct:', error);
            throw new Error('Error creating product');
        }
    }

    
    async updateProduct(
        id: string, 
        updateData: UpdateQuery<IProduct>
    ): Promise<IProduct | null> {
        try {
            return await Product.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
        } catch (error) {
            console.error('Error in updateProduct:', error);
            throw new Error('Error updating product');
        }
    }

    
    async deleteProduct(id: string): Promise<boolean> {
        try {
            const result = await Product.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            console.error('Error in deleteProduct:', error);
            throw new Error('Error deleting product');
        }
    }

    
    async searchProducts(query: string): Promise<IProduct[]> {
        try {
            return await Product.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ]
            });
        } catch (error) {
            console.error('Error in searchProducts:', error);
            throw new Error('Error searching products');
        }
    }
}


export const productService = new ProductService();
