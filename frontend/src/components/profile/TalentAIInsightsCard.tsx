import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const TalentAIInsightsCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-4 border border-indigo-800/50">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-sky-400 tracking-wider uppercase flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-sky-400" />
          TalentAI Profile Insights
        </h3>
        <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-bold border border-sky-400/30">
          AI Verified
        </span>
      </div>

      <p className="text-[11px] text-slate-300 font-normal leading-relaxed">
        AI-assisted recommendations derived strictly from your verified profile entries.
      </p>

      {/* Strong Areas */}
      <div className="space-y-2">
        <h4 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Strong Areas</h4>
        <div className="space-y-1 text-xs text-slate-200">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Technical Skills Matrix (Java 21, Spring Boot, React)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Cloud Microservices Project Portfolio</span>
          </div>
        </div>
      </div>

      {/* Recommended Improvements */}
      <div className="space-y-2 pt-1 border-t border-slate-800">
        <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Recommended Enhancements</h4>
        <div className="space-y-1.5 text-xs text-slate-300">
          <div className="flex items-start gap-1.5">
            <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>Add measurable outcomes to project descriptions</span>
          </div>
          <div className="flex items-start gap-1.5">
            <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>Attach credential verification links to certifications</span>
          </div>
        </div>
      </div>
    </div>
  );
};
