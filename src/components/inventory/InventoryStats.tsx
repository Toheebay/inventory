
import React from 'react';
import { Product, Category } from './types';

interface InventoryStatsProps {
  products: Product[];
  categories: Category[];
}

const InventoryStats: React.FC<InventoryStatsProps> = ({ products, categories }) => {
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const totalCost = products.reduce((sum, product) => sum + (product.cost * product.stock), 0);
  const totalProfit = totalValue - totalCost;
  const lowStockItems = products.filter(product => product.stock <= product.minStock).length;
  const outOfStockItems = products.filter(product => product.stock === 0).length;

  const stats = [
    {
      title: 'Total Products',
      value: products.length.toLocaleString(),
      icon: '📦',
      color: 'bg-blue-500',
    },
    {
      title: 'Inventory Value',
      value: `$${totalValue.toLocaleString()}`,
      icon: '💰',
      color: 'bg-green-500',
    },
    {
      title: 'Total Profit',
      value: `$${totalProfit.toLocaleString()}`,
      icon: '📈',
      color: 'bg-purple-500',
    },
    {
      title: 'Low Stock Alerts',
      value: lowStockItems.toString(),
      icon: '⚠️',
      color: 'bg-orange-500',
    },
    {
      title: 'Out of Stock',
      value: outOfStockItems.toString(),
      icon: '🚫',
      color: 'bg-red-500',
    },
    {
      title: 'Categories',
      value: categories.length.toString(),
      icon: '🏷️',
      color: 'bg-indigo-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:transform hover:scale-105 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-xl text-2xl`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryStats;
