import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, Bell, User as UserIcon, LogOut, Shield, Home, Users, MessageSquare, Menu, X, Sparkles } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-sm group-hover:bg-sky-500 transition">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-white leading-none">
                Talent<span className="text-sky-400">Flow</span>
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-tight flex items-center gap-0.5">
                Enterprise & AI Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Items — Show All Platform Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 sm:space-x-2">
            <Link
              to="/feed"
              className={`flex flex-col items-center px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                isActive('/feed') || isActive('/') ? 'text-sky-400 bg-slate-800/80 border-b-2 border-sky-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Home className="w-4 h-4 mb-0.5" />
              <span>Feed</span>
            </Link>

            <Link
              to="/network"
              className={`flex flex-col items-center px-2.5 py-1 rounded-lg text-xs font-semibold transition relative ${
                isActive('/network') ? 'text-sky-400 bg-slate-800/80 border-b-2 border-sky-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Users className="w-4 h-4 mb-0.5" />
              <span>My Network</span>
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            </Link>

            <Link
              to="/jobs"
              className={`flex flex-col items-center px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                isActive('/jobs') ? 'text-sky-400 bg-slate-800/80 border-b-2 border-sky-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Briefcase className="w-4 h-4 mb-0.5" />
              <span>Jobs</span>
            </Link>

            <Link
              to="/messaging"
              className={`flex flex-col items-center px-2.5 py-1 rounded-lg text-xs font-semibold transition relative ${
                isActive('/messaging') ? 'text-sky-400 bg-slate-800/80 border-b-2 border-sky-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <MessageSquare className="w-4 h-4 mb-0.5" />
              <span>Messaging</span>
              <span className="absolute top-1 right-2 bg-emerald-500 text-white text-[9px] font-extrabold px-1 rounded-full">
                1
              </span>
            </Link>

            <Link
              to="/candidate/applications"
              className={`flex flex-col items-center px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                isActive('/candidate/applications') ? 'text-sky-400 bg-slate-800/80 border-b-2 border-sky-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Briefcase className="w-4 h-4 mb-0.5 text-emerald-400" />
              <span>Applications</span>
            </Link>

            <Link
              to="/candidate/profile"
              className={`flex flex-col items-center px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                isActive('/candidate/profile') ? 'text-sky-400 bg-slate-800/80 border-b-2 border-sky-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <UserIcon className="w-4 h-4 mb-0.5 text-sky-400" />
              <span>My Profile</span>
            </Link>

            <Link
              to="/admin"
              className={`flex flex-col items-center px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                isActive('/admin') ? 'text-amber-400 bg-slate-800/80 border-b-2 border-amber-400' : 'text-amber-300 hover:text-amber-200 hover:bg-slate-800/50'
              }`}
            >
              <Shield className="w-4 h-4 mb-0.5 text-amber-400" />
              <span>Recruiter Portal</span>
            </Link>
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
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-800">Notifications</span>
                        <span className="text-xs font-semibold text-sky-600">{unreadCount} new</span>
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
                                !n.read ? 'bg-sky-50/50 font-medium' : ''
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
                  <div className="w-8 h-8 rounded-full bg-sky-600 text-white font-extrabold text-xs flex items-center justify-center border-2 border-sky-400">
                    {user?.fullName.charAt(0)}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white leading-tight">{user?.fullName}</span>
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
                  className="px-4 py-2 text-xs font-bold text-slate-200 hover:text-white transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition shadow-xs"
                >
                  Create Account
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
            to="/feed"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-semibold text-slate-200 hover:bg-slate-800"
          >
            🏠 Community Feed
          </Link>
          <Link
            to="/network"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-semibold text-slate-200 hover:bg-slate-800"
          >
            👥 My Network
          </Link>
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-semibold text-slate-200 hover:bg-slate-800"
          >
            💼 Jobs & Easy Apply
          </Link>
          <Link
            to="/messaging"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-semibold text-slate-200 hover:bg-slate-800"
          >
            💬 Direct Messages
          </Link>

          <Link
            to="/candidate/applications"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-semibold text-slate-200 hover:bg-slate-800"
          >
            📂 My Applications
          </Link>
          <Link
            to="/candidate/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-semibold text-slate-200 hover:bg-slate-800"
          >
            👤 Candidate Profile
          </Link>
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-semibold text-amber-300 bg-slate-800"
          >
            🛡️ Recruiter Portal
          </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-semibold text-red-400 hover:bg-slate-800"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-bold text-slate-200 bg-slate-800 rounded-md"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-bold text-white bg-sky-600 rounded-md"
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

