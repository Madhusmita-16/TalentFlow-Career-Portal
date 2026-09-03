import React, { useState, useEffect } from 'react';
import { Home, Users, Briefcase, MessageSquare, UserCheck, Shield, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

interface NavDemoStep {
  id: string;
  label: string;
  icon: any;
  route: string;
  description: string;
  badge: string;
  color: string;
  bgGradient: string;
}

export const DemoVideoShowcase: React.FC = () => {
  const steps: NavDemoStep[] = [
    {
      id: 'feed',
      label: '1. Community Feed',
      icon: Home,
      route: '/feed',
      description: 'Professional tech feed with upvotes, comment threads, job posts, and AI Profile Strength indicator (94%).',
      badge: 'Feed',
      color: 'text-sky-600',
      bgGradient: 'from-sky-600/20 to-indigo-600/20'
    },
    {
      id: 'network',
      label: '2. My Network',
      icon: Users,
      route: '/network',
      description: 'Manage incoming connection requests (Accept / Ignore) and discover recommended industry connections.',
      badge: '482 Connections',
      color: 'text-emerald-600',
      bgGradient: 'from-emerald-600/20 to-teal-600/20'
    },
    {
      id: 'jobs',
      label: '3. Jobs Board',
      icon: Briefcase,
      route: '/jobs',
      description: 'Explore tech roles, filter by work mode (Remote / Hybrid), and apply using 1-Click Easy Apply.',
      badge: 'Easy Apply',
      color: 'text-indigo-600',
      bgGradient: 'from-indigo-600/20 to-purple-600/20'
    },
    {
      id: 'messaging',
      label: '4. Messaging Hub',
      icon: MessageSquare,
      route: '/messaging',
      description: '1-on-1 direct messaging stream with recruiter chat threads, online status, and quick AI replies.',
      badge: '1 Unread',
      color: 'text-amber-600',
      bgGradient: 'from-amber-600/20 to-orange-600/20'
    },
    {
      id: 'applications',
      label: '5. Applications',
      icon: Briefcase,
      route: '/candidate/applications',
      description: 'Track submitted applications with live status timelines (Submitted → Under Review → Shortlisted → Interview).',
      badge: 'Tracker',
      color: 'text-cyan-600',
      bgGradient: 'from-cyan-600/20 to-blue-600/20'
    },
    {
      id: 'profile',
      label: '6. Candidate Profile',
      icon: UserCheck,
      route: '/candidate/profile',
      description: 'Full profile editor with Projects, AWS Cloud Media, Publications, Awards, Patents, Languages, & Add/Remove controls.',
      badge: 'Add/Remove',
      color: 'text-purple-600',
      bgGradient: 'from-purple-600/20 to-pink-600/20'
    },
    {
      id: 'admin',
      label: '7. Recruiter Portal',
      icon: Shield,
      route: '/admin',
      description: 'Admin candidate pipeline, recruiter private notes, applicant stage updates, and job management dashboard.',
      badge: 'Admin',
      color: 'text-rose-600',
      bgGradient: 'from-rose-600/20 to-red-600/20'
    }
  ];

  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStepIdx(prev => (prev + 1) % steps.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const activeStep = steps[activeStepIdx];

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
      
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
              TalentFlow Navigation Demo Video Showcase
              <span className="bg-sky-500/20 text-sky-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-sky-400/30">
                LIVE DEMO
              </span>
            </h3>
            <p className="text-xs text-slate-400">Automated navigation preview across all 7 primary platform routes</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 border border-slate-700"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            {isPlaying ? 'Pause Demo' : 'Play Demo'}
          </button>
          
          <button
            onClick={() => { setActiveStepIdx(0); setIsPlaying(true); }}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition border border-slate-700"
            title="Restart Video Demo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {steps.map((step, idx) => {
          const IconComp = step.icon;
          const isActive = idx === activeStepIdx;
          return (
            <button
              key={step.id}
              onClick={() => { setActiveStepIdx(idx); setIsPlaying(false); }}
              className={`p-2.5 rounded-xl text-left transition flex flex-col justify-between h-20 border ${
                isActive
                  ? 'bg-sky-600/30 border-sky-400 text-white shadow-lg ring-2 ring-sky-500/50'
                  : 'bg-slate-800/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <IconComp className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                {isActive && <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>}
              </div>
              <span className="text-[11px] font-bold truncate leading-tight mt-1">{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Simulated Video Showcase Window */}
      <div className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden min-h-[320px] flex flex-col justify-between p-6 sm:p-8">
        
        {/* Top Simulated Video Browser Bar */}
        <div className="flex items-center justify-between bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
            <span className="text-[11px] font-mono text-slate-400 ml-2">https://talentflow.com{activeStep.route}</span>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
            {activeStep.badge}
          </span>
        </div>

        {/* Video Frame Animation Content */}
        <div className="space-y-4 my-auto">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl bg-gradient-to-r ${activeStep.bgGradient} border border-white/10`}>
              <activeStep.icon className={`w-8 h-8 ${activeStep.color}`} />
            </div>
            <div>
              <h4 className="text-xl font-black text-white">{activeStep.label}</h4>
              <p className="text-xs text-sky-300 font-semibold">Active Navigation View: {activeStep.route}</p>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed font-medium bg-slate-900/90 p-4 rounded-xl border border-slate-800">
            {activeStep.description}
          </p>
        </div>

        {/* Video Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Step {activeStepIdx + 1} of {steps.length} — Interactive Video Preview</span>
          <div className="w-48 bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-sky-400 to-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${((activeStepIdx + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

      </div>

    </div>
  );
};
