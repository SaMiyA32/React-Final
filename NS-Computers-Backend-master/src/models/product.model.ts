import { Document, Schema, model, Model } from 'mongoose';


export interface IProduct extends Document {
    _id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl?: string;
    rating?: number;
    specs?: string[];
    currency?: string;
    isOnSale?: boolean;
    originalPrice?: number;
    createdAt: Date;
    updatedAt: Date;
}


interface ICounter extends Document {
    _id: string;
    seq: number;
}

const counterSchema = new Schema<ICounter>({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1 }
});

const Counter = model<ICounter>('ProductCounter', counterSchema);


interface IProductModel extends Model<IProduct> {
    
}


const productSchema = new Schema<IProduct, IProductModel>(
    {
        _id: { type: Number },
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        category: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: false
        },
        rating: { 
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        specs: { 
            type: [String], 
            default: []
        },
        currency: { 
            type: String,
            default: "LKR"
        },
        isOnSale: { 
            type: Boolean,
            default: false
        },
        originalPrice: { 
            type: Number,
            min: 0,
            required: function(this: IProduct) { return this.isOnSale === true; } 
        }
    },
    {
        timestamps: true 
    }
);


productSchema.pre<IProduct>('save', async function(next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'productId' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this._id = counter.seq;
            next();
        } catch (error) {
            next(error as Error);
        }
    } else {
        next();
    }
});


const Product = model<IProduct, IProductModel>('Product', productSchema);

export { Product };

export type { IProduct as ProductDocument };
export type ProductModel = typeof Product;
