import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AdminProtectedRoute from '@/routes/AdminProtected';
import ProtectedRoute from '@/routes/ProtectedRoute';

import JoinFromLink from '@/components/join-from-link';
import NotFoundPage from '@/components/not-found-page';

import Account from '@/features/Account';
import Admin from '@/features/Admin';

import ChatLayout from '@/features';

import { useDispatch, useSelector } from 'react-redux';
import { useGetProfile } from '@/hooks/me/useGetProfile';
import { useEffect } from 'react';
import { setUser } from '@/app/globalSlice';

function App() {
  const dispatch = useDispatch();

  const token = localStorage.getItem('token');

  const user = useSelector((state: any) => state.global.user);

  const { data } = useGetProfile({
    enabled: !!token,
  });

  useEffect(() => {
    if (data) {
      dispatch(setUser(data));
    }
  }, [data]);

  const isAuth = !!data;
  const isAdmin = user?.isAdmin;

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
    </BrowserRouter >
  );
}

export default App;
