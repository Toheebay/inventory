
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface LoginFormProps {
  onLogin: (success: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate loading
    setTimeout(() => {
      if (credentials.username === 'admin' && credentials.password === 'toheeb1') {
        toast({
          title: "Login Successful",
          description: "Welcome to the Inventory Management System",
        });
        onLogin(true);
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
        onLogin(false);
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden px-4 py-8">
      {/* Animated background elements - responsive sizing */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-20 left-20 sm:top-40 sm:left-40 w-40 h-40 sm:w-80 sm:h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Welcoming cartoon character - responsive positioning */}
      <div className="absolute top-4 right-4 sm:top-10 sm:right-10 text-4xl sm:text-8xl animate-bounce">
        🤖
      </div>
      <div className="absolute bottom-4 left-4 sm:bottom-10 sm:left-10 text-3xl sm:text-6xl animate-pulse">
        📦
      </div>
      <div className="absolute top-1/4 left-1/4 text-2xl sm:text-4xl animate-spin">
        ⭐
      </div>

      <div className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto">
        {/* Logo and Title */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-3 sm:mb-4 flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-2xl sm:text-3xl text-white">📦</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Inventory Pro</h1>
          <p className="text-sm sm:text-base text-gray-600">World-class inventory management system</p>
          
          {/* Welcome message with cartoon */}
          <div className="mt-3 sm:mt-4 p-3 bg-yellow-100 rounded-xl border-2 border-yellow-300">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl sm:text-2xl">👋</span>
              <p className="text-xs sm:text-sm text-yellow-800 font-medium">Welcome! Ready to manage your inventory?</p>
              <span className="text-xl sm:text-2xl">😊</span>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 sm:py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="mr-2">🚀</span>
                  Sign In
                </div>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
            <div className="flex items-center mb-1">
              <span className="text-base sm:text-lg mr-2">🔑</span>
              <p className="text-xs sm:text-sm text-blue-800 font-medium">Demo Credentials:</p>
            </div>
            <p className="text-xs sm:text-sm text-blue-700">Username: <span className="font-mono bg-blue-100 px-1 rounded">admin</span></p>
            <p className="text-xs sm:text-sm text-blue-700">Password: <span className="font-mono bg-blue-100 px-1 rounded">toheeb1</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
