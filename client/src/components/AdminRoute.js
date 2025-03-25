import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Kiểm tra xem người dùng có quyền admin không
  return user && user.role === 'admin' ? children : <Navigate to="/home" />;
};

export default AdminRoute; 