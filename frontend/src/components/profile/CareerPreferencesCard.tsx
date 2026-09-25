import React from 'react';
import { Lock, MapPin, Briefcase, Clock, DollarSign } from 'lucide-react';

export const CareerPreferencesCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase flex items-center gap-1.5">
          <Briefcase className="w-4 h-4 text-blue-600" />
          Career & Compensation Preferences
        </h3>
        <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
          <Lock className="w-3 h-3 text-slate-400" /> Recruiter Only
        </span>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <span className="text-slate-400 font-semibold block text-[11px] mb-1">Target Roles</span>
          <div className="flex flex-wrap gap-1.5">
            <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-md text-[11px]">Software Developer</span>
            <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-md text-[11px]">Java Developer</span>
            <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-md text-[11px]">Backend Engineer</span>
            <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-md text-[11px]">Full Stack Engineer</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <span className="text-slate-400 font-semibold block text-[11px]">Preferred Mode</span>
            <span className="font-bold text-slate-800">Hybrid / Remote</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block text-[11px]">Notice Period</span>
            <span className="font-bold text-emerald-600">Immediate Availability</span>
          </div>
        </div>

        <div>
          <span className="text-slate-400 font-semibold block text-[11px] mb-1">Target Locations</span>
          <p className="text-slate-700 font-medium text-[11px] flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" /> San Francisco, CA · Bengaluru · Remote
          </p>
        </div>
      </div>
    </div>
  );
};
