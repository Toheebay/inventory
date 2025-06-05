
import React, { useState } from 'react';
import { Product, Category } from '../types/inventory';
import ProductCard from './ProductCard';
import { toast } from '@/hooks/use-toast';

interface ProductListProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  searchTerm: string;
  onCategoryChange: (categoryId: string) => void;
  onSearchChange: (term: string) => void;
  onUpdateProduct: (id: string, product: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  categories,
  selectedCategory,
  searchTerm,
  onCategoryChange,
  onSearchChange,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'quantity' | 'dateAdded'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: 'name' | 'price' | 'quantity' | 'dateAdded') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    let aValue: any = a[sortBy];
    let bValue: any = b[sortBy];

    if (sortBy === 'dateAdded') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      onDeleteProduct(id);
      toast({
        title: "Product Deleted",
        description: "The product has been successfully removed from inventory.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
              <input
                type="text"
                placeholder="Search products, SKU, or barcode..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-white/50">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📱 Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📋 List
              </button>
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 font-medium">Sort by:</span>
          {[
            { key: 'name', label: 'Name' },
            { key: 'price', label: 'Price' },
            { key: 'quantity', label: 'Quantity' },
            { key: 'dateAdded', label: 'Date Added' }
          ].map((sort) => (
            <button
              key={sort.key}
              onClick={() => handleSort(sort.key as any)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                sortBy === sort.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {sort.label}
              {sortBy === sort.key && (
                <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Product Count */}
      <div className="text-sm text-gray-600">
        Showing {products.length} products
        {selectedCategory !== 'all' && (
          <span> in {categories.find(c => c.id === selectedCategory)?.name}</span>
        )}
        {searchTerm && <span> matching "{searchTerm}"</span>}
      </div>

      {/* Products Grid/List */}
      {products.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              category={categories.find(c => c.id === product.categoryId)}
              viewMode={viewMode}
              onUpdate={onUpdateProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
          <p className="text-gray-500">
            {searchTerm || selectedCategory !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Start by adding your first product to the inventory'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
