
import { Category, Product } from '../types/inventory';

export const initialCategories: Category[] = [
  { id: '1', name: 'Electronics', description: 'Electronic devices and accessories', icon: '📱', color: 'bg-blue-500' },
  { id: '2', name: 'Clothing', description: 'Apparel and fashion items', icon: '👕', color: 'bg-purple-500' },
  { id: '3', name: 'Home & Garden', description: 'Home improvement and gardening supplies', icon: '🏠', color: 'bg-green-500' },
  { id: '4', name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear', icon: '⚽', color: 'bg-orange-500' },
  { id: '5', name: 'Books & Media', description: 'Books, movies, and media content', icon: '📚', color: 'bg-indigo-500' },
  { id: '6', name: 'Health & Beauty', description: 'Health and beauty products', icon: '💄', color: 'bg-pink-500' },
  { id: '7', name: 'Automotive', description: 'Car parts and automotive supplies', icon: '🚗', color: 'bg-gray-500' },
  { id: '8', name: 'Toys & Games', description: 'Toys and gaming products', icon: '🎮', color: 'bg-red-500' },
  { id: '9', name: 'Food & Beverages', description: 'Food items and beverages', icon: '🍕', color: 'bg-yellow-500' },
  { id: '10', name: 'Office Supplies', description: 'Office and business supplies', icon: '📋', color: 'bg-teal-500' },
  { id: '11', name: 'Kitchen & Dining', description: 'Kitchen appliances and dining items', icon: '🍽️', color: 'bg-amber-500' },
  { id: '12', name: 'Pet Supplies', description: 'Pet food and accessories', icon: '🐕', color: 'bg-lime-500' },
  { id: '13', name: 'Baby & Kids', description: 'Baby and children products', icon: '👶', color: 'bg-rose-500' },
  { id: '14', name: 'Musical Instruments', description: 'Musical instruments and accessories', icon: '🎵', color: 'bg-violet-500' },
  { id: '15', name: 'Jewelry & Watches', description: 'Jewelry and timepieces', icon: '💎', color: 'bg-emerald-500' },
  { id: '16', name: 'Luggage & Travel', description: 'Travel gear and luggage', icon: '🧳', color: 'bg-cyan-500' },
  { id: '17', name: 'Craft & Hobby', description: 'Craft supplies and hobby items', icon: '🎨', color: 'bg-fuchsia-500' },
  { id: '18', name: 'Hardware & Tools', description: 'Tools and hardware supplies', icon: '🔧', color: 'bg-slate-500' },
  { id: '19', name: 'Pharmacy', description: 'Pharmaceutical and medical supplies', icon: '💊', color: 'bg-red-400' },
  { id: '20', name: 'Photography', description: 'Camera and photography equipment', icon: '📷', color: 'bg-blue-400' },
  { id: '21', name: 'Furniture', description: 'Home and office furniture', icon: '🪑', color: 'bg-amber-600' },
  { id: '22', name: 'Party Supplies', description: 'Party and celebration items', icon: '🎉', color: 'bg-pink-400' },
  { id: '23', name: 'Stationery', description: 'Writing and drawing supplies', icon: '✏️', color: 'bg-blue-300' },
  { id: '24', name: 'Lighting', description: 'Lighting fixtures and bulbs', icon: '💡', color: 'bg-yellow-400' },
  { id: '25', name: 'Cleaning Supplies', description: 'Cleaning and maintenance products', icon: '🧽', color: 'bg-green-400' },
  { id: '26', name: 'Appliances', description: 'Home and kitchen appliances', icon: '🔌', color: 'bg-gray-400' },
  { id: '27', name: 'Textiles', description: 'Fabrics and textile materials', icon: '🧶', color: 'bg-purple-400' },
  { id: '28', name: 'Safety & Security', description: 'Safety and security equipment', icon: '🛡️', color: 'bg-orange-400' },
  { id: '29', name: 'Garden Tools', description: 'Gardening tools and equipment', icon: '🌱', color: 'bg-green-600' },
  { id: '30', name: 'Collectibles', description: 'Collectible and antique items', icon: '🏺', color: 'bg-indigo-400' },
];

export const initialProducts: Product[] = [
  // Electronics
  { id: '1', name: 'iPhone 15 Pro', description: 'Latest Apple smartphone', price: 999, quantity: 50, categoryId: '1', barcode: '1234567890123', image: 'https://images.unsplash.com/photo-1592910147372-7a2cdcb35fea?w=300', sku: 'IP15P-001', minStockLevel: 10, supplier: 'Apple Inc.', dateAdded: '2024-01-15', lastUpdated: '2024-01-15' },
  { id: '2', name: 'Samsung Galaxy S24', description: 'Flagship Android phone', price: 849, quantity: 35, categoryId: '1', barcode: '1234567890124', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300', sku: 'SGS24-001', minStockLevel: 10, supplier: 'Samsung', dateAdded: '2024-01-16', lastUpdated: '2024-01-16' },
  { id: '3', name: 'MacBook Air M3', description: '13-inch laptop with M3 chip', price: 1299, quantity: 25, categoryId: '1', barcode: '1234567890125', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300', sku: 'MBA-M3-001', minStockLevel: 5, supplier: 'Apple Inc.', dateAdded: '2024-01-17', lastUpdated: '2024-01-17' },
  
  // Clothing
  { id: '4', name: 'Nike Air Max 270', description: 'Comfortable running shoes', price: 150, quantity: 80, categoryId: '2', barcode: '2234567890123', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300', sku: 'NAM270-001', minStockLevel: 20, supplier: 'Nike', dateAdded: '2024-01-18', lastUpdated: '2024-01-18' },
  { id: '5', name: 'Levi\'s 501 Jeans', description: 'Classic straight-leg jeans', price: 89, quantity: 120, categoryId: '2', barcode: '2234567890124', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300', sku: 'LV501-001', minStockLevel: 25, supplier: 'Levi Strauss', dateAdded: '2024-01-19', lastUpdated: '2024-01-19' },
  
  // Home & Garden
  { id: '6', name: 'Dyson V15 Detect', description: 'Cordless vacuum cleaner', price: 449, quantity: 30, categoryId: '3', barcode: '3234567890123', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300', sku: 'DV15D-001', minStockLevel: 8, supplier: 'Dyson', dateAdded: '2024-01-20', lastUpdated: '2024-01-20' },
  { id: '7', name: 'Instant Pot Duo 7-in-1', description: 'Multi-use pressure cooker', price: 99, quantity: 45, categoryId: '3', barcode: '3234567890124', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300', sku: 'IPD7-001', minStockLevel: 12, supplier: 'Instant Brands', dateAdded: '2024-01-21', lastUpdated: '2024-01-21' },
  
  // Sports & Outdoors
  { id: '8', name: 'Wilson Pro Staff Tennis Racket', description: 'Professional tennis racket', price: 199, quantity: 40, categoryId: '4', barcode: '4234567890123', image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300', sku: 'WPS-001', minStockLevel: 10, supplier: 'Wilson', dateAdded: '2024-01-22', lastUpdated: '2024-01-22' },
  { id: '9', name: 'Yeti Rambler Tumbler', description: 'Insulated travel mug', price: 35, quantity: 100, categoryId: '4', barcode: '4234567890124', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300', sku: 'YRT-001', minStockLevel: 25, supplier: 'Yeti', dateAdded: '2024-01-23', lastUpdated: '2024-01-23' },
  
  // Books & Media
  { id: '10', name: 'The Psychology of Money', description: 'Financial wisdom book', price: 18, quantity: 75, categoryId: '5', barcode: '5234567890123', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300', sku: 'POM-001', minStockLevel: 20, supplier: 'Harriman House', dateAdded: '2024-01-24', lastUpdated: '2024-01-24' },
  
  // Additional products across various categories
  { id: '11', name: 'L\'Oreal Paris Lipstick', description: 'Rouge signature matte lipstick', price: 12, quantity: 150, categoryId: '6', barcode: '6234567890123', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300', sku: 'LOR-LS-001', minStockLevel: 30, supplier: 'L\'Oreal', dateAdded: '2024-01-25', lastUpdated: '2024-01-25' },
  { id: '12', name: 'Mobil 1 Motor Oil', description: 'Synthetic motor oil 5W-30', price: 28, quantity: 60, categoryId: '7', barcode: '7234567890123', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300', sku: 'MOB1-5W30', minStockLevel: 15, supplier: 'ExxonMobil', dateAdded: '2024-01-26', lastUpdated: '2024-01-26' },
  { id: '13', name: 'LEGO Creator Expert Set', description: 'Advanced building set for adults', price: 89, quantity: 35, categoryId: '8', barcode: '8234567890123', image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300', sku: 'LEGO-CE-001', minStockLevel: 8, supplier: 'LEGO Group', dateAdded: '2024-01-27', lastUpdated: '2024-01-27' },
  { id: '14', name: 'Organic Coffee Beans', description: 'Premium arabica coffee beans', price: 15, quantity: 200, categoryId: '9', barcode: '9234567890123', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300', sku: 'OCB-001', minStockLevel: 50, supplier: 'Green Mountain Coffee', dateAdded: '2024-01-28', lastUpdated: '2024-01-28' },
  { id: '15', name: 'Staples Copy Paper', description: 'White multipurpose paper 500 sheets', price: 8, quantity: 300, categoryId: '10', barcode: '1034567890123', image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300', sku: 'SCP-500', minStockLevel: 75, supplier: 'Staples', dateAdded: '2024-01-29', lastUpdated: '2024-01-29' },
];
