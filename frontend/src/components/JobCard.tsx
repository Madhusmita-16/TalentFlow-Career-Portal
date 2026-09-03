import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Job, Candidate } from '../types';
import { MapPin, Briefcase, ChevronRight, DollarSign, Sparkles, Send } from 'lucide-react';
import { EasyApplyModal } from './EasyApplyModal';
import { useAuth } from '../contexts/AuthContext';

interface JobCardProps {
  job: Job;
  candidateProfile?: Candidate | null;
  onApplySuccess?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, candidateProfile, onApplySuccess }) => {
  const { user } = useAuth();
  const [showEasyApply, setShowEasyApply] = useState(false);

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Competitive';
    if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k / year`;
    return min ? `From $${(min / 1000).toFixed(0)}k / year` : `Up to $${(max! / 1000).toFixed(0)}k / year`;
  };

  const getWorkModeBadge = (mode: string) => {
    switch (mode) {
      case 'REMOTE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'HYBRID':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Default candidate fallback if none provided
  const candidate = candidateProfile || {
    id: 1,
    userId: user?.id || 3,
    fullName: user?.fullName || 'Alex Morgan',
    email: user?.email || 'candidate@talentflow.com',
    skills: ['Java 21', 'Spring Boot', 'React.js', 'TypeScript', 'MySQL', 'Docker'],
    educationList: [],
    workExperienceList: []
  };

  // Skill match calculation
  const requiredSkills = job.requiredSkills
    ? job.requiredSkills.split(',').map(s => s.trim().toLowerCase())
    : [];
  const candidateSkills = candidate.skills.map(s => s.trim().toLowerCase());
  
  const matchedSkills = requiredSkills.filter(req => 
    candidateSkills.some(cand => cand.includes(req) || req.includes(cand))
  );

  const matchPercentage = requiredSkills.length > 0
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
    : 85;

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-sky-300 transition duration-200 flex flex-col justify-between group relative">
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 uppercase tracking-wider">
                  {job.department}
                </span>
                <span className="bg-sky-50 border border-sky-200 text-sky-700 px-2 py-0.5 rounded-md text-[11px] font-extrabold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-sky-600" /> {matchPercentage}% Skill Match
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition leading-snug">
                <Link to={`/jobs/${job.id}`}>{job.title}</Link>
              </h3>
            </div>
            
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getWorkModeBadge(job.workMode)}`}>
              {job.workMode.replace('_', '-')}
            </span>
          </div>

          <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {job.description}
          </p>

          {job.requiredSkills && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {job.requiredSkills.split(',').slice(0, 4).map((skill, i) => (
                <span key={i} className="text-xs bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md font-medium">
                  {skill.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {job.location}
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              {job.employmentType.replace('_', ' ')}
            </div>
            <div className="flex items-center gap-1 font-semibold text-slate-700">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              {formatSalary(job.salaryMin, job.salaryMax)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEasyApply(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Send className="w-3 h-3" /> Easy Apply
            </button>
            
            <Link
              to={`/jobs/${job.id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-sky-600 transition"
            >
              Details
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <EasyApplyModal
        job={job}
        candidate={candidate}
        isOpen={showEasyApply}
        onClose={() => setShowEasyApply(false)}
        onSuccess={() => onApplySuccess && onApplySuccess()}
      />
    </>
  );
};

