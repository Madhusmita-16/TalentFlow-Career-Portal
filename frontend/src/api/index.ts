import api from './axios';
import { Job, Candidate, JobApplication, Interview, NotificationItem, AdminDashboardData, AuthResponse, User, Post, ConnectionRequest, NetworkUser, Conversation, ChatMessage } from '../types';

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
  headline: "Senior Full-Stack Engineer at TechCorp Solutions | Java 21, React, Spring Boot",
  summary: "Senior Full Stack Software Engineer with 6+ years of experience crafting enterprise cloud systems, Spring Boot microservices, and modern React interfaces.",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  linkedinUrl: "https://linkedin.com/in/alex-morgan-dev",
  githubUrl: "https://github.com/alex-morgan-dev",
  portfolioUrl: "https://alexmorgan.dev",
  resumeFilename: "Alex_Morgan_Resume_2026.pdf",
  resumeFilePath: "/uploads/alex_morgan_resume.pdf",
  resumeUploadedAt: "2026-08-05T12:00:00Z",
  openToWork: true,
  connectionsCount: 482,
  profileViewsCount: 149,
  educationList: [
    { id: 1, institution: "University of California, Berkeley", degree: "Bachelor of Science", fieldOfStudy: "Computer Science", startYear: 2016, endYear: 2020, grade: "3.85 GPA" }
  ],
  workExperienceList: [
    { id: 1, company: "TechCorp Solutions", position: "Senior Software Engineer", startDate: "2021-06-01", endDate: "", currentlyWorking: true, responsibilities: "Architected high-throughput microservices using Java 17 and Spring Boot. Managed React frontend components." }
  ],
  skills: ["Java 21", "Spring Boot", "React.js", "TypeScript", "MySQL", "Docker", "REST APIs", "AWS S3", "Kafka"],
  certifications: [
    { id: 1, name: "AWS Certified Solutions Architect – Associate", issuingOrganization: "Amazon Web Services", issueDate: "2024-03-15", credentialId: "AWS-8839210" },
    { id: 2, name: "Oracle Certified Professional: Java SE 17 Developer", issuingOrganization: "Oracle", issueDate: "2023-11-10", credentialId: "OCP-992104" }
  ],
  projects: [
    {
      id: 1,
      title: "TalentFlow Enterprise Cloud API Gateway",
      role: "Lead Architect & Developer",
      description: "Designed and deployed a resilient API Gateway supporting 50,000 requests/sec with JWT stateless authentication, rate limiting, and automated failover.",
      technologies: ["Java 21", "Spring Cloud", "Redis", "Docker", "AWS S3"],
      liveUrl: "https://talentflow.com/demo",
      githubUrl: "https://github.com/alex-morgan-dev/cloud-gateway"
    },
    {
      id: 2,
      title: "Real-Time Distributed Analytics Stream",
      role: "Senior Engineer",
      description: "Built event-driven stream processing pipeline using Apache Kafka and Spring Boot, cutting data ingestion latency by 45%.",
      technologies: ["Apache Kafka", "Spring Boot", "React.js", "TypeScript", "MySQL"],
      liveUrl: "https://analytics.talentflow.com",
      githubUrl: "https://github.com/alex-morgan-dev/kafka-stream"
    }
  ],
  publications: [
    {
      id: 1,
      title: "Scaling Spring Boot Microservices for High-Concurrency SaaS Portals",
      publisher: "IEEE Transactions on Cloud Computing (2025)",
      publicationDate: "2025-06-12",
      paperUrl: "https://doi.org/10.1109/TCC.2025.3094821",
      abstractText: "This paper evaluates architectural techniques for optimizing JVM garbage collection and SQL pool connections under high concurrency workloads."
    }
  ],
  awards: [
    {
      id: 1,
      title: "1st Place Champion — Silicon Valley Cloud Hackathon",
      issuer: "AWS & TechCrunch",
      issueDate: "2025-09-20",
      description: "Awarded $25,000 grand prize for building an AI-assisted cloud recruitment portal."
    }
  ],
  patents: [
    {
      id: 1,
      title: "Adaptive Rate Limiting Method for Distributed Cloud API Gateways",
      patentNumber: "US11894201B2",
      issueDate: "2024-11-05"
    }
  ],
  languages: [
    { id: 1, language: "English", proficiency: "NATIVE" },
    { id: 2, language: "Spanish", proficiency: "PROFESSIONAL" }
  ],
  mediaAttachments: [
    {
      id: 1,
      title: "System Architecture Blueprints (PDF)",
      mediaUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      mediaType: "IMAGE"
    },
    {
      id: 2,
      title: "Product Demo Video Showcase",
      mediaUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      mediaType: "VIDEO"
    }
  ]
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

