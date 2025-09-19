import React from 'react';
import { useAdmin } from '../contexts/AdminContext';
import AdminLogin from '../components/admin/AdminLogin';
import AdminPanel from '../components/admin/AdminPanel';

const Admin: React.FC = () => {
  const { isAuthenticated } = useAdmin();

  return isAuthenticated ? <AdminPanel /> : <AdminLogin />;
};

export default Admin;