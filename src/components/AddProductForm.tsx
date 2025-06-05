
import React, { useState } from 'react';
import { Category, Product } from '../types/inventory';
import { toast } from '@/hooks/use-toast';

interface AddProductFormProps {
  categories: Category[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({
  categories,
  onAddProduct,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    categoryId: '',
    barcode: '',
    image: '',
    sku: '',
    minStockLevel: 5,
    supplier: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateBarcode = () => {
    const barcode = Math.floor(Math.random() * 9000000000000) + 1000000000000;
    setFormData(prev => ({ ...prev, barcode: barcode.toString() }));
  };

  const generateSKU = () => {
    const prefix = formData.name.substring(0, 3).toUpperCase();
    const suffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setFormData(prev => ({ ...prev, sku: `${prefix}-${suffix}` }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.quantity < 0) newErrors.quantity = 'Quantity cannot be negative';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.barcode.trim()) newErrors.barcode = 'Barcode is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.supplier.trim()) newErrors.supplier = 'Supplier is required';
    if (formData.minStockLevel < 0) newErrors.minStockLevel = 'Min stock level cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    const newProduct: Omit<Product, 'id'> = {
      ...formData,
      dateAdded: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    onAddProduct(newProduct);
    
    toast({
      title: "Product Added",
      description: `${formData.name} has been added to inventory successfully.`,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' || name === 'minStockLevel' 
        ? Number(value) 
        : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Sample product images
  const sampleImages = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
    'https://images.unsplash.com/photo-1556618666-fcd25c85cd64?w=300',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300',
  ];

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h3>
            
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="Enter product name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${errors.description ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="Enter product description"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.categoryId ? 'border-red-500' : 'border-gray-200'}`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier *
              </label>
              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.supplier ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="Enter supplier name"
              />
              {errors.supplier && <p className="text-red-500 text-sm mt-1">{errors.supplier}</p>}
            </div>
          </div>

          {/* Pricing and Inventory */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Pricing & Inventory</h3>
            
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.price ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="0.00"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.quantity ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="0"
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>

            {/* Min Stock Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Stock Level
              </label>
              <input
                type="number"
                name="minStockLevel"
                value={formData.minStockLevel}
                onChange={handleChange}
                min="0"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.minStockLevel ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="5"
              />
              {errors.minStockLevel && <p className="text-red-500 text-sm mt-1">{errors.minStockLevel}</p>}
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.sku ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="Product SKU"
                />
                <button
                  type="button"
                  onClick={generateSKU}
                  className="px-4 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Generate
                </button>
              </div>
              {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
            </div>

            {/* Barcode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Barcode *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.barcode ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="Product barcode"
                />
                <button
                  type="button"
                  onClick={generateBarcode}
                  className="px-4 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Generate
                </button>
              </div>
              {errors.barcode && <p className="text-red-500 text-sm mt-1">{errors.barcode}</p>}
            </div>
          </div>
        </div>

        {/* Product Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Image URL
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="https://example.com/image.jpg"
          />
          
          {/* Sample Images */}
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">Or choose from sample images:</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {sampleImages.map((imageUrl, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image: imageUrl }))}
                  className={`relative overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                    formData.image === imageUrl ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={imageUrl}
                    alt={`Sample ${index + 1}`}
                    className="w-full h-16 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Image Preview */}
          {formData.image && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img
                src={formData.image}
                alt="Product preview"
                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