/* LINKEDIN FEED MOCK DATA & API */
const MOCK_POSTS: Post[] = [
  {
    id: 1,
    authorName: "Sarah Jenkins",
    authorTitle: "Lead Technical Recruiter at TalentFlow",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    authorBadge: "HIRING",
    content: "🚀 We're expanding our core engineering team! We are looking for Senior Full-Stack Engineers with deep expertise in Java 21, Spring Boot microservices, and React + TypeScript. If you love building scalable developer tools and career platforms, apply today or drop a comment below!",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    taggedJobId: 1,
    taggedJobTitle: "Senior Full-Stack Engineer (Java & React)",
    hashtags: ["#hiring", "#engineering", "#java", "#react", "#careers"],
    likesCount: 38,
    isLiked: false,
    commentsCount: 6,
    repostsCount: 4,
    comments: [
      {
        id: 101,
        authorName: "Alex Morgan",
        authorTitle: "Senior Full-Stack Engineer",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        content: "Just submitted my application via Easy Apply! Looking forward to connecting, Sarah.",
        createdAt: "2 hours ago",
        likes: 3
      },
      {
        id: 102,
        authorName: "David Kim",
        authorTitle: "Principal Systems Architect",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        content: "Great team at TalentFlow! Highly recommended for any Java/React engineers.",
        createdAt: "1 hour ago",
        likes: 5
      }
    ],
    createdAt: "3 hours ago"
  },
  {
    id: 2,
    authorName: "Alex Morgan",
    authorTitle: "Senior Full-Stack Engineer at TechCorp Solutions",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    authorBadge: "OPEN_TO_WORK",
    content: "📢 Exciting personal update! I am officially #OpenToWork for Senior Software Engineer and Lead Full-Stack roles (Remote or Hybrid in SF/Bay Area). Over the past 4 years, I've specialized in building Spring Boot microservices, high-performance API portals, and responsive React interfaces. Any connections or recommendations are greatly appreciated!",
    hashtags: ["#opentowork", "#softwareengineering", "#fullstack", "#java", "#react"],
    likesCount: 64,
    isLiked: true,
    commentsCount: 9,
    repostsCount: 12,
    comments: [
      {
        id: 201,
        authorName: "Elena Rostova",
        authorTitle: "VP of Engineering at CloudPulse",
        authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
        content: "Alex is an outstanding engineer! Anyone hiring for senior full-stack talent should grab him quick.",
        createdAt: "4 hours ago",
        likes: 8
      }
    ],
    createdAt: "5 hours ago"
  },
  {
    id: 3,
    authorName: "Michael Chen",
    authorTitle: "Head of Product Strategy at TechCorp",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    content: "💡 Tip for candidates interviewing in 2026: Don't just list frameworks on your resume—highlight measurable business outcomes! E.g. 'Optimized SQL query indexing to reduce latency by 45%' beats 'Experience with MySQL'. What's your top interviewing advice?",
    hashtags: ["#careeradvice", "#productmanagement", "#hiringtips"],
    likesCount: 112,
    isLiked: false,
    commentsCount: 18,
    repostsCount: 15,
    comments: [],
    createdAt: "1 day ago"
  }
];

