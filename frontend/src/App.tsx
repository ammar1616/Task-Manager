import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, Layout } from 'antd';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import BoardView from './components/BoardView';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, loading } = useAuth();
  if (loading) return null;
  return token ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, loading } = useAuth();
  if (loading) return null;
  return token ? <Navigate to="/" /> : <>{children}</>;
};

const App: React.FC = () => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#1677ff',
      },
    }}
  >
    <BrowserRouter>
      <AuthProvider>
        <Layout style={{ minHeight: '100vh', overflowX: 'hidden' }}>
          <Navbar />
          <Layout.Content>
            <Routes>
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/" element={<ProtectedRoute><BoardView /></ProtectedRoute>} />
            </Routes>
          </Layout.Content>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  </ConfigProvider>
);

export default App;
