import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationsApi, interviewApi } from '../api';
import { JobApplication, Interview } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Calendar, CheckCircle2, Clock, Briefcase, ArrowRight, UserCheck, Eye } from 'lucide-react';

export const CandidateDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appRes, intRes] = await Promise.all([
        applicationsApi.getMyApplications(),
        interviewApi.getInterviews(),
      ]);
      setApplications(appRes.data);
      setInterviews(intRes.data);
    } catch (err) {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  const submittedCount = applications.length;
  const underReviewCount = applications.filter((a) => a.currentStatus === 'UNDER_REVIEW' || a.currentStatus === 'SHORTLISTED').length;
  const scheduledCount = interviews.filter((i) => i.status === 'SCHEDULED').length;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-panel border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Candidate Dashboard</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">Welcome back, {user?.fullName}!</h1>
            <p className="text-xs text-slate-300 mt-1">Track your active applications, scheduled interviews, and recruiter updates.</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/jobs"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition shadow-sm flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4" />
              Browse Openings
            </Link>
            <Link
              to="/candidate/profile"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg border border-slate-700 transition"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-card flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Submitted</div>
              <div className="text-3xl font-black text-slate-900 mt-1">{submittedCount}</div>
              <div className="text-[11px] text-slate-400 mt-1">Job applications sent</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-card flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">In Review / Shortlisted</div>
              <div className="text-3xl font-black text-amber-600 mt-1">{underReviewCount}</div>
              <div className="text-[11px] text-slate-400 mt-1">Active candidate evaluations</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-card flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scheduled Interviews</div>
              <div className="text-3xl font-black text-indigo-600 mt-1">{scheduledCount}</div>
              <div className="text-[11px] text-slate-400 mt-1">Upcoming recruiter meetings</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Two Column Layout: Recent Applications & Upcoming Interviews */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Applications Table */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-card p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h2 className="font-bold text-base text-slate-900">Recent Applications</h2>
              <Link to="/candidate/applications" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                View All Tracker
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isLoading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-3">
                <p className="text-xs font-medium">You haven't submitted any job applications yet.</p>
                <Link to="/jobs" className="inline-block px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-lg">
                  Explore Jobs
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="py-3 px-3">Job Title & Dept</th>
                      <th className="py-3 px-3">Date Applied</th>
                      <th className="py-3 px-3">Current Status</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.slice(0, 5).map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-900">{app.job.title}</div>
                          <div className="text-[11px] text-slate-500">{app.job.department} · {app.job.location}</div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-600 font-medium">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-3">
                          <StatusBadge status={app.currentStatus} />
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <Link
                            to="/candidate/applications"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Timeline
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Upcoming Interviews Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-card p-6 space-y-4">
            <h2 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">Upcoming Interviews</h2>

            {interviews.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No interviews scheduled yet. Once a recruiter schedules a session, it will appear here.
              </div>
            ) : (
              <div className="space-y-3">
                {interviews.map((item) => (
                  <div key={item.id} className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-indigo-950">{item.interviewType}</div>
                    <div className="text-indigo-900 font-medium">{item.jobTitle}</div>
                    <div className="flex items-center gap-1 text-indigo-700 font-semibold pt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.scheduledDate} ({item.timeSlot})
                    </div>
                    {item.meetingLink && (
                      <a
                        href={item.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block text-blue-600 font-bold underline text-[11px] pt-1"
                      >
                        Join Meeting Link →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
