import React from 'react';
import { CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

interface ProfileStrengthCardProps {
  score?: number;
}

export const ProfileStrengthCard: React.FC<ProfileStrengthCardProps> = ({ score = 94 }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Profile Strength
        </h3>
        <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
          {score}% Excellent
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-blue-600 to-sky-500 h-full rounded-full transition-all duration-500" 
          style={{ width: `${score}%` }}
        />
      </div>

      <p className="text-[11px] text-slate-600 font-medium">
        Your profile is highly complete for recruiter searches and AI matching vectors.
      </p>

      <div className="space-y-1.5 text-[11px] pt-1">
        <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Work experience & 10 skills verified</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-700 font-medium">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Complete career preferences for 100% match</span>
        </div>
      </div>
    </div>
  );
};
