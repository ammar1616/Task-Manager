import React from 'react';
import { Layout, Button, Space, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Header } = Layout;
const { Text } = Typography;

const Navbar: React.FC = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        padding: '0 24px',
        position: 'fixed',
        width: '100%',
        zIndex: 100,
      }}
    >
      <Text strong style={{ fontSize: 18 }}>Task Manager</Text>
      {token ? (
        <Space>
          <Text>{user?.name}</Text>
          <Button onClick={handleLogout}>Logout</Button>
        </Space>
      ) : (
        <Space>
          <Link to="/login"><Button type="primary">Login</Button></Link>
          <Link to="/register"><Button>Register</Button></Link>
        </Space>
      )}
    </Header>
  );
};

export default Navbar;
