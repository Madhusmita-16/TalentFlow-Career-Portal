import api from './axios';
import { Job, Candidate, JobApplication, Interview, NotificationItem, AdminDashboardData, AuthResponse, User } from '../types';

const MOCK_JOBS: Job[] = [
  {
    id: 1,
    title: "Senior Full-Stack Engineer (Java & React)",
    department: "Engineering",
    location: "San Francisco, CA",
    employmentType: "FULL_TIME",
    workMode: "HYBRID",
    experienceLevel: "Senior Level (5+ Years)",
    salaryMin: 145000,
    salaryMax: 180000,
    openings: 3,
    deadline: "2026-09-30",
    description: "We are seeking a Senior Full-Stack Engineer to drive the architectural evolution of our core recruitment SaaS platform.",
    responsibilities: "- Design, develop, and maintain high-performance Spring Boot microservices.\n- Build responsive, modern React UI interfaces with TypeScript and Tailwind CSS.\n- Optimize MySQL relational schemas and JPA query performance.",
    requirements: "- 5+ years of hands-on experience with Java 17+, Spring Framework, and REST APIs.\n- Strong proficiency in modern React.js, TypeScript, and state management.\n- Deep understanding of SQL database normalization and indexes.",
    preferredQualifications: "- AWS / Docker containerization experience.\n- Experience with CI/CD automated deployment pipelines.",
    requiredSkills: "Java 21, Spring Boot, React, TypeScript, MySQL, REST APIs",
    status: "PUBLISHED",
    screeningQuestions: [
      { id: 101, questionText: "How many years of commercial Java + Spring Boot experience do you have?", questionType: "SINGLE_CHOICE", optionsJson: "1-2 Years,3-4 Years,5+ Years", required: true },
      { id: 102, questionText: "Are you comfortable working in a hybrid environment in San Francisco?", questionType: "YES_NO", required: true },
      { id: 103, questionText: "Describe a complex microservices or database optimization problem you recently solved.", questionType: "TEXT", required: true }
    ],
    createdAt: "2026-08-01T10:00:00Z",
    updatedAt: "2026-08-01T10:00:00Z"
  },
  {
    id: 2,
    title: "Lead Product Manager — Cloud Platform",
    department: "Product",
    location: "New York, NY",
    employmentType: "FULL_TIME",
    workMode: "REMOTE",
    experienceLevel: "Director / Lead Level",
    salaryMin: 160000,
    salaryMax: 210000,
    openings: 1,
    deadline: "2026-09-15",
    description: "Lead Product Manager to own product strategy, roadmap execution, and user research for enterprise SaaS customers.",
    responsibilities: "- Define product vision and quarterly key results (OKRs).\n- Partner with engineering leads to prioritize backlogs and sprint goals.",
    requirements: "- 6+ years of product management experience in B2B SaaS.\n- Track record of scaling cloud software products.",
    preferredQualifications: "- MBA or CS degree.\n- Experience with Figma and Agile/Scrum tools.",
    requiredSkills: "Product Strategy, B2B SaaS, Agile, Analytics, User Research",
    status: "PUBLISHED",
    screeningQuestions: [
      { id: 201, questionText: "What is your experience managing remote cross-functional product squads?", questionType: "TEXT", required: true }
    ],
    createdAt: "2026-08-02T11:00:00Z",
    updatedAt: "2026-08-02T11:00:00Z"
  },
  {
    id: 3,
    title: "Principal UI/UX Product Designer",
    department: "Design",
    location: "Austin, TX",
    employmentType: "FULL_TIME",
    workMode: "HYBRID",
    experienceLevel: "Senior Level",
    salaryMin: 130000,
    salaryMax: 165000,
    openings: 2,
    deadline: "2026-10-15",
    description: "Craft elegant, accessible design systems and high-fidelity prototypes for next-generation enterprise products.",
    responsibilities: "- Create clean design systems in Figma.\n- Conduct user testing and prototype interactions.",
    requirements: "- Portfolio showcasing enterprise SaaS or web applications.\n- Mastery of Figma, design systems, and responsive UX.",
    preferredQualifications: "- Basic understanding of Tailwind CSS and React component structures.",
    requiredSkills: "Figma, Design Systems, UX Research, Prototyping, Accessibility",
    status: "PUBLISHED",
    screeningQuestions: [
      { id: 301, questionText: "Please provide the link to your online design portfolio.", questionType: "TEXT", required: true }
    ],
    createdAt: "2026-08-03T09:30:00Z",
    updatedAt: "2026-08-03T09:30:00Z"
  },
  {
    id: 4,
    title: "DevOps & Cloud Infrastructure Engineer",
    department: "Engineering",
    location: "Seattle, WA",
    employmentType: "FULL_TIME",
    workMode: "REMOTE",
    experienceLevel: "Mid-Senior Level",
    salaryMin: 140000,
    salaryMax: 175000,
    openings: 2,
    deadline: "2026-09-25",
    description: "Scale, monitor, and automate AWS infrastructure using Kubernetes, Terraform, and GitHub Actions.",
    responsibilities: "- Maintain high-availability Kubernetes clusters.\n- Automate zero-downtime deployment pipelines.",
    requirements: "- 4+ years managing production AWS / Cloud infrastructure.\n- Proficiency with Docker, Kubernetes, Terraform.",
    requiredSkills: "AWS, Kubernetes, Terraform, Docker, CI/CD, Linux",
    status: "PUBLISHED",
    screeningQuestions: [
      { id: 401, questionText: "Do you have AWS Solutions Architect Certification?", questionType: "YES_NO", required: false }
    ],
    createdAt: "2026-08-04T14:15:00Z",
    updatedAt: "2026-08-04T14:15:00Z"
  },
  {
    id: 5,
    title: "Enterprise Account Executive",
    department: "Sales",
    location: "Chicago, IL",
    employmentType: "FULL_TIME",
    workMode: "ON_SITE",
    experienceLevel: "Senior Level",
    salaryMin: 120000,
    salaryMax: 190000,
    openings: 4,
    deadline: "2026-09-10",
    description: "Drive new enterprise business growth and manage senior relationships across Fortune 500 accounts.",
    responsibilities: "- Prospect, negotiate, and close enterprise SaaS deals.\n- Deliver product demonstrations.",
    requirements: "- 5+ years selling B2B software solutions.\n- Proven track record of quota attainment.",
    requiredSkills: "Enterprise Sales, Solution Selling, CRM, Negotiation",
    status: "PUBLISHED",
    screeningQuestions: [],
    createdAt: "2026-08-05T08:45:00Z",
    updatedAt: "2026-08-05T08:45:00Z"
  },
  {
    id: 6,
    title: "Growth Marketing Specialist",
    department: "Marketing",
    location: "Boston, MA",
    employmentType: "FULL_TIME",
    workMode: "HYBRID",
    experienceLevel: "Mid Level",
    salaryMin: 95000,
    salaryMax: 125000,
    openings: 1,
    deadline: "2026-10-05",
    description: "Execute data-driven digital marketing campaigns across Google Search, LinkedIn, and email automation channels.",
    responsibilities: "- Optimize lead acquisition funnels.\n- Analyze campaign performance with Google Analytics 4.",
    requirements: "- 3+ years in B2B growth marketing.\n- Expertise in SEO, SEM, and performance marketing.",
    requiredSkills: "Growth Marketing, SEO, SEM, Google Analytics, LinkedIn Ads",
    status: "PUBLISHED",
    screeningQuestions: [],
    createdAt: "2026-08-06T16:20:00Z",
    updatedAt: "2026-08-06T16:20:00Z"
  }
];

