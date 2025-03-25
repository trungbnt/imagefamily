import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      login(token)
        .then((user) => {
          if (user.role === 'admin') {
            navigate('/albums');
          } else {
            navigate('/home');
          }
        })
        .catch(() => {
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [location, login, navigate]);

  return <div>Đang xử lý đăng nhập...</div>;
};

export default AuthCallback; 