import { useState } from 'react';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';
import { getCurrentUser, logout } from './lib/auth';

function App() {
  const [user, setUser] = useState(getCurrentUser);

  if (!user) {
    return <AuthPage onAuthenticated={setUser} />;
  }

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return <ChatPage user={user} onLogout={handleLogout} />;
}

export default App;
