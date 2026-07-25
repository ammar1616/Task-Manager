import React from 'react';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div>Task Manager</div>
    </AuthProvider>
  );
};

export default App;
