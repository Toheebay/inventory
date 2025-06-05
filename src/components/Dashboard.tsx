
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from './Sidebar';
import ProductList from './ProductList';
import AddProductForm from './AddProductForm';
import BarcodeScanner from './BarcodeScanner';
import StatsOverview from './StatsOverview';
import { Product, Category, InventoryStats } from '../types/inventory';
import { initialCategories, initialProducts } from '../data/inventoryData';

const Dashboard: React.FC = () => {
  const { signOut, user, isAdmin } = useAuth();
  const [activeView, setActiveView] = useState<'overview' | 'products' | 'add-product' | 'scanner'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // For now, using local data - you'll replace this with API calls to your MongoDB
  const [products] = useState<Product[]>(initialProducts);
  const [categories] = useState<Category[]>(initialCategories);

  // Calculate inventory statistics
  const stats: InventoryStats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, product) => sum + (product.price * product.quantity), 0),
    lowStockItems: products.filter(product => product.quantity <= product.minStockLevel).length,
    categories: categories.length,
    recentlyAdded: products.filter(product => {
      const addedDate = new Date(product.dateAdded);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return addedDate >= weekAgo;
    }).length,
  };

  // Filter products based on category and search term
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const handleBarcodeScanned = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      console.log('Product found:', product);
    } else {
      console.log('Product not found for barcode:', barcode);
    }
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'overview':
        return <StatsOverview stats={stats} products={products} categories={categories} />;
      case 'products':
        return (
          <ProductList
            products={filteredProducts}
            categories={categories}
            selectedCategory={selectedCategory}
            searchTerm={searchTerm}
            onCategoryChange={setSelectedCategory}
            onSearchChange={setSearchTerm}
            onUpdateProduct={() => {}} // You'll implement these with API calls
            onDeleteProduct={() => {}}
          />
        );
      case 'add-product':
        return (
          <AddProductForm
            categories={categories}
            onAddProduct={() => {}} // You'll implement this with API calls
            onCancel={() => setActiveView('products')}
          />
        );
      case 'scanner':
        return <BarcodeScanner onBarcodeScanned={handleBarcodeScanned} />;
      default:
        return <StatsOverview stats={stats} products={products} categories={categories} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex relative overflow-hidden">
      {/* Floating cartoon elements - responsive positioning */}
      <div className="absolute top-10 right-10 sm:top-20 sm:right-20 text-2xl sm:text-4xl animate-bounce z-10 pointer-events-none">
        🎉
      </div>
      <div className="absolute bottom-10 right-20 sm:bottom-20 sm:right-40 text-xl sm:text-3xl animate-pulse z-10 pointer-events-none">
        💼
      </div>
      <div className="absolute top-1/3 right-5 sm:right-10 text-lg sm:text-2xl animate-spin z-10 pointer-events-none">
        ⚡
      </div>

      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onLogout={signOut}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        stats={stats}
        userEmail={user?.email || ''}
        isAdmin={isAdmin}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-12 sm:ml-16' : 'ml-48 sm:ml-64'} p-3 sm:p-6`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-4 sm:mb-8 bg-white/60 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                    {activeView === 'overview' && 'Dashboard Overview'}
                    {activeView === 'products' && 'Product Management'}
                    {activeView === 'add-product' && 'Add New Product'}
                    {activeView === 'scanner' && 'Barcode Scanner'}
                  </h1>
                  <span className="text-xl sm:text-2xl animate-bounce">
                    {activeView === 'overview' && '🌟'}
                    {activeView === 'products' && '✨'}
                    {activeView === 'add-product' && '🎯'}
                    {activeView === 'scanner' && '🔍'}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {activeView === 'overview' && 'Get insights into your inventory performance'}
                  {activeView === 'products' && 'Manage your product catalog'}
                  {activeView === 'add-product' && 'Add a new product to your inventory'}
                  {activeView === 'scanner' && 'Scan product barcodes to find items'}
                </p>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl animate-pulse">
                {activeView === 'overview' && '📊'}
                {activeView === 'products' && '📦'}
                {activeView === 'add-product' && '➕'}
                {activeView === 'scanner' && '📱'}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
