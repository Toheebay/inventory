
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  sku: string;
  barcode?: string;
  categoryId: string;
  image: string;
  dateAdded: string;
  supplier?: string;
  location?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  productCount: number;
}

export interface InventoryData {
  products: Product[];
  categories: Category[];
}
