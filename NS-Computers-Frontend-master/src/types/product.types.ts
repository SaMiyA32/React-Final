
export interface IProduct {
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


export interface IProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}


export const defaultProduct: IProduct = {
  _id: '',
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  imageUrl: '',
  createdAt: new Date(),
  updatedAt: new Date()
};


export const defaultProductFormData: IProductFormData = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  imageUrl: ''
};
