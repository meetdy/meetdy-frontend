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
  const [isFetch, setIsFetch] = useState(false);

  const { user } = useSelector((state: any) => state.global);

  const isAuth = !!user;
  const isAdmin = user?.isAdmin;

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        await fetchUserProfile();
      }

      setIsFetch(true);
    };

    fetchProfile();
  }, []);

  if (!isFetch)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
            <svg
              className="h-5 w-5 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
            </svg>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-block h-4 w-4 rounded-full border-2 border-muted-foreground/40 border-t-primary animate-spin" />
            <span>Đang tải...</span>
          </div>
        </div>
      </div>
    );

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
