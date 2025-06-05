
import React, { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import Dashboard from '../components/Dashboard';
import { Product, Category } from '../types/inventory';
import { initialCategories, initialProducts } from '../data/inventoryData';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  useEffect(() => {
    // Check if user is already logged in
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }

    // Load saved products and categories
    const savedProducts = localStorage.getItem('inventoryProducts');
    const savedCategories = localStorage.getItem('inventoryCategories');
    
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  useEffect(() => {
    // Save products to localStorage whenever they change
    localStorage.setItem('inventoryProducts', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    // Save categories to localStorage whenever they change
    localStorage.setItem('inventoryCategories', JSON.stringify(categories));
  }, [categories]);

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success);
    if (success) {
      localStorage.setItem('isAuthenticated', 'true');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updatedProduct } : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <Dashboard
      products={products}
      categories={categories}
      onAddProduct={addProduct}
      onUpdateProduct={updateProduct}
      onDeleteProduct={deleteProduct}
      onLogout={handleLogout}
    />
  );
};

export default Index;
