import React from 'react';
import { ApplicationStatus } from '../types';

interface StatusBadgeProps {
  status: ApplicationStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'UNDER_REVIEW':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'SHORTLISTED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'INTERVIEW':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'SELECTED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'WITHDRAWN':
        return 'bg-gray-100 text-gray-500 border-gray-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatText = (text: string) => {
    return text.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStyles()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75"></span>
      {formatText(status)}
    </span>
  );
};
