import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useDarkMode } from './hooks/useDarkMode';
import { useUnreadMessages } from './hooks/useUnreadMessages';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UserList from './components/Chat/UserList';
import ChatWindow from './components/Chat/ChatWindow';

function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-500 to-primary-700">
      {isLogin ? (
        <Login onToggle={() => setIsLogin(false)} />
      ) : (
        <Register onToggle={() => setIsLogin(true)} />
      )}
    </div>
  );
}

function ChatApp() {
  const { user, profile, signOut } = useAuth();
  const { isDark, toggleDarkMode } = useDarkMode();
  const unreadCounts = useUnreadMessages();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setShowSidebar(false);
  };

  const handleBack = () => {
    setShowSidebar(true);
    setSelectedUser(null);
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold">
            {profile.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {profile.username}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {profile.email}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          <button
            onClick={signOut}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside
          className={`${
            showSidebar ? 'block' : 'hidden'
          } lg:block w-full lg:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden`}
        >
          <UserList
            onSelectUser={handleSelectUser}
            selectedUserId={selectedUser?.id}
            unreadCounts={unreadCounts}
          />
        </aside>

        <main
          className={`${
            showSidebar ? 'hidden' : 'block'
          } lg:block flex-1 bg-gray-50 dark:bg-gray-900 overflow-hidden`}
        >
          <ChatWindow selectedUser={selectedUser} onBack={handleBack} />
        </main>
      </div>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <ChatApp /> : <AuthScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
