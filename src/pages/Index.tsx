
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/auth/AuthForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Dashboard from '../components/Dashboard';

const Index = () => {
  const { user } = useAuth();

  if (!user) {
    return <AuthForm />;
  }

  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
};

export default Index;
