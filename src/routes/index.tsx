import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AdminProtectedRoute from '@/routes/AdminProtected';
import ProtectedRoute from '@/routes/ProtectedRoute';

import JoinFromLink from '@/components/join-from-link';
import NotFoundPage from '@/components/not-found-page';

import Account from '@/features/Account';
import Admin from '@/features/Admin';

import ChatLayout from '@/features';

import { fetchUserProfile } from '@/hooks/me/useGetProfile';

function App() {
  const { user } = useSelector((state: any) => state.global);

  const isAuth = !!user;
  const isAdmin = user?.isAdmin;

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        await fetchUserProfile();
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/jf-link/:conversationId" element={<JoinFromLink />} />
        <Route path="/account/*" element={<Account />} />
        <Route
          path="/"
          element={
            isAuth
              ? isAdmin
                ? <Navigate to="/admin" replace />
                : <Navigate to="/chat" replace />
              : <Navigate to="/account/login" replace />
          }
        />
        <Route element={<ProtectedRoute />}>
          <Route path="/chat/*" element={<ChatLayout />} />
        </Route>

        <Route element={<AdminProtectedRoute isAdmin={isAdmin} />}>
          <Route path="/admin/*" element={<Admin />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
