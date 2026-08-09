import api from './axios';
import { Job, Candidate, JobApplication, Interview, NotificationItem, AdminDashboardData, AuthResponse } from '../types';

export const authApi = {
  login: (data: any) => api.post<AuthResponse>('/auth/login', data),
  register: (data: any) => api.post<AuthResponse>('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
};

export const jobsApi = {
  getJobs: (params?: any) => api.get<{ jobs: Job[]; totalPages: number; totalItems: number; currentPage: number }>('/jobs', { params }),
  getJobById: (id: number) => api.get<Job>(`/jobs/${id}`),
};

export const candidateApi = {
  getProfile: () => api.get<Candidate>('/candidates/me'),
  updateProfile: (data: Partial<Candidate>) => api.put<Candidate>('/candidates/profile', data),
  uploadResume: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<{ message: string; filename: string; filePath: string }>('/candidates/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const applicationsApi = {
  submitApplication: (data: any) => api.post<JobApplication>('/applications', data),
  getMyApplications: () => api.get<JobApplication[]>('/applications/me'),
  getApplicationById: (id: number) => api.get<JobApplication>(`/applications/${id}`),
  withdrawApplication: (id: number) => api.patch<JobApplication>(`/applications/${id}/withdraw`),
};

export const adminApi = {
  getDashboard: () => api.get<AdminDashboardData>('/admin/dashboard'),
  getAllApplications: (params?: any) => api.get<JobApplication[]>('/admin/applications', { params }),
  updateApplicationStatus: (id: number, status: string, notes?: string) =>
    api.patch<JobApplication>(`/admin/applications/${id}/status`, { status, notes }),
  addRecruiterNote: (id: number, note: string) => api.post(`/admin/applications/${id}/notes`, { note }),
  createJob: (data: any) => api.post<Job>('/admin/jobs', data),
  updateJob: (id: number, data: any) => api.put<Job>(`/admin/jobs/${id}`, data),
  deleteJob: (id: number) => api.delete(`/admin/jobs/${id}`),
};

export const interviewApi = {
  getInterviews: () => api.get<Interview[]>('/interviews'),
  scheduleInterview: (data: any) => api.post<Interview>('/interviews', data),
};

export const notificationApi = {
  getNotifications: () => api.get<{ notifications: NotificationItem[]; unreadCount: number }>('/notifications'),
  markAsRead: (id: number) => api.patch(`/notifications/${id}/read`),
};
