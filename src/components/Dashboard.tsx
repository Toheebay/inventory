
import React, { useState, useMemo } from 'react';
import { Product, Category, InventoryStats } from '../types/inventory';
import Sidebar from './Sidebar';
import ProductList from './ProductList';
import AddProductForm from './AddProductForm';
import BarcodeScanner from './BarcodeScanner';
import StatsOverview from './StatsOverview';
import { toast } from '@/hooks/use-toast';

interface DashboardProps {
  products: Product[];
  categories: Category[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: string, product: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  products,
  categories,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onLogout,
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'products' | 'add-product' | 'scanner'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Calculate inventory statistics
  const stats: InventoryStats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const lowStockItems = products.filter(product => product.quantity <= product.minStockLevel).length;
    const recentlyAdded = products.filter(product => {
      const addedDate = new Date(product.dateAdded);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return addedDate >= weekAgo;
    }).length;

    return {
      totalProducts,
      totalValue,
      lowStockItems,
      categories: categories.length,
      recentlyAdded,
    };
  }, [products, categories]);

  // Filter products based on category and search term
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.categoryId === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm)
      );
    }

    return filtered;
  }, [products, selectedCategory, searchTerm]);

  const handleBarcodeScanned = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      toast({
        title: "Product Found",
        description: `${product.name} - Quantity: ${product.quantity}`,
      });
    } else {
      toast({
        title: "Product Not Found",
        description: `No product found with barcode: ${barcode}`,
        variant: "destructive",
      });
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
            onUpdateProduct={onUpdateProduct}
            onDeleteProduct={onDeleteProduct}
          />
        );
      case 'add-product':
        return (
          <AddProductForm
            categories={categories}
            onAddProduct={onAddProduct}
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
        onLogout={onLogout}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        stats={stats}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} lg:${sidebarCollapsed ? 'ml-16' : 'ml-64'} p-3 sm:p-6`}>
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
