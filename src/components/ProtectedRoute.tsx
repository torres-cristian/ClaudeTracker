import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AppContext'; // We will create this hook

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // You can add a loading spinner here
    return <div>Cargando sesión...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
