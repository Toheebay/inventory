
import React from 'react';
import { Product, Category } from './types';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, categories, onEdit, onDelete }) => {
  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || '#6B7280';
  };

  const isLowStock = (product: Product) => product.stock <= product.minStock;

  if (products.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 text-center shadow-lg border border-white/20">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your search criteria or add some products</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className={`bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:transform hover:scale-105 transition-all duration-300 ${
            isLowStock(product) ? 'ring-2 ring-red-400' : ''
          }`}
        >
          {/* Product Image */}
          <div className="relative mb-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-xl"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop';
              }}
            />
            {isLowStock(product) && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Low Stock
              </div>
            )}
            <div 
              className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: getCategoryColor(product.categoryId) }}
            >
              {getCategoryName(product.categoryId)}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-3">
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2">{product.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>SKU: {product.sku}</span>
              <span>📍 {product.location}</span>
            </div>

            {/* Price and Stock */}
            <div className="flex justify-between items-center">
              <div>
                <span className="text-2xl font-bold text-green-600">${product.price}</span>
                <div className="text-xs text-gray-500">Cost: ${product.cost}</div>
              </div>
              <div className="text-right">
                <span className={`text-xl font-bold ${isLowStock(product) ? 'text-red-600' : 'text-gray-800'}`}>
                  {product.stock}
                </span>
                <p className="text-xs text-gray-500">In Stock</p>
              </div>
            </div>

            {/* Supplier and Profit */}
            <div className="text-sm text-gray-600 space-y-1">
              <p>Supplier: {product.supplier}</p>
              <p>Profit: <span className="text-green-600 font-medium">${(product.price - product.cost).toFixed(2)}</span></p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => onEdit(product)}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-xl font-medium hover:bg-blue-600 transition-colors"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
