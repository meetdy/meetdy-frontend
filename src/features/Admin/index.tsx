import { Button, Layout } from 'antd';
import NotFoundPage from '@/components/not-found-page';
import { Routes, Route } from 'react-router-dom';
import SiderBar from './components/SiderBar';
import StickerPage from './pages/StickerPage';
import StickerGroupPage from './pages/StickerGroupPage';
import UserPage from './pages/UserPage';

const { Content } = Layout;

function Admin(props) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.reload();
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SiderBar />
      <Layout className="site-layout">
        <div style={{ backgroundColor: 'white', padding: '20px' }}>
          <Button onClick={handleLogout}>Đăng xuất</Button>
        </div>

        <Content
          style={{
            margin: '10px 10px',
            background: 'white',
          }}
        >
          <Routes>
            <Route index element={<UserPage />} />

            <Route path="stickers" element={<StickerGroupPage />} />

            <Route path="stickers/:id" element={<StickerPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Content>

        <AdminFooter />
      </Layout>
    </Layout>
  );
}

export default Admin;
