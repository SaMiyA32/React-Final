export interface ProductData {
    _id: string;
    title: string;
    price: number;
    originalPrice?: number;
    rating?: number;
    reviewCount?: number;
    images: string[]; 
    image?: string; 
    imageUrl?: string; 
    category?: string;
    isNew?: boolean;
    isOnSale?: boolean;
    stock: number;
    description: string;
    brand?: string;
    specifications?: Record<string, string>;
    createdAt?: string;
    updatedAt?: string;
}