export const feedApi = {
  getPosts: async () => {
    try { return await api.get<Post[]>('/posts'); }
    catch { return mockResponse<Post[]>([...MOCK_POSTS]); }
  },
  createPost: async (postData: Partial<Post>) => {
    try { return await api.post<Post>('/posts', postData); }
    catch {
      const newPost: Post = {
        id: Date.now(),
        authorName: postData.authorName || 'Alex Morgan',
        authorTitle: postData.authorTitle || 'Senior Full-Stack Engineer',
        authorAvatar: postData.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        authorBadge: postData.authorBadge || 'OPEN_TO_WORK',
        content: postData.content || '',
        imageUrl: postData.imageUrl,
        taggedJobId: postData.taggedJobId,
        taggedJobTitle: postData.taggedJobTitle,
        hashtags: postData.hashtags || [],
        likesCount: 0,
        isLiked: false,
        commentsCount: 0,
        repostsCount: 0,
        comments: [],
        createdAt: 'Just now'
      };
      MOCK_POSTS.unshift(newPost);
      return mockResponse<Post>(newPost);
    }
  },
  likePost: async (postId: number) => {
    try { return await api.post(`/posts/${postId}/like`); }
    catch {
      const post = MOCK_POSTS.find(p => p.id === postId);
      if (post) {
        post.isLiked = !post.isLiked;
        post.likesCount += post.isLiked ? 1 : -1;
      }
      return mockResponse({ success: true, isLiked: post?.isLiked, likesCount: post?.likesCount });
    }
  },
  addComment: async (postId: number, content: string) => {
    try { return await api.post(`/posts/${postId}/comments`, { content }); }
    catch {
      const post = MOCK_POSTS.find(p => p.id === postId);
      const newComment = {
        id: Date.now(),
        authorName: 'Alex Morgan',
        authorTitle: 'Senior Full-Stack Engineer',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        content,
        createdAt: 'Just now',
        likes: 0
      };
      if (post) {
        post.comments.push(newComment);
        post.commentsCount = post.comments.length;
      }
      return mockResponse(newComment);
    }
  }
};

/* LINKEDIN NETWORK MOCK DATA & API */
const MOCK_PENDING_REQUESTS: ConnectionRequest[] = [
  {
    id: 1,
    senderId: 10,
    senderName: "Amanda Vance",
    senderTitle: "Senior Engineering Manager at Stripe",
    senderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    senderLocation: "San Francisco, CA",
    mutualConnections: 14,
    createdAt: "Yesterday"
  },
  {
    id: 2,
    senderId: 11,
    senderName: "Jason Rivera",
    senderTitle: "Staff Cloud Engineer at Datadog",
    senderAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
    senderLocation: "Seattle, WA",
    mutualConnections: 8,
    createdAt: "2 days ago"
  }
];

const MOCK_SUGGESTED_USERS: NetworkUser[] = [
  {
    id: 20,
    name: "Elena Rostova",
    headline: "VP of Engineering at CloudPulse",
    location: "San Francisco, CA",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    company: "CloudPulse",
    mutualConnections: 22,
    connectionLevel: "2nd",
    isConnected: false,
    hasPendingRequest: false
  },
  {
    id: 21,
    name: "David Kim",
    headline: "Principal Systems Architect at AWS",
    location: "Palo Alto, CA",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    company: "Amazon Web Services",
    mutualConnections: 18,
    connectionLevel: "2nd",
    isConnected: false,
    hasPendingRequest: false
  },
  {
    id: 22,
    name: "Jessica Wu",
    headline: "Lead Technical Recruiter at Meta",
    location: "Menlo Park, CA",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    company: "Meta",
    mutualConnections: 31,
    connectionLevel: "2nd",
    isConnected: false,
    hasPendingRequest: false
  },
  {
    id: 23,
    name: "Marcus Sterling",
    headline: "Director of Product Design at Figma",
    location: "San Francisco, CA",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
    company: "Figma",
    mutualConnections: 9,
    connectionLevel: "3rd",
    isConnected: false,
    hasPendingRequest: false
  }
];

