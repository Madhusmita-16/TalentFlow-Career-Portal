package com.talentflow.careerportal.config;

import com.talentflow.careerportal.entity.*;
import com.talentflow.careerportal.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CandidateRepository candidateRepository;
    private final JobRepository jobRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, CandidateRepository candidateRepository,
                           JobRepository jobRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.candidateRepository = candidateRepository;
        this.jobRepository = jobRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Data already initialized
        }

        // 1. Create Default Admin User
        User adminUser = new User("admin@talentflow.com", passwordEncoder.encode("Admin@123"), "Executive Admin", "+1 (555) 019-2831", User.Role.ADMIN);
        userRepository.save(adminUser);

        // 2. Create Default Recruiter User
        User recruiterUser = new User("recruiter@talentflow.com", passwordEncoder.encode("Recruiter@123"), "Sarah Jenkins (Lead Recruiter)", "+1 (555) 014-9982", User.Role.RECRUITER);
        userRepository.save(recruiterUser);

        // 3. Create Default Candidate User & Profile
        User candidateUser = new User("candidate@talentflow.com", passwordEncoder.encode("Candidate@123"), "Alex Morgan", "+1 (555) 018-4420", User.Role.CANDIDATE);
        userRepository.save(candidateUser);

        Candidate candidate = new Candidate(candidateUser);
        candidate.setLocation("San Francisco, CA");
        candidate.setSummary("Senior Full Stack Software Engineer with 6+ years of experience crafting enterprise cloud systems, Spring Boot microservices, and modern React interfaces.");
        candidate.setLinkedinUrl("https://linkedin.com/in/alex-morgan-dev");
        candidate.setGithubUrl("https://github.com/alex-morgan-dev");
        candidate.setPortfolioUrl("https://alexmorgan.dev");

        // Seed Education
        candidate.getEducationList().add(new Education(candidate, "University of California, Berkeley", "Bachelor of Science", "Computer Science", 2016, 2020, "3.85 GPA"));

        // Seed Experience
        candidate.getWorkExperienceList().add(new WorkExperience(candidate, "TechCorp Solutions", "Senior Software Engineer", LocalDate.of(2021, 6, 1), null, true, "Architected high-throughput microservices using Java 17 and Spring Boot. Managed React frontend components."));

        // Seed Skills
        candidate.getSkills().add(new CandidateSkill(candidate, "Java 21"));
        candidate.getSkills().add(new CandidateSkill(candidate, "Spring Boot"));
        candidate.getSkills().add(new CandidateSkill(candidate, "React.js"));
        candidate.getSkills().add(new CandidateSkill(candidate, "TypeScript"));
        candidate.getSkills().add(new CandidateSkill(candidate, "MySQL"));
        candidate.getSkills().add(new CandidateSkill(candidate, "Docker"));

        candidateRepository.save(candidate);

        // 4. Seed 6 Real Published Jobs
        seedJob1(recruiterUser);
        seedJob2(recruiterUser);
        seedJob3(recruiterUser);
        seedJob4(recruiterUser);
        seedJob5(recruiterUser);
        seedJob6(recruiterUser);

        System.out.println(">>> TalentFlow DataInitializer successfully seeded Admin, Recruiter, Candidate, and 6 Jobs! <<<");
    }

    private void seedJob1(User recruiter) {
        Job job = new Job();
        job.setTitle("Senior Full-Stack Engineer (Java & React)");
        job.setDepartment("Engineering");
        job.setLocation("San Francisco, CA");
        job.setEmploymentType(Job.EmploymentType.FULL_TIME);
        job.setWorkMode(Job.WorkMode.HYBRID);
        job.setExperienceLevel("Senior Level (5+ Years)");
        job.setSalaryMin(145000);
        job.setSalaryMax(180000);
        job.setOpenings(3);
        job.setDeadline(LocalDate.now().plusDays(45));
        job.setDescription("We are seeking a Senior Full-Stack Engineer to drive the architectural evolution of our core recruitment SaaS platform.");
        job.setResponsibilities("- Design, develop, and maintain high-performance Spring Boot microservices.\n- Build responsive, modern React UI interfaces with TypeScript and Tailwind CSS.\n- Optimize MySQL relational schemas and JPA query performance.");
        job.setRequirements("- 5+ years of hands-on experience with Java 17+, Spring Framework, and REST APIs.\n- Strong proficiency in modern React.js, TypeScript, and state management.\n- Deep understanding of SQL database normalization and indexes.");
        job.setPreferredQualifications("- AWS / Docker containerization experience.\n- Experience with CI/CD automated deployment pipelines.");
        job.setRequiredSkills("Java 21, Spring Boot, React, TypeScript, MySQL, REST APIs");
        job.setStatus(Job.JobStatus.PUBLISHED);
        job.setCreatedBy(recruiter);

        job.getScreeningQuestions().add(new ScreeningQuestion(job, "How many years of commercial Java + Spring Boot experience do you have?", ScreeningQuestion.QuestionType.SINGLE_CHOICE, "1-2 Years,3-4 Years,5+ Years", true));
        job.getScreeningQuestions().add(new ScreeningQuestion(job, "Are you comfortable working in a hybrid environment in San Francisco?", ScreeningQuestion.QuestionType.YES_NO, null, true));
        job.getScreeningQuestions().add(new ScreeningQuestion(job, "Describe a complex microservices or database optimization problem you recently solved.", ScreeningQuestion.QuestionType.TEXT, null, true));

        jobRepository.save(job);
    }

    private void seedJob2(User recruiter) {
        Job job = new Job();
        job.setTitle("Lead Product Manager — Cloud Platform");
        job.setDepartment("Product");
        job.setLocation("New York, NY");
        job.setEmploymentType(Job.EmploymentType.FULL_TIME);
        job.setWorkMode(Job.WorkMode.REMOTE);
        job.setExperienceLevel("Director / Lead Level");
        job.setSalaryMin(160000);
        job.setSalaryMax(210000);
        job.setOpenings(1);
        job.setDeadline(LocalDate.now().plusDays(30));
        job.setDescription("Lead Product Manager to own product strategy, roadmap execution, and user research for enterprise SaaS customers.");
        job.setResponsibilities("- Define product vision and quarterly key results (OKRs).\n- Partner with engineering leads to prioritize backlogs and sprint goals.");
        job.setRequirements("- 6+ years of product management experience in B2B SaaS.\n- Track record of scaling cloud software products.");
        job.setPreferredQualifications("- MBA or CS degree.\n- Experience with Figma and Agile/Scrum tools.");
        job.setRequiredSkills("Product Strategy, B2B SaaS, Agile, Analytics, User Research");
        job.setStatus(Job.JobStatus.PUBLISHED);
        job.setCreatedBy(recruiter);

        job.getScreeningQuestions().add(new ScreeningQuestion(job, "What is your experience managing remote cross-functional product squads?", ScreeningQuestion.QuestionType.TEXT, null, true));
        jobRepository.save(job);
    }

    private void seedJob3(User recruiter) {
        Job job = new Job();
        job.setTitle("Principal UI/UX Product Designer");
        job.setDepartment("Design");
        job.setLocation("Austin, TX");
        job.setEmploymentType(Job.EmploymentType.FULL_TIME);
        job.setWorkMode(Job.WorkMode.HYBRID);
        job.setExperienceLevel("Senior Level");
        job.setSalaryMin(130000);
        job.setSalaryMax(165000);
        job.setOpenings(2);
        job.setDeadline(LocalDate.now().plusDays(60));
        job.setDescription("Craft elegant, accessible design systems and high-fidelity prototypes for next-generation enterprise products.");
        job.setResponsibilities("- Create clean design systems in Figma.\n- Conduct user testing and prototype interactions.");
        job.setRequirements("- Portfolio showcasing enterprise SaaS or web applications.\n- Mastery of Figma, design systems, and responsive UX.");
        job.setPreferredQualifications("- Basic understanding of Tailwind CSS and React component structures.");
        job.setRequiredSkills("Figma, Design Systems, UX Research, Prototyping, Accessibility");
        job.setStatus(Job.JobStatus.PUBLISHED);
        job.setCreatedBy(recruiter);

        job.getScreeningQuestions().add(new ScreeningQuestion(job, "Please provide the link to your online design portfolio.", ScreeningQuestion.QuestionType.TEXT, null, true));
        jobRepository.save(job);
    }

    private void seedJob4(User recruiter) {
        Job job = new Job();
        job.setTitle("DevOps & Cloud Infrastructure Engineer");
        job.setDepartment("Engineering");
        job.setLocation("Seattle, WA");
        job.setEmploymentType(Job.EmploymentType.FULL_TIME);
        job.setWorkMode(Job.WorkMode.REMOTE);
        job.setExperienceLevel("Mid-Senior Level");
        job.setSalaryMin(140000);
        job.setSalaryMax(175000);
        job.setOpenings(2);
        job.setDeadline(LocalDate.now().plusDays(40));
        job.setDescription("Scale, monitor, and automate AWS infrastructure using Kubernetes, Terraform, and GitHub Actions.");
        job.setResponsibilities("- Maintain high-availability Kubernetes clusters.\n- Automate zero-downtime deployment pipelines.");
        job.setRequirements("- 4+ years managing production AWS / Cloud infrastructure.\n- Proficiency with Docker, Kubernetes, Terraform.");
        job.setRequiredSkills("AWS, Kubernetes, Terraform, Docker, CI/CD, Linux");
        job.setStatus(Job.JobStatus.PUBLISHED);
        job.setCreatedBy(recruiter);

        job.getScreeningQuestions().add(new ScreeningQuestion(job, "Do you have AWS Solutions Architect Certification?", ScreeningQuestion.QuestionType.YES_NO, null, false));
        jobRepository.save(job);
    }

    private void seedJob5(User recruiter) {
        Job job = new Job();
        job.setTitle("Enterprise Account Executive");
        job.setDepartment("Sales");
        job.setLocation("Chicago, IL");
        job.setEmploymentType(Job.EmploymentType.FULL_TIME);
        job.setWorkMode(Job.WorkMode.ON_SITE);
        job.setExperienceLevel("Senior Level");
        job.setSalaryMin(120000);
        job.setSalaryMax(190000);
        job.setOpenings(4);
        job.setDeadline(LocalDate.now().plusDays(25));
        job.setDescription("Drive new enterprise business growth and manage senior relationships across Fortune 500 accounts.");
        job.setResponsibilities("- Prospect, negotiate, and close enterprise SaaS deals.\n- Deliver product demonstrations.");
        job.setRequirements("- 5+ years selling B2B software solutions.\n- Proven track record of quota attainment.");
        job.setRequiredSkills("Enterprise Sales, Solution Selling, CRM, Negotiation");
        job.setStatus(Job.JobStatus.PUBLISHED);
        job.setCreatedBy(recruiter);

        jobRepository.save(job);
    }

    private void seedJob6(User recruiter) {
        Job job = new Job();
        job.setTitle("Growth Marketing Specialist");
        job.setDepartment("Marketing");
        job.setLocation("Boston, MA");
        job.setEmploymentType(Job.EmploymentType.FULL_TIME);
        job.setWorkMode(Job.WorkMode.HYBRID);
        job.setExperienceLevel("Mid Level");
        job.setSalaryMin(95000);
        job.setSalaryMax(125000);
        job.setOpenings(1);
        job.setDeadline(LocalDate.now().plusDays(50));
        job.setDescription("Execute data-driven digital marketing campaigns across Google Search, LinkedIn, and email automation channels.");
        job.setResponsibilities("- Optimize lead acquisition funnels.\n- Analyze campaign performance with Google Analytics 4.");
        job.setRequirements("- 3+ years in B2B growth marketing.\n- Expertise in SEO, SEM, and performance marketing.");
        job.setRequiredSkills("Growth Marketing, SEO, SEM, Google Analytics, LinkedIn Ads");
        job.setStatus(Job.JobStatus.PUBLISHED);
        job.setCreatedBy(recruiter);

        jobRepository.save(job);
    }
}
