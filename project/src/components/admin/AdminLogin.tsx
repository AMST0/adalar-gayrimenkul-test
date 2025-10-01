import React, { useState } from 'react';
import { Shield, Lock, User, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import Button from '../common/Button';

const AdminLogin: React.FC = () => {
  const { login } = useAdmin();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const success = await login(credentials.email, credentials.password);
    if (!success) {
      setError('E-posta veya şifre hatalı!');
    }
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full mx-4">
        <div className="relative bg-white/95 backdrop-blur rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-red-600 rounded-full opacity-10 blur-2xl" />
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-yellow-400 rounded-full opacity-10 blur-3xl" />
          {/* Header */}
          <div className="relative bg-gradient-to-r from-red-600 to-red-700 p-8 text-center">
            <div className="absolute top-4 left-4">
              <Link to="/" className="inline-flex items-center text-white/90 hover:text-white text-sm font-medium transition-colors">
                <Home className="w-4 h-4 mr-2" /> Anasayfa
              </Link>
            </div>
            <div className="w-20 h-20 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Shield className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Admin Panel</h1>
            <p className="text-red-100 text-sm">Adalar Gayrimenkul Yönetim Sistemi</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-bold text-gray-700">
                  E-posta
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-300"
                    placeholder="E-posta adresinizi girin"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-300"
                    placeholder="Şifrenizi girin"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-6 rounded-xl font-bold text-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Giriş Yapılıyor...
                  </div>
                ) : (
                  'Giriş Yap'
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-xs text-gray-400">
              Güvenli bölge • Yetkisiz erişim engellenir
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;