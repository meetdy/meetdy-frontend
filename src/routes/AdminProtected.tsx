import { Navigate, Outlet } from 'react-router-dom';

export default function AdminProtected({ isAdmin }) {
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}
