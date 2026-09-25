import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, Bell, User as UserIcon, LogOut, Shield, Home, Users, MessageSquare, Menu, X, Search, Clock, Trash2, ArrowUpRight } from 'lucide-react';
import { notificationApi } from '../api';
import { NotificationItem } from '../types';

const DEFAULT_HISTORY = ["Java 21", "Spring Boot", "React Engineer", "San Francisco, CA"];

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Search History State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistoryOpen, setSearchHistoryOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('link2career_search_history');
      return saved ? JSON.parse(saved) : DEFAULT_HISTORY;
    } catch {
      return DEFAULT_HISTORY;
    }
  });

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, location.pathname]);

  // Click outside listener for search history dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchHistoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const triggerSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    // Save to Search History
    const updated = [trimmed, ...searchHistory.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
    setSearchHistory(updated);
    try {
      localStorage.setItem('link2career_search_history', JSON.stringify(updated));
    } catch {
      // Ignore
    }

    setSearchHistoryOpen(false);
    navigate(`/jobs?search=${encodeURIComponent(trimmed)}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSearch(searchQuery);
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem('link2career_search_history');
    } catch {
      // Ignore
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Link2Career Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 p-1 shadow-xs flex items-center justify-center group-hover:border-blue-300 transition">
              <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <polygon points="60,10 100,32 100,78 60,100 20,78 20,32" stroke="#0F172A" strokeWidth="7" strokeLinejoin="round" fill="none" />
                <circle cx="60" cy="10" r="10" stroke="#0F172A" strokeWidth="5" fill="#FFFFFF" />
                <polygon points="100,32 85,24 85,40" stroke="#00A6FF" strokeWidth="4" fill="#00A6FF" opacity="0.8" />
                <polygon points="100,78 85,70 85,86" stroke="#0F172A" strokeWidth="4" fill="#0066FF" />
                <circle cx="60" cy="100" r="10" stroke="#0F172A" strokeWidth="5" fill="#0077FF" />
                <polygon points="20,78 35,70 35,86" stroke="#00A6FF" strokeWidth="4" fill="#00A6FF" />
                <polygon points="20,32 35,24 35,40" stroke="#0F172A" strokeWidth="4" fill="#0066FF" />
                <circle cx="60" cy="55" r="11" stroke="#0F172A" strokeWidth="6" fill="#00A6FF" />
                <path d="M 32 75 L 85 28" stroke="#00A6FF" strokeWidth="7" strokeLinecap="round" />
                <path d="M 68 26 L 87 26 L 85 45" stroke="#00A6FF" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-slate-900 leading-none">
                Link<span className="text-sky-500">2</span>Career
              </span>
              <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider leading-tight mt-0.5">
                Connect. Discover. Grow.
              </span>
            </div>
          </Link>

          {/* Header Search Bar with Search History Dropdown */}
          <div ref={searchRef} className="hidden md:block flex-1 max-w-sm mx-2 relative">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setSearchHistoryOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchHistoryOpen(true);
                  }}
                  placeholder="Search jobs, skills, candidates..."
                  className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-blue-600 focus:bg-white font-medium transition"
                />
              </div>
            </form>

            {/* Recent Search History Dropdown */}
            {searchHistoryOpen && searchHistory.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 py-2.5 z-50 animate-in fade-in duration-150">
                <div className="px-3.5 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> Recent Search History
                  </span>
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    className="text-[10px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-0.5 transition"
                  >
                    <Trash2 className="w-3 h-3" /> Clear History
                  </button>
                </div>

                <div className="pt-1">
                  {searchHistory.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSearchQuery(item);
                        triggerSearch(item);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center justify-between transition group"
                    >
                      <span className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                        {item}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation Items */}
          <nav className="hidden lg:flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            <Link
              to="/feed"
              className={`flex flex-col items-center px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                isActive('/feed') || isActive('/') ? 'text-blue-600 bg-blue-50/60 font-bold border-b-2 border-blue-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4 mb-0.5" />
              <span>Feed</span>
            </Link>

            <Link
              to="/network"
              className={`flex flex-col items-center px-2.5 py-1 rounded-lg text-xs font-semibold transition relative ${
                isActive('/network') ? 'text-blue-600 bg-blue-50/60 font-bold border-b-2 border-blue-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4 mb-0.5" />
              <span>My Network</span>
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            </Link>

            <Link
              to="/jobs"
              className={`flex flex-col items-center px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                isActive('/jobs') ? 'text-blue-600 bg-blue-50/60 font-bold border-b-2 border-blue-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-4 h-4 mb-0.5" />
              <span>Jobs</span>
            </Link>

            <Link
              to="/messaging"
              className={`flex flex-col items-center px-2.5 py-1 rounded-lg text-xs font-semibold transition relative ${
                isActive('/messaging') ? 'text-blue-600 bg-blue-50/60 font-bold border-b-2 border-blue-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-4 h-4 mb-0.5" />
              <span>Messaging</span>
              <span className="absolute top-1 right-2 bg-emerald-600 text-white text-[9px] font-extrabold px-1 rounded-full">
                1
              </span>
            </Link>

            <Link
              to="/candidate/applications"
              className={`flex flex-col items-center px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                isActive('/candidate/applications') ? 'text-blue-600 bg-blue-50/60 font-bold border-b-2 border-blue-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-4 h-4 mb-0.5 text-emerald-600" />
              <span>Applications</span>
            </Link>

            <Link
              to="/candidate/profile"
              className={`flex flex-col items-center px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                isActive('/candidate/profile') ? 'text-blue-600 bg-blue-50/60 font-bold border-b-2 border-blue-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <UserIcon className="w-4 h-4 mb-0.5 text-blue-600" />
              <span>My Profile</span>
            </Link>

            <Link
              to="/admin"
              className={`flex flex-col items-center px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                isActive('/admin') ? 'text-amber-700 bg-amber-50 font-bold border-b-2 border-amber-600' : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <Shield className="w-4 h-4 mb-0.5 text-amber-600" />
              <span>Recruiter Portal</span>
            </Link>
          </nav>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center space-x-3 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Notification Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition relative border border-slate-200"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">Notifications</span>
                        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{unreadCount} new</span>
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
                              <div className="font-bold text-slate-900 mb-0.5">{n.title}</div>
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
                <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center border-2 border-blue-400 shadow-xs">
                    {user?.fullName.charAt(0)}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 leading-tight">{user?.fullName}</span>
                    <span className="text-[10px] text-slate-500 capitalize font-medium">{user?.role.toLowerCase()}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition ml-1"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-xs"
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
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          {/* Mobile Search Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-1 pb-2">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, skills, candidates..."
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
              />
            </div>
          </form>

          <Link
            to="/feed"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            🏠 Community Feed
          </Link>
          <Link
            to="/network"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            👥 My Network
          </Link>
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            💼 Jobs & Easy Apply
          </Link>
          <Link
            to="/messaging"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            💬 Direct Messages
          </Link>
          <Link
            to="/candidate/applications"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            📂 My Applications
          </Link>
          <Link
            to="/candidate/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            👤 Candidate Profile
          </Link>
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-xs font-semibold text-amber-800 bg-amber-50"
          >
            🛡️ Recruiter Portal
          </Link>

          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50"
            >
              Log Out
            </button>
          ) : (
            <div className="pt-2 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-bold text-white bg-blue-600 rounded-lg"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