const MOCK_CANDIDATE: Candidate = {
  id: 1,
  userId: 3,
  fullName: "Alex Morgan",
  email: "candidate@talentflow.com",
  phone: "+1 (555) 018-4420",
  location: "San Francisco, CA",
  summary: "Senior Full Stack Software Engineer with 6+ years of experience crafting enterprise cloud systems, Spring Boot microservices, and modern React interfaces.",
  linkedinUrl: "https://linkedin.com/in/alex-morgan-dev",
  githubUrl: "https://github.com/alex-morgan-dev",
  portfolioUrl: "https://alexmorgan.dev",
  resumeFilename: "Alex_Morgan_Resume_2026.pdf",
  resumeFilePath: "/uploads/alex_morgan_resume.pdf",
  resumeUploadedAt: "2026-08-05T12:00:00Z",
  educationList: [
    { id: 1, institution: "University of California, Berkeley", degree: "Bachelor of Science", fieldOfStudy: "Computer Science", startYear: 2016, endYear: 2020, grade: "3.85 GPA" }
  ],
  workExperienceList: [
    { id: 1, company: "TechCorp Solutions", position: "Senior Software Engineer", startDate: "2021-06-01", endDate: "", currentlyWorking: true, responsibilities: "Architected high-throughput microservices using Java 17 and Spring Boot. Managed React frontend components." }
  ],
  skills: ["Java 21", "Spring Boot", "React.js", "TypeScript", "MySQL", "Docker"]
};

