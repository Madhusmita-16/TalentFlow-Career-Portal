import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../types';
import { MapPin, Briefcase, Clock, Building2, ChevronRight, DollarSign } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
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
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-card hover:shadow-panel hover:border-slate-300 transition duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 uppercase tracking-wider mb-2">
              {job.department}
            </span>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug">
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
              <span key={i} className="text-xs bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded">
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

        <Link
          to={`/jobs/${job.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition group-hover:translate-x-0.5"
        >
          View Details
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
