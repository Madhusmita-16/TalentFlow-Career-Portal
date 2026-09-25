import React from 'react';
import { Candidate } from '../../types';
import { X, ShieldCheck, CheckCircle2, Globe, Download, FolderGit2, Briefcase, GraduationCap, Award, BookOpen, Trophy, FileCheck2, Code, Mail, Phone, MapPin } from 'lucide-react';

interface PublicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  headline: string;
  location: string;
}

export const PublicProfileModal: React.FC<PublicProfileModalProps> = ({
  isOpen,
  onClose,
  candidate,
  headline,
  location
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8 relative">
        
        {/* Sticky Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
              Public Candidate Profile Preview (Recruiter View)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Public Profile Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Cover Banner & Profile Avatar */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="h-44 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 relative">
              {candidate?.bannerUrl ? (
                <img src={candidate.bannerUrl} alt="Cover Banner" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
              )}
            </div>

            <div className="p-6 pt-0 relative">
              <div className="flex flex-wrap items-end justify-between gap-4 -mt-16 mb-4">
                <img
                  src={candidate?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={candidate?.fullName || 'Avatar'}
                  className="w-32 h-32 rounded-2xl border-4 border-white shadow-md object-cover bg-slate-100"
                />

                {candidate?.resumeFilePath && (
                  <a
                    href={candidate.resumeFilePath}
                    download
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> Download Resume (PDF)
                  </a>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    {candidate?.fullName || 'Madhusmita Mishra'}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600" /> Identity Verified
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Skills Verified
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                  {headline || 'Senior Full-Stack Engineer | Java 21, React, Spring Boot'}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {location || 'San Francisco, CA'}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {candidate?.email || 'candidate@example.com'}
                  </span>
                  {candidate?.phone && (
                    <span className="flex items-center gap-1 font-medium">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {candidate.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          {candidate?.summary && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-2">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Executive Summary</h3>
              <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {candidate.summary}
              </p>
            </div>
          )}

          {/* Featured Projects */}
          {candidate?.projects && candidate.projects.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-sky-600" /> Featured Projects ({candidate.projects.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {candidate.projects.map((proj, i) => (
                  <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                    <div className="font-bold text-slate-900 text-sm">{proj.title}</div>
                    <div className="text-[11px] font-semibold text-sky-700">{proj.role}</div>
                    <p className="text-slate-600 text-[11px]">{proj.description}</p>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.technologies.map((tech, tIdx) => (
                          <span key={tIdx} className="bg-white border border-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {candidate?.workExperienceList && candidate.workExperienceList.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-sky-600" /> Work Experience ({candidate.workExperienceList.length})
              </h3>
              <div className="space-y-3">
                {candidate.workExperienceList.map((exp, i) => (
                  <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                    <div className="font-bold text-slate-900 text-sm">{exp.position} @ {exp.company}</div>
                    <div className="text-[11px] text-slate-500">{exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}</div>
                    {exp.responsibilities && <p className="text-slate-600 pt-1 leading-relaxed">{exp.responsibilities}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Skills */}
          {candidate?.skills && candidate.skills.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Code className="w-4 h-4 text-sky-600" /> Verified Skills & Competencies
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((s, i) => (
                  <span key={i} className="bg-sky-50 text-sky-800 border border-sky-200 px-3 py-1 rounded-xl text-xs font-bold">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