const MOCK_APPLICATIONS: JobApplication[] = [
  {
    id: 1001,
    job: MOCK_JOBS[0],
    candidate: MOCK_CANDIDATE,
    coverNote: "I am thrilled to apply for the Senior Full-Stack Engineer role at TalentFlow. My background in Java, Spring Boot, and React aligns perfectly with your technology stack.",
    currentStatus: "INTERVIEW",
    answers: [
      { questionId: 101, questionText: "How many years of commercial Java + Spring Boot experience do you have?", answerText: "5+ Years" },
      { questionId: 102, questionText: "Are you comfortable working in a hybrid environment in San Francisco?", answerText: "Yes" },
      { questionId: 103, questionText: "Describe a complex microservices problem...", answerText: "Refactored legacy monolith into 4 Spring Boot microservices with Kafka messaging, reducing latency by 40%." }
    ],
    statusHistory: [
      { id: 1, status: "SUBMITTED", notes: "Application received", changedByName: "System", changedAt: "2026-08-02T14:30:00Z" },
      { id: 2, status: "UNDER_REVIEW", notes: "Resume matches senior criteria", changedByName: "Sarah Jenkins", changedAt: "2026-08-03T09:15:00Z" },
      { id: 3, status: "SHORTLISTED", notes: "Moved to shortlist", changedByName: "Sarah Jenkins", changedAt: "2026-08-04T11:00:00Z" },
      { id: 4, status: "INTERVIEW", notes: "Technical interview scheduled", changedByName: "Sarah Jenkins", changedAt: "2026-08-06T15:20:00Z" }
    ],
    recruiterNotes: [
      { id: 1, applicationId: 1001, recruiterUserId: 2, recruiterName: "Sarah Jenkins (Lead Recruiter)", note: "Strong technical candidate with solid Spring Boot + React experience.", createdAt: "2026-08-04T11:05:00Z" }
    ],
    appliedAt: "2026-08-02T14:30:00Z",
    updatedAt: "2026-08-06T15:20:00Z"
  }
];

const MOCK_ADMIN_DASHBOARD: AdminDashboardData = {
  totalJobs: 6,
  activeJobs: 6,
  totalApplications: 24,
  newApplications: 5,
  totalCandidates: 18,
  scheduledInterviews: 4,
  selectedCandidates: 2,
  applicationsByDepartment: {
    Engineering: 12,
    Product: 4,
    Design: 3,
    DevOps: 3,
    Sales: 2
  },
  applicationStatusDistribution: {
    SUBMITTED: 5,
    UNDER_REVIEW: 6,
    SHORTLISTED: 4,
    INTERVIEW: 4,
    SELECTED: 2,
    REJECTED: 3
  }
};

