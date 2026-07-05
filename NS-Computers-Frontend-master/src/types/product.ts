
interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

type IProductFormData = Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>;


export type Product = IProduct;
export type ProductFormData = IProductFormData;


export const Product = (props: IProduct): IProduct => ({
  _id: '',
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  ...props
});

export const createProduct = (props: IProductFormData): IProductFormData => ({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  ...props
});
