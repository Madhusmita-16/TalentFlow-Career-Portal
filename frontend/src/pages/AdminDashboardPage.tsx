import React, { useState, useEffect } from 'react';
import { adminApi, jobsApi, interviewApi } from '../api';
import { AdminDashboardData, JobApplication, Job, Interview, ApplicationStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Shield, Briefcase, Users, FileText, Calendar, Plus, Search, Filter, Edit, Trash2, CheckCircle2, MessageSquare, ExternalLink, ChevronRight, BarChart2 } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'jobs' | 'interviews'>('overview');

  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State for Applications Tab
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('ALL');

  // Selected Application Modal State
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [statusNoteInput, setStatusNoteInput] = useState('');
  const [newStatusInput, setNewStatusInput] = useState<ApplicationStatus>('SUBMITTED');
  const [recruiterNoteInput, setRecruiterNoteInput] = useState('');

  // Schedule Interview Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [interviewAppId, setInterviewAppId] = useState<number | null>(null);
  const [interviewType, setInterviewType] = useState('Technical Screening');
  const [scheduledDate, setScheduledDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 11:00 AM EST');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/abc-defg-hij');
  const [interviewerName, setInterviewerName] = useState('Senior Tech Lead');

  // Create Job Modal State
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDept, setJobDept] = useState('Engineering');
  const [jobLocation, setJobLocation] = useState('San Francisco, CA');
  const [jobEmpType, setJobEmpType] = useState('FULL_TIME');
  const [jobWorkMode, setJobWorkMode] = useState('HYBRID');
  const [jobMinSalary, setJobMinSalary] = useState(130000);
  const [jobMaxSalary, setJobMaxSalary] = useState(170000);
  const [jobDesc, setJobDesc] = useState('');

  useEffect(() => {
    fetchAdminPortalData();
  }, []);

  const fetchAdminPortalData = async () => {
    setIsLoading(true);
    try {
      const [dashRes, appRes, jobsRes, intRes] = await Promise.all([
        adminApi.getDashboard(),
        adminApi.getAllApplications(),
        jobsApi.getJobs({ page: 0, size: 50 }),
        interviewApi.getInterviews(),
      ]);

      setDashboardData(dashRes.data);
      setApplications(appRes.data);
      setJobs(jobsRes.data.jobs);
      setInterviews(intRes.data);
    } catch (err) {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp) return;
    try {
      const res = await adminApi.updateApplicationStatus(selectedApp.id, newStatusInput, statusNoteInput);
      setSelectedApp(res.data);
      setApplications((prev) => prev.map((a) => (a.id === selectedApp.id ? res.data : a)));
      setStatusNoteInput('');
      alert('Status updated successfully!');
    } catch (err) {
      // Ignore
    }
  };

  const handleAddNote = async () => {
    if (!selectedApp || !recruiterNoteInput.trim()) return;
    try {
      await adminApi.addRecruiterNote(selectedApp.id, recruiterNoteInput.trim());
      // Refresh application details
      const updated = await adminApi.getAllApplications();
      setApplications(updated.data);
      const match = updated.data.find((a: JobApplication) => a.id === selectedApp.id);
      if (match) setSelectedApp(match);
      setRecruiterNoteInput('');
    } catch (err) {
      // Ignore
    }
  };

  const handleCreateInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewAppId) return;

    try {
      await interviewApi.scheduleInterview({
        applicationId: interviewAppId,
        interviewType,
        scheduledDate,
        timeSlot,
        meetingLink,
        interviewerName,
      });

      setShowScheduleModal(false);
      fetchAdminPortalData();
      alert('Interview scheduled successfully! Candidate notified via email & notification bell.');
    } catch (err) {
      // Ignore
    }
  };

  const handleCreateJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createJob({
        title: jobTitle,
        department: jobDept,
        location: jobLocation,
        employmentType: jobEmpType,
        workMode: jobWorkMode,
        salaryMin: jobMinSalary,
        salaryMax: jobMaxSalary,
        description: jobDesc,
        status: 'PUBLISHED',
      });

      setShowJobModal(false);
      fetchAdminPortalData();
      alert('New job role published successfully!');
    } catch (err) {
      // Ignore
    }
  };

  const filteredApplications = applications.filter((app) => {
    const q = appSearch.toLowerCase().trim();
    const matchSearch =
      !q ||
      app.candidate.fullName.toLowerCase().includes(q) ||
      app.candidate.email.toLowerCase().includes(q) ||
      app.job.title.toLowerCase().includes(q) ||
      app.id.toString().includes(q);

    const matchStatus = appStatusFilter === 'ALL' || app.currentStatus === appStatusFilter;
    return matchSearch && matchStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
        <div className="text-slate-400 text-xs font-semibold">Loading Admin & Recruiter Portal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-panel border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Recruiter Portal</span>
              <h1 className="text-2xl font-extrabold tracking-tight">TalentFlow Executive Management</h1>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowJobModal(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Post New Role
            </button>
            <button
              onClick={() => {
                if (applications.length > 0) {
                  setInterviewAppId(applications[0].id);
                  setShowScheduleModal(true);
                }
              }}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg border border-slate-700 transition flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-blue-400" />
              Schedule Interview
            </button>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex border-b border-slate-200 text-sm font-bold text-slate-600 space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 transition flex items-center gap-2 ${
              activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Metrics & Analytics
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`pb-3 transition flex items-center gap-2 ${
              activeTab === 'applications' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Applications Pipeline ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`pb-3 transition flex items-center gap-2 ${
              activeTab === 'jobs' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Active Job Roles ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('interviews')}
            className={`pb-3 transition flex items-center gap-2 ${
              activeTab === 'interviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Scheduled Interviews ({interviews.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW METRICS & CHARTS */}
        {activeTab === 'overview' && dashboardData && (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-card">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Applications</div>
                <div className="text-3xl font-black text-slate-900 mt-1">{dashboardData.totalApplications}</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-card">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Submitted</div>
                <div className="text-3xl font-black text-blue-600 mt-1">{dashboardData.newApplications}</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-card">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Published Roles</div>
                <div className="text-3xl font-black text-emerald-600 mt-1">{dashboardData.activeJobs}</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-card">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interviews Scheduled</div>
                <div className="text-3xl font-black text-indigo-600 mt-1">{dashboardData.scheduledInterviews}</div>
              </div>
            </div>

            {/* Distribution Charts Visual Representation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Application Status Distribution */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-card space-y-4">
                <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">Status Distribution Breakdown</h3>
                <div className="space-y-3 text-xs">
                  {Object.entries(dashboardData.applicationStatusDistribution || {}).map(([st, cnt]) => {
                    const pct = dashboardData.totalApplications > 0 ? ((cnt / dashboardData.totalApplications) * 100).toFixed(0) : 0;
                    return (
                      <div key={st} className="space-y-1">
                        <div className="flex justify-between font-semibold text-slate-700">
                          <span>{st.replace('_', ' ')}</span>
                          <span>{cnt} ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Applications by Department */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-card space-y-4">
                <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">Applications by Department</h3>
                <div className="space-y-3 text-xs">
                  {Object.entries(dashboardData.applicationsByDepartment || {}).map(([dept, cnt]) => {
                    const pct = dashboardData.totalApplications > 0 ? ((cnt / dashboardData.totalApplications) * 100).toFixed(0) : 0;
                    return (
                      <div key={dept} className="space-y-1">
                        <div className="flex justify-between font-semibold text-slate-700">
                          <span>{dept}</span>
                          <span>{cnt} applications</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPLICATIONS PIPELINE */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  placeholder="Search candidate name, email, or job title..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-600 text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 w-full md:w-auto">
                <span>Filter Status:</span>
                <select
                  value={appStatusFilter}
                  onChange={(e) => setAppStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="SELECTED">Selected</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="WITHDRAWN">Withdrawn</option>
                </select>
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">App ID</th>
                    <th className="py-3 px-4">Candidate Name</th>
                    <th className="py-3 px-4">Target Job Title</th>
                    <th className="py-3 px-4">Applied Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">#APP-{app.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{app.candidate.fullName}</div>
                        <div className="text-[11px] text-slate-500">{app.candidate.email}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">{app.job.title}</td>
                      <td className="py-3.5 px-4 text-slate-600">{new Date(app.appliedAt).toLocaleDateString()}</td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={app.currentStatus} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setNewStatusInput(app.currentStatus);
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] rounded-lg transition"
                        >
                          Review Candidate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ACTIVE JOBS */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Published & Open Job Positions</h3>
              <button
                onClick={() => setShowJobModal(true)}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-500 transition"
              >
                + Add Job
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {jobs.map((j) => (
                <div key={j.id} className="py-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{j.title}</h4>
                    <p className="text-xs text-slate-500">{j.department} · {j.location} · {j.workMode} · {j.status}</p>
                  </div>
                  <div className="text-xs font-semibold text-slate-700">
                    ${(j.salaryMin! / 1000).toFixed(0)}k - ${(j.salaryMax! / 1000).toFixed(0)}k / yr
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SCHEDULED INTERVIEWS */}
        {activeTab === 'interviews' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">Candidate Scheduled Interviews</h3>
            <div className="divide-y divide-slate-100">
              {interviews.map((int) => (
                <div key={int.id} className="py-4 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{int.candidateName} — {int.interviewType}</div>
                    <div className="text-slate-600">{int.jobTitle} · {int.scheduledDate} ({int.timeSlot})</div>
                    <div className="text-slate-400">Interviewer: {int.interviewerName}</div>
                  </div>
                  {int.meetingLink && (
                    <a href={int.meetingLink} target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline">
                      Join Link →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CANDIDATE REVIEW MODAL */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-panel">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-slate-400">Application #APP-{selectedApp.id}</span>
                  <h2 className="text-xl font-bold text-slate-900">{selectedApp.candidate.fullName}</h2>
                  <p className="text-xs text-slate-500">{selectedApp.job.title} · {selectedApp.candidate.email}</p>
                </div>
                <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-900 text-lg font-bold">×</button>
              </div>

              {/* Status Update Form */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
                <div className="font-bold text-slate-900">Change Application Status Workflow</div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={newStatusInput}
                    onChange={(e) => setNewStatusInput(e.target.value as ApplicationStatus)}
                    className="bg-white border border-slate-200 rounded-lg px-3 py-2 font-semibold text-slate-800"
                  >
                    <option value="SUBMITTED">SUBMITTED</option>
                    <option value="UNDER_REVIEW">UNDER REVIEW</option>
                    <option value="SHORTLISTED">SHORTLISTED</option>
                    <option value="INTERVIEW">INTERVIEW</option>
                    <option value="SELECTED">SELECTED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>

                  <input
                    type="text"
                    value={statusNoteInput}
                    onChange={(e) => setStatusNoteInput(e.target.value)}
                    placeholder="Audit status change note..."
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none"
                  />

                  <button
                    onClick={handleUpdateStatus}
                    className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition shrink-0"
                  >
                    Update Status
                  </button>
                </div>
              </div>

              {/* Candidate Info & Resume */}
              <div className="space-y-3 text-xs">
                <div className="font-bold text-slate-900 text-sm">Candidate Overview</div>
                {selectedApp.candidate.resumeFilePath && (
                  <a
                    href={`http://localhost:8080${selectedApp.candidate.resumeFilePath}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-lg"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Candidate Resume PDF
                  </a>
                )}
                <div className="p-3 bg-slate-50 rounded-lg text-slate-700 leading-relaxed">
                  {selectedApp.coverNote ? `Cover Note: "${selectedApp.coverNote}"` : 'No cover note provided.'}
                </div>
              </div>

              {/* Private Recruiter Notes */}
              <div className="space-y-3 text-xs">
                <div className="font-bold text-slate-900 text-sm">Internal Recruiter Notes</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={recruiterNoteInput}
                    onChange={(e) => setRecruiterNoteInput(e.target.value)}
                    placeholder="Add private note for hiring managers..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  />
                  <button
                    onClick={handleAddNote}
                    className="px-4 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700"
                  >
                    Add Note
                  </button>
                </div>

                <div className="space-y-2">
                  {selectedApp.recruiterNotes?.map((rn) => (
                    <div key={rn.id} className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg text-slate-800">
                      <div className="font-bold">{rn.recruiterName} <span className="text-[10px] text-slate-400 font-normal">({new Date(rn.createdAt).toLocaleString()})</span></div>
                      <div>{rn.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCHEDULE INTERVIEW MODAL */}
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-panel">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-900">Schedule Candidate Interview</h3>
                <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 text-lg font-bold">×</button>
              </div>

              <form onSubmit={handleCreateInterview} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Candidate Application</label>
                  <select
                    value={interviewAppId || ''}
                    onChange={(e) => setInterviewAppId(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    {applications.map((a) => (
                      <option key={a.id} value={a.id}>
                        #APP-{a.id} — {a.candidate.fullName} ({a.job.title})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Interview Type</label>
                  <input
                    type="text"
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Meeting Link</label>
                  <input
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition mt-2"
                >
                  Send Interview Invite
                </button>
              </form>
            </div>
          </div>
        )}

        {/* CREATE JOB MODAL */}
        {showJobModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-panel max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-900">Post New Role</h3>
                <button onClick={() => setShowJobModal(false)} className="text-slate-400 text-lg font-bold">×</button>
              </div>

              <form onSubmit={handleCreateJobSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Backend Engineer"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Department</label>
                    <select
                      value={jobDept}
                      onChange={(e) => setJobDept(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Product">Product</option>
                      <option value="Design">Design</option>
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={jobLocation}
                      onChange={(e) => setJobLocation(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Job Description</label>
                  <textarea
                    rows={4}
                    required
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    placeholder="Provide overview of the role..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition mt-2"
                >
                  Publish Job Posting
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