export const networkApi = {
  getPendingRequests: async () => {
    try { return await api.get<ConnectionRequest[]>('/network/requests'); }
    catch { return mockResponse<ConnectionRequest[]>([...MOCK_PENDING_REQUESTS]); }
  },
  getSuggestedUsers: async () => {
    try { return await api.get<NetworkUser[]>('/network/suggested'); }
    catch { return mockResponse<NetworkUser[]>([...MOCK_SUGGESTED_USERS]); }
  },
  sendConnectionRequest: async (userId: number) => {
    try { return await api.post(`/network/connect/${userId}`); }
    catch {
      const user = MOCK_SUGGESTED_USERS.find(u => u.id === userId);
      if (user) user.hasPendingRequest = true;
      return mockResponse({ success: true, message: 'Connection request sent' });
    }
  },
  respondConnectionRequest: async (requestId: number, action: 'ACCEPT' | 'IGNORE') => {
    try { return await api.post(`/network/requests/${requestId}`, { action }); }
    catch {
      const idx = MOCK_PENDING_REQUESTS.findIndex(r => r.id === requestId);
      if (idx !== -1) MOCK_PENDING_REQUESTS.splice(idx, 1);
      return mockResponse({ success: true, action });
    }
  }
};

/* LINKEDIN MESSAGING MOCK DATA & API */
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    participantId: 2,
    participantName: "Sarah Jenkins",
    participantTitle: "Lead Recruiter at TalentFlow",
    participantAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    onlineStatus: "ONLINE",
    lastMessage: "Hi Alex! We loved your profile and would love to schedule a technical interview for the Senior Full-Stack role.",
    lastMessageTime: "10:45 AM",
    unreadCount: 1,
    messages: [
      { id: 1, senderId: 2, senderName: "Sarah Jenkins", content: "Hi Alex, thanks for connecting!", timestamp: "Yesterday 2:15 PM", isMine: false },
      { id: 2, senderId: 3, senderName: "Alex Morgan", content: "Hi Sarah! Glad to connect. I saw the Senior Full-Stack Engineer posting and applied via Easy Apply.", timestamp: "Yesterday 2:20 PM", isMine: true },
      { id: 3, senderId: 2, senderName: "Sarah Jenkins", content: "Hi Alex! We loved your profile and would love to schedule a technical interview for the Senior Full-Stack role.", timestamp: "10:45 AM", isMine: false }
    ]
  },
  {
    id: 2,
    participantId: 20,
    participantName: "Elena Rostova",
    participantTitle: "VP of Engineering at CloudPulse",
    participantAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    onlineStatus: "AWAY",
    lastMessage: "Sounds great! Let's touch base early next week.",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    messages: [
      { id: 10, senderId: 20, senderName: "Elena Rostova", content: "Hey Alex! Saw your #OpenToWork post. Are you open to discussing staff roles at CloudPulse?", timestamp: "Yesterday 11:00 AM", isMine: false },
      { id: 11, senderId: 3, senderName: "Alex Morgan", content: "Hi Elena! Absolutely, CloudPulse is doing incredible work. I'd love to chat.", timestamp: "Yesterday 11:15 AM", isMine: true },
      { id: 12, senderId: 20, senderName: "Elena Rostova", content: "Sounds great! Let's touch base early next week.", timestamp: "Yesterday 11:30 AM", isMine: false }
    ]
  }
];

export const messagingApi = {
  getConversations: async () => {
    try { return await api.get<Conversation[]>('/conversations'); }
    catch { return mockResponse<Conversation[]>([...MOCK_CONVERSATIONS]); }
  },
  sendMessage: async (conversationId: number, content: string) => {
    try { return await api.post<ChatMessage>(`/conversations/${conversationId}/messages`, { content }); }
    catch {
      const conv = MOCK_CONVERSATIONS.find(c => c.id === conversationId);
      const newMsg: ChatMessage = {
        id: Date.now(),
        senderId: 3,
        senderName: 'Alex Morgan',
        content,
        timestamp: 'Just now',
        isMine: true
      };
      if (conv) {
        conv.messages.push(newMsg);
        conv.lastMessage = content;
        conv.lastMessageTime = 'Just now';
      }
      return mockResponse<ChatMessage>(newMsg);
    }
  }
};

/* CLOUD STORAGE (AWS S3) API MODULE */
export const cloudStorageApi = {
  uploadMedia: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      return await api.post<{ message: string; mediaUrl: string }>('/cloud/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } catch {
      return mockResponse({
        message: 'Uploaded to AWS S3 Cloud Storage',
        mediaUrl: URL.createObjectURL(file)
      });
    }
  }
};



