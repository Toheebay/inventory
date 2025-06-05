
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: string;
  barcode: string;
  image: string;
  sku: string;
  minStockLevel: number;
  supplier: string;
  dateAdded: string;
  lastUpdated: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface InventoryStats {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  categories: number;
  recentlyAdded: number;
}
