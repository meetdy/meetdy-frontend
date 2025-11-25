import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import JoinFromLink from '@/components/JoinFromLink';
import NotFoundPage from '@/components/NotFoundPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import Account from '@/features/Account';
import Admin from '@/features/Admin';
import CallVideo from '@/features/CallVideo';
import Home from '@/features/Home';
import ChatLayout from '@/layout/ChatLayout';

import { fetchUserProfile } from '@/app/globalSlice';
import { fetchInfoWebs } from '@/features/Home/homeSlice';

function App() {
  const dispatch = useDispatch();
  const [isFetch, setIsFetch] = useState(false);

  const user = useSelector((state) => state.global.user);
  const isAuth = !!user;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        await dispatch(fetchUserProfile());
      }

      setIsFetch(true);
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    dispatch(fetchInfoWebs());
  }, []);

  if (!isFetch) return '';

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/jf-link/:conversationId" element={<JoinFromLink />} />
          <Route path="/account/*" element={<Account />} />

          {/* Protected */}
          <Route element={<ProtectedRoute isAuth={isAuth} />}>
            <Route path="/chat/*" element={<ChatLayout />} />
            <Route path="/call-video/:conversationId" element={<CallVideo />} />
          </Route>

          {/* Admin */}
          <Route element={<AdminProtectedRoute isAdmin={isAdmin} />}>
            <Route path="/admin/*" element={<Admin />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