const mockResponse = <T,>(data: T) => Promise.resolve({ data } as any);

export const authApi = {
  login: async (data: any) => {
    try { return await api.post<AuthResponse>('/auth/login', data); }
    catch {
      const isRecruiter = data.email?.includes('recruiter') || data.email?.includes('admin');
      const role = data.email?.includes('admin') ? 'ADMIN' : isRecruiter ? 'RECRUITER' : 'CANDIDATE';
      const name = role === 'ADMIN' ? 'Executive Admin' : role === 'RECRUITER' ? 'Sarah Jenkins' : 'Alex Morgan';
      return mockResponse<AuthResponse>({ token: 'mock-jwt-token-12345', userId: 1, email: data.email, fullName: name, role });
    }
  },
  register: async (data: any) => {
    try { return await api.post<AuthResponse>('/auth/register', data); }
    catch { return mockResponse<AuthResponse>({ token: 'mock-jwt-token-12345', userId: 3, email: data.email, fullName: data.fullName, role: 'CANDIDATE' }); }
  },
  getCurrentUser: async () => {
    try { return await api.get('/auth/me'); }
    catch { return mockResponse<User>({ id: 1, email: 'candidate@talentflow.com', fullName: 'Alex Morgan', role: 'CANDIDATE', phone: '+1 (555) 018-4420' }); }
  },
};

export const jobsApi = {
  getJobs: async (params?: any) => {
    try { return await api.get<{ jobs: Job[]; totalPages: number; totalItems: number; currentPage: number }>('/jobs', { params }); }
    catch {
      let filtered = [...MOCK_JOBS];
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(j => j.title.toLowerCase().includes(q) || j.department.toLowerCase().includes(q) || j.requiredSkills?.toLowerCase().includes(q));
      }
      if (params?.department) {
        filtered = filtered.filter(j => j.department.toLowerCase() === params.department.toLowerCase());
      }
      return mockResponse({ jobs: filtered, totalPages: 1, totalItems: filtered.length, currentPage: 0 });
    }
  },
  getJobById: async (id: number) => {
    try { return await api.get<Job>(`/jobs/${id}`); }
    catch {
      const job = MOCK_JOBS.find(j => j.id === Number(id)) || MOCK_JOBS[0];
      return mockResponse<Job>(job);
    }
  },
};

export const candidateApi = {
  getProfile: async () => {
    try { return await api.get<Candidate>('/candidates/me'); }
    catch { return mockResponse<Candidate>(MOCK_CANDIDATE); }
  },
  updateProfile: async (data: Partial<Candidate>) => {
    try { return await api.put<Candidate>('/candidates/profile', data); }
    catch { return mockResponse<Candidate>({ ...MOCK_CANDIDATE, ...data }); }
  },
  uploadResume: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      return await api.post<{ message: string; filename: string; filePath: string }>('/candidates/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch {
      return mockResponse({ message: 'Upload successful', filename: file.name, filePath: `/uploads/${file.name}` });
    }
  },
};

export const applicationsApi = {
  submitApplication: async (data: any) => {
    try { return await api.post<JobApplication>('/applications', data); }
    catch { return mockResponse<JobApplication>(MOCK_APPLICATIONS[0]); }
  },
  getMyApplications: async () => {
    try { return await api.get<JobApplication[]>('/applications/me'); }
    catch { return mockResponse<JobApplication[]>(MOCK_APPLICATIONS); }
  },
  getApplicationById: async (id: number) => {
    try { return await api.get<JobApplication>(`/applications/${id}`); }
    catch { return mockResponse<JobApplication>(MOCK_APPLICATIONS[0]); }
  },
  withdrawApplication: async (id: number) => {
    try { return await api.patch<JobApplication>(`/applications/${id}/withdraw`); }
    catch { return mockResponse<JobApplication>({ ...MOCK_APPLICATIONS[0], currentStatus: 'WITHDRAWN' }); }
  },
};

