export type Role = 'CANDIDATE' | 'RECRUITER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  fullName: string;
  role: Role;
}

export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
export type WorkMode = 'ON_SITE' | 'HYBRID' | 'REMOTE';
export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';

export interface ScreeningQuestion {
  id: number;
  questionText: string;
  questionType: 'TEXT' | 'YES_NO' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
  optionsJson?: string;
  required: boolean;
}

export interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  workMode: WorkMode;
  experienceLevel: string;
  salaryMin?: number;
  salaryMax?: number;
  openings: number;
  deadline?: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  preferredQualifications?: string;
  requiredSkills?: string;
  status: JobStatus;
  screeningQuestions?: ScreeningQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id?: number;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startYear?: number;
  endYear?: number;
  grade?: string;
}

export interface WorkExperience {
  id?: number;
  company: string;
  position: string;
  startDate?: string;
  endDate?: string;
  currentlyWorking: boolean;
  responsibilities?: string;
}

export interface Candidate {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  summary?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeFilename?: string;
  resumeFilePath?: string;
  resumeUploadedAt?: string;
  educationList: Education[];
  workExperienceList: WorkExperience[];
  skills: string[];
}

export type ApplicationStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'INTERVIEW' | 'SELECTED' | 'REJECTED' | 'WITHDRAWN';

export interface ScreeningAnswer {
  questionId: number;
  questionText?: string;
  answerText: string;
}

export interface StatusHistory {
  id: number;
  status: ApplicationStatus;
  notes?: string;
  changedByName: string;
  changedAt: string;
}

export interface RecruiterNote {
  id: number;
  applicationId: number;
  recruiterUserId: number;
  recruiterName: string;
  note: string;
  createdAt: string;
}

export interface JobApplication {
  id: number;
  job: Job;
  candidate: Candidate;
  resumeFilePath?: string;
  coverNote?: string;
  currentStatus: ApplicationStatus;
  answers: ScreeningAnswer[];
  statusHistory: StatusHistory[];
  recruiterNotes: RecruiterNote[];
  appliedAt: string;
  updatedAt: string;
}

export interface Interview {
  id: number;
  applicationId: number;
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
  jobId: number;
  jobTitle: string;
  interviewType: string;
  scheduledDate: string;
  timeSlot: string;
  meetingLink?: string;
  interviewerName?: string;
  recruiterNotes?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  createdAt: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  linkUrl?: string;
  createdAt: string;
}

export interface AdminDashboardData {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  newApplications: number;
  totalCandidates: number;
  scheduledInterviews: number;
  selectedCandidates: number;
  applicationsByDepartment: Record<string, number>;
  applicationStatusDistribution: Record<string, number>;
}
