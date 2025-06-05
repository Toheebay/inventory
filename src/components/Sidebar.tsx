
import React from 'react';
import { InventoryStats } from '../types/inventory';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: 'overview' | 'products' | 'add-product' | 'scanner') => void;
  onLogout: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  stats: InventoryStats;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange,
  onLogout,
  collapsed,
  onToggleCollapse,
  stats,
}) => {
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: '📊' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'add-product', label: 'Add Product', icon: '➕' },
    { id: 'scanner', label: 'Scanner', icon: '📱' },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white/90 backdrop-blur-lg shadow-2xl transition-all duration-300 z-50 border-r border-white/20 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="text-xl font-bold text-gray-800">Inventory Pro</h2>
              <p className="text-sm text-gray-600">Admin Panel</p>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-lg">{collapsed ? '→' : '←'}</span>
          </button>
        </div>
      </div>

      {/* Quick Stats (when not collapsed) */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-200/50">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Products</span>
              <span className="text-sm font-medium text-gray-800">{stats.totalProducts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Low Stock</span>
              <span className={`text-sm font-medium ${stats.lowStockItems > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {stats.lowStockItems}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Categories</span>
              <span className="text-sm font-medium text-gray-800">{stats.categories}</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id as any)}
                className={`w-full flex items-center px-3 py-3 rounded-xl transition-all duration-200 ${
                  activeView === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-gray-100 hover:transform hover:scale-105'
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200/50">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 hover:transform hover:scale-105"
        >
          <span className="text-xl mr-3">🚪</span>
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
