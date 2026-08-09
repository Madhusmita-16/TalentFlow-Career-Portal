import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, Bell, User as UserIcon, LogOut, LayoutDashboard, FileText, Menu, X, Shield } from 'lucide-react';
import { notificationApi } from '../api';
import { NotificationItem } from '../types';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, location.pathname]);

  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.getNotifications();
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      // Ignore
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      // Ignore
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-500 transition">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-white leading-none">
                Talent<span className="text-blue-400">Flow</span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest leading-tight">Careers</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-md text-sm font-medium transition ${
                isActive('/') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className={`px-3.5 py-2 rounded-md text-sm font-medium transition ${
                isActive('/jobs') ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Jobs
            </Link>

            {isAuthenticated && user?.role === 'CANDIDATE' && (
              <>
                <Link
                  to="/candidate/dashboard"
                  className={`px-3.5 py-2 rounded-md text-sm font-medium transition ${
                    isActive('/candidate/dashboard')
                      ? 'text-white bg-slate-800'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/candidate/applications"
                  className={`px-3.5 py-2 rounded-md text-sm font-medium transition ${
                    isActive('/candidate/applications')
                      ? 'text-white bg-slate-800'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  My Applications
                </Link>
                <Link
                  to="/candidate/profile"
                  className={`px-3.5 py-2 rounded-md text-sm font-medium transition ${
                    isActive('/candidate/profile')
                      ? 'text-white bg-slate-800'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  My Profile
                </Link>
              </>
            )}

            {isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'RECRUITER') && (
              <Link
                to="/admin"
                className={`px-3.5 py-2 rounded-md text-sm font-medium transition flex items-center gap-1.5 ${
                  isActive('/admin') ? 'text-white bg-blue-600' : 'text-blue-400 hover:text-white hover:bg-blue-600/80'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin Portal
              </Link>
            )}
          </nav>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Notification Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition relative"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-lg shadow-panel border border-slate-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="font-semibold text-sm text-slate-800">Notifications</span>
                        <span className="text-xs text-slate-500">{unreadCount} unread</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-400">No notifications yet</div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => handleMarkAsRead(n.id)}
                              className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition ${
                                !n.read ? 'bg-blue-50/50 font-medium' : ''
                              }`}
                            >
                              <div className="font-semibold text-slate-900 mb-0.5">{n.title}</div>
                              <div className="text-slate-600">{n.message}</div>
                              <div className="text-[10px] text-slate-400 mt-1">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 font-bold text-xs">
                    {user?.fullName.charAt(0)}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-medium text-white">{user?.fullName}</span>
                    <span className="text-[10px] text-slate-400 capitalize">{user?.role.toLowerCase()}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 transition ml-1"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-md transition shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Explore Jobs
          </Link>

          {isAuthenticated ? (
            <>
              {user?.role === 'CANDIDATE' && (
                <>
                  <Link
                    to="/candidate/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
                  >
                    Candidate Dashboard
                  </Link>
                  <Link
                    to="/candidate/applications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
                  >
                    My Applications
                  </Link>
                  <Link
                    to="/candidate/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
                  >
                    My Profile
                  </Link>
                </>
              )}

              {(user?.role === 'ADMIN' || user?.role === 'RECRUITER') && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-blue-400 bg-slate-800"
                >
                  Admin Portal
                </Link>
              )}

              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-slate-800"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-slate-200 bg-slate-800 rounded-md"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-white bg-blue-600 rounded-md"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
