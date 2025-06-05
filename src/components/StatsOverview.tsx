
import React from 'react';
import { InventoryStats, Product, Category } from '../types/inventory';

interface StatsOverviewProps {
  stats: InventoryStats;
  products: Product[];
  categories: Category[];
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, products, categories }) => {
  const lowStockProducts = products.filter(p => p.quantity <= p.minStockLevel);
  const topCategories = categories
    .map(cat => ({
      ...cat,
      productCount: products.filter(p => p.categoryId === cat.id).length,
      totalValue: products
        .filter(p => p.categoryId === cat.id)
        .reduce((sum, p) => sum + (p.price * p.quantity), 0)
    }))
    .sort((a, b) => b.productCount - a.productCount)
    .slice(0, 5);

  const recentProducts = products
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalProducts}</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Value</p>
              <p className="text-3xl font-bold text-green-600">${stats.totalValue.toLocaleString()}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Low Stock Items</p>
              <p className={`text-3xl font-bold ${stats.lowStockItems > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {stats.lowStockItems}
              </p>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Categories</p>
              <p className="text-3xl font-bold text-purple-600">{stats.categories}</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </div>
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🏆</span>
            Top Categories
          </h3>
          <div className="space-y-3">
            {topCategories.map((category, index) => (
              <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{category.icon}</span>
                  <div>
                    <p className="font-medium text-gray-800">{category.name}</p>
                    <p className="text-sm text-gray-600">{category.productCount} products</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">${category.totalValue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">#{index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🚨</span>
            Low Stock Alert
          </h3>
          {lowStockProducts.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50/50 rounded-lg border-l-4 border-red-400">
                  <div className="flex items-center">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{product.quantity}</p>
                    <p className="text-sm text-gray-500">Min: {product.minStockLevel}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <p className="text-gray-600">All products are well stocked!</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🆕</span>
          Recently Added Products
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {recentProducts.map((product) => (
            <div key={product.id} className="bg-gray-50/50 rounded-lg p-4 hover:transform hover:scale-105 transition-all duration-200">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h4 className="font-medium text-gray-800 mb-1 truncate">{product.name}</h4>
              <p className="text-sm text-gray-600 mb-2">${product.price}</p>
              <p className="text-xs text-gray-500">Added: {new Date(product.dateAdded).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
