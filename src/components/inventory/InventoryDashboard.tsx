
import React, { useState, useEffect } from 'react';
import ProductGrid from './ProductGrid';
import ProductForm from './ProductForm';
import CategoryManager from './CategoryManager';
import InventoryStats from './InventoryStats';
import SearchFilters from './SearchFilters';
import { Product, Category, InventoryData } from './types';
import { initialProducts, initialCategories } from './data';
import { toast } from '@/hooks/use-toast';

const InventoryDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [activeTab, setActiveTab] = useState<'products' | 'add-product' | 'categories'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'category'>('name');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'stock':
          return a.stock - b.stock;
        case 'category':
          const categoryA = categories.find(c => c.id === a.categoryId)?.name || '';
          const categoryB = categories.find(c => c.id === b.categoryId)?.name || '';
          return categoryA.localeCompare(categoryB);
        default:
          return 0;
      }
    });

  const handleAddProduct = (productData: Omit<Product, 'id' | 'dateAdded'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setProducts(prev => [...prev, newProduct]);
    setActiveTab('products');
    toast({
      title: "Product Added",
      description: `${newProduct.name} has been added to inventory.`,
    });
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setEditingProduct(null);
    setActiveTab('products');
    toast({
      title: "Product Updated",
      description: `${updatedProduct.name} has been updated.`,
    });
  };

  const handleDeleteProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product && window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast({
        title: "Product Deleted",
        description: `${product.name} has been removed from inventory.`,
      });
    }
  };

  const handleAddCategory = (name: string, color: string) => {
    const newCategory: Category = {
      id: `cat_${Date.now()}`,
      name,
      color,
      productCount: 0,
    };
    setCategories(prev => [...prev, newCategory]);
    toast({
      title: "Category Added",
      description: `${name} category has been created.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-lg border border-white/20">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">📦 Inventory Management</h1>
              <p className="text-gray-600">Manage your products, categories, and stock levels</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'products' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🛍️ Products
              </button>
              <button
                onClick={() => {
                  setActiveTab('add-product');
                  setEditingProduct(null);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'add-product' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                ➕ Add Product
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'categories' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🏷️ Categories
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <InventoryStats products={products} categories={categories} />

        {/* Main Content */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <SearchFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
            <ProductGrid
              products={filteredProducts}
              categories={categories}
              onEdit={(product) => {
                setEditingProduct(product);
                setActiveTab('add-product');
              }}
              onDelete={handleDeleteProduct}
            />
          </div>
        )}

        {activeTab === 'add-product' && (
          <ProductForm
            categories={categories}
            editingProduct={editingProduct}
            onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
            onCancel={() => {
              setActiveTab('products');
              setEditingProduct(null);
            }}
          />
        )}

        {activeTab === 'categories' && (
          <CategoryManager
            categories={categories}
            products={products}
            onAddCategory={handleAddCategory}
          />
        )}
      </div>
    </div>
  );
};

export default InventoryDashboard;
