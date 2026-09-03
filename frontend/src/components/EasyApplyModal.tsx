import React, { useState } from 'react';
import { Job, Candidate } from '../types';
import { CheckCircle2, FileText, Upload, Sparkles, X, Send, AlertCircle } from 'lucide-react';
import { applicationsApi } from '../api';

interface EasyApplyModalProps {
  job: Job;
  candidate: Candidate;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EasyApplyModal: React.FC<EasyApplyModalProps> = ({ job, candidate, isOpen, onClose, onSuccess }) => {
  const [coverNote, setCoverNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  // Calculate skill match score
  const requiredSkills = job.requiredSkills
    ? job.requiredSkills.split(',').map(s => s.trim().toLowerCase())
    : [];
  const candidateSkills = candidate.skills.map(s => s.trim().toLowerCase());
  
  const matchedSkills = requiredSkills.filter(req => 
    candidateSkills.some(cand => cand.includes(req) || req.includes(cand))
  );

  const matchPercentage = requiredSkills.length > 0
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
    : 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await applicationsApi.submitApplication({
        jobId: job.id,
        candidateId: candidate.id,
        coverNote,
        answers: []
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSubmitting(false);
        onSuccess();
        onClose();
      }, 1500);
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="bg-sky-500 text-white p-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Easy Apply
            </span>
            <h3 className="font-semibold text-lg text-slate-100">Apply to {job.department}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Job Overview */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col gap-1">
            <h4 className="font-bold text-slate-900 text-base">{job.title}</h4>
            <p className="text-sm text-slate-600 font-medium">{job.location} · {job.employmentType.replace('_', ' ')} · {job.workMode}</p>
          </div>

          {/* Skill Match Indicator */}
          <div className="bg-sky-50/70 border border-sky-200 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span className="text-sm font-bold text-sky-950">TalentAI Skill Match Score</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${matchPercentage >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {matchPercentage}% Match
              </span>
            </div>

            <p className="text-xs text-sky-900">
              You match <strong>{matchedSkills.length}</strong> of <strong>{requiredSkills.length}</strong> required skills on your profile.
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {requiredSkills.map((sk, idx) => {
                const isMatched = candidateSkills.some(cand => cand.includes(sk) || sk.includes(cand));
                return (
                  <span key={idx} className={`text-[11px] px-2 py-0.5 rounded-md font-medium flex items-center gap-1 ${isMatched ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-600'}`}>
                    {isMatched ? '✓' : '•'} {sk}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Pre-filled Info */}
          <div className="space-y-3 text-sm">
            <h5 className="font-semibold text-slate-800 text-xs uppercase tracking-wider text-slate-500">Contact Information (Saved Profile)</h5>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-100/70 p-3 rounded-lg border border-slate-200">
                <span className="block text-xs text-slate-500">Full Name</span>
                <span className="font-medium text-slate-900">{candidate.fullName}</span>
              </div>
              <div className="bg-slate-100/70 p-3 rounded-lg border border-slate-200">
                <span className="block text-xs text-slate-500">Email Address</span>
                <span className="font-medium text-slate-900 truncate block">{candidate.email}</span>
              </div>
            </div>

            {/* Resume Attached */}
            <div className="bg-slate-100/70 p-3.5 rounded-lg border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-sky-600" />
                <div>
                  <span className="block font-medium text-slate-900 text-xs">{candidate.resumeFilename || 'Alex_Morgan_Resume_2026.pdf'}</span>
                  <span className="block text-[11px] text-slate-500">Attached from TalentFlow Profile</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Attached
              </span>
            </div>

            {/* Quick Note */}
            <div>
              <label className="block font-medium text-slate-700 text-xs mb-1">Quick Note to Recruiter (Optional)</label>
              <textarea
                rows={3}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Share why you're interested in this role or highlight key projects..."
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || submitted}
            className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-colors disabled:opacity-50"
          >
            {submitted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Application Sent!
              </>
            ) : submitting ? (
              'Submitting...'
            ) : (
              <>
                <Send className="w-3.5 h-3.5" /> Submit Easy Application
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