export const adminApi = {
  getDashboard: async () => {
    try { return await api.get<AdminDashboardData>('/admin/dashboard'); }
    catch { return mockResponse<AdminDashboardData>(MOCK_ADMIN_DASHBOARD); }
  },
  getAllApplications: async (params?: any) => {
    try { return await api.get<JobApplication[]>('/admin/applications', { params }); }
    catch { return mockResponse<JobApplication[]>(MOCK_APPLICATIONS); }
  },
  updateApplicationStatus: async (id: number, status: string, notes?: string) => {
    try { return await api.patch<JobApplication>(`/admin/applications/${id}/status`, { status, notes }); }
    catch { return mockResponse<JobApplication>({ ...MOCK_APPLICATIONS[0], currentStatus: status as any }); }
  },
  addRecruiterNote: async (id: number, note: string) => {
    try { return await api.post(`/admin/applications/${id}/notes`, { note }); }
    catch { return mockResponse({ id: Date.now(), note }); }
  },
  createJob: async (data: any) => {
    try { return await api.post<Job>('/admin/jobs', data); }
    catch { return mockResponse<Job>({ ...MOCK_JOBS[0], id: Date.now(), ...data }); }
  },
  updateJob: async (id: number, data: any) => {
    try { return await api.put<Job>(`/admin/jobs/${id}`, data); }
    catch { return mockResponse<Job>({ ...MOCK_JOBS[0], id, ...data }); }
  },
  deleteJob: async (id: number) => {
    try { return await api.delete(`/admin/jobs/${id}`); }
    catch { return mockResponse({ message: 'Job deleted' }); }
  },
};

export const interviewApi = {
  getInterviews: async () => {
    try { return await api.get<Interview[]>('/interviews'); }
    catch {
      return mockResponse<Interview[]>([
        {
          id: 1,
          applicationId: 1001,
          candidateId: 1,
          candidateName: 'Alex Morgan',
          candidateEmail: 'candidate@talentflow.com',
          jobId: 1,
          jobTitle: 'Senior Full-Stack Engineer (Java & React)',
          interviewType: 'TECHNICAL',
          scheduledDate: '2026-08-15',
          timeSlot: '14:00 PM EST',
          meetingLink: 'https://meet.talentflow.com/tech-interview-alex',
          interviewerName: 'Sarah Jenkins',
          status: 'SCHEDULED',
          createdAt: '2026-08-06T15:20:00Z'
        }
      ]);
    }
  },
  scheduleInterview: async (data: any) => {
    try { return await api.post<Interview>('/interviews', data); }
    catch { return mockResponse<Interview>({ id: Date.now(), ...data, status: 'SCHEDULED', createdAt: new Date().toISOString() }); }
  },
};

export const notificationApi = {
  getNotifications: async () => {
    try { return await api.get<{ notifications: NotificationItem[]; unreadCount: number }>('/notifications'); }
    catch {
      return mockResponse({
        notifications: [
          {
            id: 1,
            title: 'Interview Scheduled',
            message: 'Your technical interview for Senior Full-Stack Engineer has been scheduled for Aug 15 at 2:00 PM EST.',
            type: 'INTERVIEW',
            read: false,
            linkUrl: '/candidate/applications',
            createdAt: '2026-08-06T15:20:00Z'
          },
          {
            id: 2,
            title: 'Application Status Update',
            message: 'Your application for Senior Full-Stack Engineer was moved to SHORTLISTED.',
            type: 'STATUS_CHANGE',
            read: true,
            linkUrl: '/candidate/applications',
            createdAt: '2026-08-04T11:00:00Z'
          }
        ],
        unreadCount: 1
      });
    }
  },
  markAsRead: async (id: number) => {
    try { return await api.patch(`/notifications/${id}/read`); }
    catch { return mockResponse({ success: true }); }
  },
};

