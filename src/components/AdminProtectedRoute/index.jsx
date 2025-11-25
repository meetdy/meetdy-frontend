import { Navigate, Outlet } from 'react-router-dom';

export default function AdminProtectedRoute({ isAdmin }) {
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}
