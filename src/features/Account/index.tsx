import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Loading } from '@/components/ui/loading';
import ForgotPage from './pages/ForgotPage';
import LoginPage from './pages/LoginPage';
import RegistryPage from './pages/RegistryPage';
import NotFoundPage from '@/components/not-found-page';

function Account() {
  const navigate = useNavigate();
  const { isLoading, user } = useSelector((state: any) => state.global);

  useEffect(() => {
    if (user) {
      if (user.isAdmin) navigate('/admin', { replace: true });
      else navigate('/chat', { replace: true });
    }
  }, [user, navigate]);

  return (
    <Loading spinning={isLoading}>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route path="registry" element={<RegistryPage />} />
          <Route path="forgot" element={<ForgotPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Loading>
  );
}

export default Account;
