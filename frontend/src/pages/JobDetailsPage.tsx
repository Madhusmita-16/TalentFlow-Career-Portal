import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobsApi, applicationsApi } from '../api';
import { Job, JobApplication } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { MapPin, Briefcase, Calendar, DollarSign, Users, Clock, CheckCircle, ArrowLeft, Share2, ShieldCheck, FileCheck } from 'lucide-react';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [existingApplication, setExistingApplication] = useState<JobApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchJobDetails();
      if (isAuthenticated && user?.role === 'CANDIDATE') {
        checkExistingApplication();
      }
    }
  }, [id, isAuthenticated]);

  const fetchJobDetails = async () => {
    try {
      const res = await jobsApi.getJobById(Number(id));
      setJob(res.data);
    } catch (err) {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  const checkExistingApplication = async () => {
    try {
      const res = await applicationsApi.getMyApplications();
      const match = res.data.find((app: JobApplication) => app.job.id === Number(id));
      if (match) {
        setExistingApplication(match);
      }
    } catch (err) {
      // Ignore
    }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/apply/${id}` } });
      return;
    }
    navigate(`/apply/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 bg-white p-8 rounded-xl border border-slate-200 animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-40 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl border border-slate-200 shadow-card">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Job Position Not Found</h2>
          <p className="text-xs text-slate-500 mb-6">The job posting you are looking for may have been closed or archived.</p>
          <Link to="/jobs" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-500 transition">
            Back to Openings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link to="/jobs" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-6 transition">
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>

        {/* Job Header Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-card mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wider">
                  {job.department}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {job.workMode.replace('_', '-')}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {job.title}
              </h1>
              <p className="text-sm font-medium text-slate-500 mt-1">Enterprise Recruitment Portal · Posted {new Date(job.createdAt).toLocaleDateString()}</p>
            </div>

            {/* Apply Action / Application Status */}
            <div className="shrink-0">
              {existingApplication ? (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col items-start gap-2 min-w-[200px]">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>Application Submitted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Status:</span>
                    <StatusBadge status={existingApplication.currentStatus} />
                  </div>
                  <Link
                    to="/candidate/applications"
                    className="text-xs font-semibold text-blue-600 hover:underline mt-1"
                  >
                    View Status Timeline →
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleApplyClick}
                  className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-sm hover:shadow-md transition flex items-center justify-center gap-2"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>

          {/* Quick Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Location</div>
                <div className="text-slate-900 font-semibold">{job.location}</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Employment</div>
                <div className="text-slate-900 font-semibold">{job.employmentType.replace('_', ' ')}</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Salary Range</div>
                <div className="text-slate-900 font-semibold">
                  {job.salaryMin && job.salaryMax
                    ? `$${(job.salaryMin / 1000).toFixed(0)}k - $${(job.salaryMax / 1000).toFixed(0)}k / yr`
                    : 'Competitive'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Openings</div>
                <div className="text-slate-900 font-semibold">{job.openings} Positions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Description Column */}
          <div className="lg:col-span-2 space-y-8 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-card">
            {/* About the Role */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">About the Role</h2>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">Key Responsibilities</h2>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{job.responsibilities}</div>
              </div>
            )}

            {/* Required Qualifications */}
            {job.requirements && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">Required Qualifications</h2>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{job.requirements}</div>
              </div>
            )}

            {/* Preferred Qualifications */}
            {job.preferredQualifications && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">Preferred Qualifications</h2>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{job.preferredQualifications}</div>
              </div>
            )}

            {/* Required Skills */}
            {job.requiredSkills && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">Required Skills & Expertise</h2>
                <div className="flex flex-wrap gap-2 pt-1">
                  {job.requiredSkills.split(',').map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-md">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Summary Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-card space-y-4 text-xs">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">Role Summary</h3>
              
              <div className="space-y-3 text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Experience:</span>
                  <span className="font-semibold">{job.experienceLevel || 'Not specified'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Department:</span>
                  <span className="font-semibold">{job.department}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Work Mode:</span>
                  <span className="font-semibold">{job.workMode.replace('_', '-')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Deadline:</span>
                  <span className="font-semibold">{job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Rolling Basis'}</span>
                </div>
              </div>

              {!existingApplication && (
                <button
                  onClick={handleApplyClick}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition mt-4 shadow-sm"
                >
                  Apply For This Position
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
