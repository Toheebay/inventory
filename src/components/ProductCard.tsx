
import React, { useState } from 'react';
import { Product, Category } from '../types/inventory';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  category?: Category;
  viewMode: 'grid' | 'list';
  onUpdate: (id: string, product: Partial<Product>) => void;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  category,
  viewMode,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    quantity: product.quantity,
    price: product.price,
    minStockLevel: product.minStockLevel,
  });

  const isLowStock = product.quantity <= product.minStockLevel;

  const handleSave = () => {
    onUpdate(product.id, {
      ...editForm,
      lastUpdated: new Date().toISOString().split('T')[0],
    });
    setIsEditing(false);
    toast({
      title: "Product Updated",
      description: `${product.name} has been updated successfully.`,
    });
  };

  const handleCancel = () => {
    setEditForm({
      quantity: product.quantity,
      price: product.price,
      minStockLevel: product.minStockLevel,
    });
    setIsEditing(false);
  };

  if (viewMode === 'list') {
    return (
      <div className={`bg-white/70 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/20 hover:transform hover:scale-[1.02] transition-all duration-200 ${isLowStock ? 'border-l-4 border-l-red-500' : ''}`}>
        <div className="flex items-center gap-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
            <div className="md:col-span-2">
              <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-600">SKU: {product.sku}</p>
              {category && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                  {category.icon} {category.name}
                </span>
              )}
            </div>
            
            <div className="text-center">
              {isEditing ? (
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm(prev => ({...prev, price: Number(e.target.value)}))}
                  className="w-20 px-2 py-1 border rounded text-center"
                />
              ) : (
                <div>
                  <p className="font-semibold text-green-600">${product.price}</p>
                </div>
              )}
            </div>
            
            <div className="text-center">
              {isEditing ? (
                <input
                  type="number"
                  value={editForm.quantity}
                  onChange={(e) => setEditForm(prev => ({...prev, quantity: Number(e.target.value)}))}
                  className="w-16 px-2 py-1 border rounded text-center"
                />
              ) : (
                <span className={`font-semibold ${isLowStock ? 'text-red-600' : 'text-gray-800'}`}>
                  {product.quantity}
                </span>
              )}
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">{product.barcode}</p>
            </div>
            
            <div className="flex justify-end gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                  >
                    ✓
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:transform hover:scale-105 transition-all duration-300 ${isLowStock ? 'border-l-4 border-l-red-500' : ''}`}>
      {/* Product Image */}
      <div className="relative mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-xl"
        />
        {isLowStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Low Stock
          </div>
        )}
        {category && (
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
            {category.icon} {category.name}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-bold text-lg text-gray-800 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">SKU: {product.sku}</span>
          <span className="text-sm text-gray-500">📊 {product.barcode}</span>
        </div>

        {/* Price and Quantity */}
        <div className="flex justify-between items-center">
          {isEditing ? (
            <input
              type="number"
              value={editForm.price}
              onChange={(e) => setEditForm(prev => ({...prev, price: Number(e.target.value)}))}
              className="w-24 px-2 py-1 border rounded text-center"
            />
          ) : (
            <span className="text-2xl font-bold text-green-600">${product.price}</span>
          )}
          
          {isEditing ? (
            <div className="text-center">
              <input
                type="number"
                value={editForm.quantity}
                onChange={(e) => setEditForm(prev => ({...prev, quantity: Number(e.target.value)}))}
                className="w-16 px-2 py-1 border rounded text-center mb-1"
              />
              <p className="text-xs text-gray-500">Qty</p>
            </div>
          ) : (
            <div className="text-center">
              <span className={`text-xl font-bold ${isLowStock ? 'text-red-600' : 'text-gray-800'}`}>
                {product.quantity}
              </span>
              <p className="text-xs text-gray-500">In Stock</p>
            </div>
          )}
        </div>

        {/* Supplier and Min Stock */}
        <div className="text-sm text-gray-600 space-y-1">
          <p>Supplier: {product.supplier}</p>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <span>Min Stock:</span>
              <input
                type="number"
                value={editForm.minStockLevel}
                onChange={(e) => setEditForm(prev => ({...prev, minStockLevel: Number(e.target.value)}))}
                className="w-16 px-2 py-1 border rounded text-center"
              />
            </div>
          ) : (
            <p>Min Stock Level: {product.minStockLevel}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-xl font-medium hover:bg-green-600 transition-colors"
              >
                ✓ Save
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-xl font-medium hover:bg-gray-600 transition-colors"
              >
                ✕ Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
