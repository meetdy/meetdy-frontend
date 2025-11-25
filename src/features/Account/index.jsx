import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Routes, Route, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';

import ForgotPage from './pages/ForgotPage';
import LoginPage from './pages/LoginPage';
import RegistryPage from './pages/RegistryPage';
import NotFoundPage from 'components/NotFoundPage';

function Account() {
  const navigate = useNavigate();

  const { isLoading } = useSelector((state) => state.account);
  const { user } = useSelector((state) => state.global);
  const { infoWebApps } = useSelector((state) => state.home);

  useEffect(() => {
    if (user) {
      if (user.isAdmin) navigate('/admin', { replace: true });
      else navigate('/chat', { replace: true });
    }
  }, [user, navigate]);

  return (
    <Spin spinning={isLoading}>
      <div id="account_page">
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route path="registry" element={<RegistryPage />} />
          <Route path="forgot" element={<ForgotPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Spin>
  );
}

export default Account;
