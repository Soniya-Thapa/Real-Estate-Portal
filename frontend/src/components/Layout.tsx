import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col">
        <div className="p-6 text-2xl font-bold text-primary-600">
          EstatePortal
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link to="/dashboard" className="block p-3 rounded-lg hover:bg-primary-50">
            🏠 Properties
          </Link>
          <Link to="/favourites" className="block p-3 rounded-lg hover:bg-primary-50">
            ❤️ Favourites
          </Link>
        </nav>

        <div className="p-4 border-t">
          <button onClick={handleLogout} className="w-full btn-secondary">
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <header className="bg-white shadow-sm p-4 flex justify-between">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-800">{user?.name}</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full capitalize">
              {user?.role}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">{children}</main>

      </div>
    </div>
  );
};