import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { user } = useSelector((s: any) => s.global);

  if (!user) {
    return <Navigate to="/account/login" replace />;
  }

  return user.isAdmin ? (
    <Navigate to="/admin" replace />
  ) : (
    <Outlet />
  );
};

export default ProtectedRoute;
