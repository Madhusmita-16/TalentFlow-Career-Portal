import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link2CareerLogo } from '../components/Link2CareerLogo';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await authApi.login({ email, password });
      login(res.data.token, {
        id: res.data.userId,
        email: res.data.email,
        fullName: res.data.fullName,
        role: res.data.role,
      });

      if (res.data.role === 'ADMIN' || res.data.role === 'RECRUITER') {
        navigate('/admin');
      } else {
        navigate(from === '/' ? '/candidate/dashboard' : from);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-800">
        
        {/* Left Side Branding Panel (Dark Navy / Blue Half) */}
        <div className="lg:col-span-6 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-15" />
          
          <div className="relative z-10 space-y-8">
            <Link to="/" className="inline-block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow-md flex items-center justify-center shrink-0">
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
                  <span className="font-extrabold text-2xl tracking-tight text-white leading-none">
                    Link<span className="text-sky-400">2</span>Career
                  </span>
                  <span className="text-xs text-sky-400 font-extrabold tracking-wider uppercase mt-1">
                    Connect. Discover. Grow.
                  </span>
                </div>
              </div>
            </Link>

            <div className="space-y-4 pt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <ShieldCheck className="w-4 h-4" /> Professional Network & Career SaaS
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Welcome Back to Your Professional Network
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                Sign in to access your candidate applications, TalentAI Copilot resume insights, direct recruiter messages, and career roadmap.
              </p>
            </div>

            <div className="space-y-3 pt-4 text-xs font-semibold text-slate-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>1-Click Easy Apply & AI ATS Job Compatibility Analysis</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Real-Time STOMP WebSockets 1-on-1 Messaging</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Verified Skill Badges & Recruiter Talent Pools</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>© {new Date().getFullYear()} Link2Career</span>
            <span>Connect. Discover. Grow.</span>
          </div>
        </div>

        {/* Right Side Form Panel (Clean White Half) */}
        <div className="lg:col-span-6 bg-white p-8 sm:p-12 flex flex-col justify-center space-y-6">
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to Account</h2>
            <p className="text-xs text-slate-500 font-medium">Enter your credentials to access Link2Career</p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidate@talentflow.com"
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600 focus:bg-white text-slate-900 font-medium transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                <a href="#" className="text-[11px] font-bold text-blue-600 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600 focus:bg-white text-slate-900 font-medium transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium">Remember me for 30 days</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Link2Career'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-blue-600 hover:underline">
              Create Candidate Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
