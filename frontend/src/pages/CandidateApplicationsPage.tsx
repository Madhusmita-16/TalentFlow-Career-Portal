import React, { useState, useEffect } from 'react';
import { applicationsApi, interviewApi } from '../api';
import { JobApplication, Interview } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { CheckCircle2, Clock, Calendar, FileText, XCircle, ArrowRight, ChevronDown, ChevronUp, AlertCircle, Ban } from 'lucide-react';

export const CandidateApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedAppId, setExpandedAppId] = useState<number | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const [appRes, intRes] = await Promise.all([
        applicationsApi.getMyApplications(),
        interviewApi.getInterviews(),
      ]);
      setApplications(appRes.data);
      setInterviews(intRes.data);
      if (appRes.data.length > 0) {
        setExpandedAppId(appRes.data[0].id);
      }
    } catch (err) {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (id: number) => {
    if (!window.confirm('Are you sure you want to withdraw this job application?')) {
      return;
    }
    try {
      const res = await applicationsApi.withdrawApplication(id);
      setApplications((prev) => prev.map((a) => (a.id === id ? res.data : a)));
    } catch (err) {
      // Ignore
    }
  };

  const timelineSteps = [
    { key: 'SUBMITTED', label: 'Submitted' },
    { key: 'UNDER_REVIEW', label: 'Under Review' },
    { key: 'SHORTLISTED', label: 'Shortlisted' },
    { key: 'INTERVIEW', label: 'Interview' },
    { key: 'SELECTED', label: 'Final Decision' },
  ];

  const getStepStatus = (currentStatus: string, stepKey: string) => {
    if (currentStatus === 'WITHDRAWN' || currentStatus === 'REJECTED') {
      return 'inactive';
    }

    const order = ['SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED'];
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
        <div className="text-slate-400 text-xs font-semibold">Loading Applications Tracker...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Application Tracker</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time status updates and recruitment progress for all your submitted applications.</p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-card">
            <p className="text-slate-600 font-semibold text-base">No Job Applications Submitted</p>
            <p className="text-slate-400 text-xs mt-1">You haven't submitted any job applications yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => {
              const isExpanded = expandedAppId === app.id;
              const appInterviews = interviews.filter((i) => i.applicationId === app.id);

              return (
                <div key={app.id} className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
                  {/* Card Main Bar */}
                  <div
                    onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                    className="p-6 cursor-pointer hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-slate-400">#APP-{app.id}</span>
                        <StatusBadge status={app.currentStatus} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{app.job.title}</h3>
                      <p className="text-xs text-slate-500">{app.job.department} · Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      {app.currentStatus !== 'WITHDRAWN' && app.currentStatus !== 'SELECTED' && app.currentStatus !== 'REJECTED' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWithdraw(app.id);
                          }}
                          className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-lg transition flex items-center gap-1"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          Withdraw
                        </button>
                      )}
                      <div className="p-1 rounded text-slate-400 hover:text-slate-900">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Visual Timeline Details */}
                  {isExpanded && (
                    <div className="p-6 bg-slate-50/50 space-y-8 border-t border-slate-100">
                      {/* Visual Status Progress Timeline */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-6">Recruitment Progress Flow</h4>
                        
                        {app.currentStatus === 'WITHDRAWN' ? (
                          <div className="p-4 bg-slate-200 border border-slate-300 text-slate-700 text-xs rounded-xl font-semibold flex items-center gap-2">
                            <Ban className="w-4 h-4 text-slate-500" />
                            <span>This application was withdrawn by candidate on {new Date(app.updatedAt).toLocaleDateString()}</span>
                          </div>
                        ) : app.currentStatus === 'REJECTED' ? (
                          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-semibold flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-rose-600" />
                            <span>Application not selected for this opening. Thank you for your interest!</span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 relative">
                            {timelineSteps.map((step, idx) => {
                              const status = getStepStatus(app.currentStatus, step.key);
                              return (
                                <div key={step.key} className="flex flex-col items-center text-center p-3 bg-white rounded-xl border border-slate-200 shadow-subtle">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition ${
                                      status === 'completed'
                                        ? 'bg-emerald-600 text-white'
                                        : status === 'current'
                                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                                        : 'bg-slate-100 text-slate-400'
                                    }`}
                                  >
                                    {status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                                  </div>
                                  <span className={`text-[11px] font-bold ${status === 'current' ? 'text-blue-600' : 'text-slate-700'}`}>
                                    {step.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Scheduled Interviews Section */}
                      {appInterviews.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Scheduled Interview Sessions</h4>
                          <div className="space-y-3">
                            {appInterviews.map((int) => (
                              <div key={int.id} className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-xs space-y-1">
                                <div className="font-bold text-indigo-950 text-sm">{int.interviewType}</div>
                                <div className="flex items-center gap-2 text-indigo-800 font-medium pt-1">
                                  <Calendar className="w-4 h-4 text-indigo-600" />
                                  <span>Date & Time: {int.scheduledDate} ({int.timeSlot})</span>
                                </div>
                                {int.interviewerName && <div className="text-slate-600">Interviewer: {int.interviewerName}</div>}
                                {int.meetingLink && (
                                  <a
                                    href={int.meetingLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-block mt-2 px-3 py-1.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition"
                                  >
                                    Join Virtual Meeting Room →
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Audit Status History Logs */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Status Audit History</h4>
                        <div className="space-y-2">
                          {app.statusHistory?.map((h) => (
                            <div key={h.id} className="p-3 bg-white border border-slate-200 rounded-lg text-xs flex justify-between items-center">
                              <div>
                                <span className="font-bold text-slate-900">{h.status.replace('_', ' ')}</span>
                                <span className="text-slate-500 ml-2">— {h.notes}</span>
                              </div>
                              <span className="text-[10px] text-slate-400">{new Date(h.changedAt).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
