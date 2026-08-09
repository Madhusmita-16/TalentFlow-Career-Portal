package com.talentflow.careerportal.controller;

import com.talentflow.careerportal.dto.*;
import com.talentflow.careerportal.entity.*;
import com.talentflow.careerportal.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER')")
public class AdminController {

    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;
    private final CandidateRepository candidateRepository;
    private final InterviewRepository interviewRepository;
    private final UserRepository userRepository;
    private final RecruiterNoteRepository recruiterNoteRepository;
    private final NotificationRepository notificationRepository;

    public AdminController(JobRepository jobRepository, JobApplicationRepository applicationRepository,
                           CandidateRepository candidateRepository, InterviewRepository interviewRepository,
                           UserRepository userRepository, RecruiterNoteRepository recruiterNoteRepository,
                           NotificationRepository notificationRepository) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.candidateRepository = candidateRepository;
        this.interviewRepository = interviewRepository;
        this.userRepository = userRepository;
        this.recruiterNoteRepository = recruiterNoteRepository;
        this.notificationRepository = notificationRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        AdminDashboardDto dto = new AdminDashboardDto();

        dto.setTotalJobs(jobRepository.count());
        dto.setActiveJobs(jobRepository.countByStatus(Job.JobStatus.PUBLISHED));
        dto.setTotalApplications(applicationRepository.count());
        dto.setNewApplications(applicationRepository.countByCurrentStatus(JobApplication.ApplicationStatus.SUBMITTED));
        dto.setTotalCandidates(candidateRepository.count());
        dto.setScheduledInterviews(interviewRepository.countByStatus(Interview.InterviewStatus.SCHEDULED));
        dto.setSelectedCandidates(applicationRepository.countByCurrentStatus(JobApplication.ApplicationStatus.SELECTED));

        // Distribution by status
        Map<String, Long> statusDist = new HashMap<>();
        for (JobApplication.ApplicationStatus status : JobApplication.ApplicationStatus.values()) {
            statusDist.put(status.name(), applicationRepository.countByCurrentStatus(status));
        }
        dto.setApplicationStatusDistribution(statusDist);

        // Applications by Department
        Map<String, Long> deptMap = new HashMap<>();
        List<JobApplication> allApps = applicationRepository.findAll();
        for (JobApplication app : allApps) {
            String dept = app.getJob().getDepartment();
            deptMap.put(dept, deptMap.getOrDefault(dept, 0L) + 1);
        }
        dto.setApplicationsByDepartment(deptMap);

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/applications")
    public ResponseEntity<?> getAllApplications(
            @RequestParam(required = false) Long jobId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search
    ) {
        List<JobApplication> apps = applicationRepository.findAll();

        if (jobId != null) {
            apps = apps.stream().filter(a -> a.getJob().getId().equals(jobId)).collect(Collectors.toList());
        }

        if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
            apps = apps.stream().filter(a -> a.getCurrentStatus().name().equalsIgnoreCase(status)).collect(Collectors.toList());
        }

        if (search != null && !search.isBlank()) {
            String q = search.toLowerCase().trim();
            apps = apps.stream().filter(a ->
                a.getCandidate().getUser().getFullName().toLowerCase().contains(q) ||
                a.getCandidate().getUser().getEmail().toLowerCase().contains(q) ||
                a.getJob().getTitle().toLowerCase().contains(q) ||
                a.getId().toString().contains(q)
            ).collect(Collectors.toList());
        }

        return ResponseEntity.ok(apps.stream().map(this::convertAppToDto).collect(Collectors.toList()));
    }

    @PatchMapping("/applications/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody StatusChangeRequest request,
            Principal principal
    ) {
        User recruiter = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Recruiter user not found"));

        JobApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        JobApplication.ApplicationStatus newStatus = JobApplication.ApplicationStatus.valueOf(request.getStatus().toUpperCase());
        application.setCurrentStatus(newStatus);

        ApplicationStatusHistory history = new ApplicationStatusHistory(
                application,
                newStatus,
                request.getNotes() != null ? request.getNotes() : "Status updated to " + newStatus.name(),
                recruiter
        );
        application.getStatusHistory().add(history);

        JobApplication saved = applicationRepository.save(application);

        // Send Candidate Notification
        Notification notification = new Notification(
                application.getCandidate().getUser(),
                "Application Status Update: " + newStatus.name().replace("_", " "),
                "Your application status for " + application.getJob().getTitle() + " has been changed to " + newStatus.name().replace("_", " ") + ".",
                "APPLICATION_STATUS",
                "/candidate/applications"
        );
        notificationRepository.save(notification);

        return ResponseEntity.ok(convertAppToDto(saved));
    }

    @PostMapping("/applications/{id}/notes")
    public ResponseEntity<?> addRecruiterNote(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload,
            Principal principal
    ) {
        User recruiter = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Recruiter user not found"));

        JobApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        String noteText = payload.get("note");
        if (noteText == null || noteText.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Note text is required"));
        }

        RecruiterNote note = new RecruiterNote(application, recruiter, noteText);
        RecruiterNote saved = recruiterNoteRepository.save(note);

        RecruiterNoteDto dto = new RecruiterNoteDto();
        dto.setId(saved.getId());
        dto.setApplicationId(application.getId());
        dto.setRecruiterUserId(recruiter.getId());
        dto.setRecruiterName(recruiter.getFullName());
        dto.setNote(saved.getNote());
        dto.setCreatedAt(saved.getCreatedAt());

        return ResponseEntity.ok(dto);
    }

    @PostMapping("/jobs")
    public ResponseEntity<?> createJob(@RequestBody JobDto dto, Principal principal) {
        User creator = userRepository.findByEmail(principal.getName()).orElse(null);

        Job job = new Job();
        job.setTitle(dto.getTitle());
        job.setDepartment(dto.getDepartment());
        job.setLocation(dto.getLocation());
        try { job.setEmploymentType(Job.EmploymentType.valueOf(dto.getEmploymentType().toUpperCase())); } catch (Exception ignored) {}
        try { job.setWorkMode(Job.WorkMode.valueOf(dto.getWorkMode().toUpperCase())); } catch (Exception ignored) {}
        job.setExperienceLevel(dto.getExperienceLevel());
        job.setSalaryMin(dto.getSalaryMin());
        job.setSalaryMax(dto.getSalaryMax());
        job.setOpenings(dto.getOpenings() != null ? dto.getOpenings() : 1);
        job.setDeadline(dto.getDeadline());
        job.setDescription(dto.getDescription());
        job.setResponsibilities(dto.getResponsibilities());
        job.setRequirements(dto.getRequirements());
        job.setPreferredQualifications(dto.getPreferredQualifications());
        job.setRequiredSkills(dto.getRequiredSkills());
        if (dto.getStatus() != null) {
            try { job.setStatus(Job.JobStatus.valueOf(dto.getStatus().toUpperCase())); } catch (Exception ignored) {}
        }
        job.setCreatedBy(creator);

        if (dto.getScreeningQuestions() != null) {
            for (ScreeningQuestionDto sqDto : dto.getScreeningQuestions()) {
                ScreeningQuestion.QuestionType qType = ScreeningQuestion.QuestionType.TEXT;
                if (sqDto.getQuestionType() != null) {
                    try { qType = ScreeningQuestion.QuestionType.valueOf(sqDto.getQuestionType().toUpperCase()); } catch (Exception ignored) {}
                }
                ScreeningQuestion sq = new ScreeningQuestion(job, sqDto.getQuestionText(), qType, sqDto.getOptionsJson(), sqDto.isRequired());
                job.getScreeningQuestions().add(sq);
            }
        }

        Job saved = jobRepository.save(job);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/jobs/{id}")
    public ResponseEntity<?> updateJob(@PathVariable Long id, @RequestBody JobDto dto) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));

        job.setTitle(dto.getTitle());
        job.setDepartment(dto.getDepartment());
        job.setLocation(dto.getLocation());
        if (dto.getEmploymentType() != null) {
            try { job.setEmploymentType(Job.EmploymentType.valueOf(dto.getEmploymentType().toUpperCase())); } catch (Exception ignored) {}
        }
        if (dto.getWorkMode() != null) {
            try { job.setWorkMode(Job.WorkMode.valueOf(dto.getWorkMode().toUpperCase())); } catch (Exception ignored) {}
        }
        job.setExperienceLevel(dto.getExperienceLevel());
        job.setSalaryMin(dto.getSalaryMin());
        job.setSalaryMax(dto.getSalaryMax());
        job.setOpenings(dto.getOpenings());
        job.setDeadline(dto.getDeadline());
        job.setDescription(dto.getDescription());
        job.setResponsibilities(dto.getResponsibilities());
        job.setRequirements(dto.getRequirements());
        job.setPreferredQualifications(dto.getPreferredQualifications());
        job.setRequiredSkills(dto.getRequiredSkills());
        if (dto.getStatus() != null) {
            try { job.setStatus(Job.JobStatus.valueOf(dto.getStatus().toUpperCase())); } catch (Exception ignored) {}
        }

        Job saved = jobRepository.save(job);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        jobRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Job deleted successfully"));
    }

    private ApplicationDto convertAppToDto(JobApplication app) {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(app.getId());

        Job j = app.getJob();
        JobDto jDto = new JobDto();
        jDto.setId(j.getId());
        jDto.setTitle(j.getTitle());
        jDto.setDepartment(j.getDepartment());
        jDto.setLocation(j.getLocation());
        jDto.setEmploymentType(j.getEmploymentType().name());
        jDto.setWorkMode(j.getWorkMode().name());
        dto.setJob(jDto);

        Candidate c = app.getCandidate();
        CandidateDto cDto = new CandidateDto();
        cDto.setId(c.getId());
        cDto.setFullName(c.getUser().getFullName());
        cDto.setEmail(c.getUser().getEmail());
        cDto.setPhone(c.getUser().getPhone());
        cDto.setLocation(c.getLocation());
        cDto.setSummary(c.getSummary());
        cDto.setResumeFilename(c.getResumeFilename());
        cDto.setResumeFilePath(app.getResumeFilePath() != null ? app.getResumeFilePath() : c.getResumeFilePath());
        if (c.getSkills() != null) {
            cDto.setSkills(c.getSkills().stream().map(CandidateSkill::getSkillName).collect(Collectors.toList()));
        }
        dto.setCandidate(cDto);

        dto.setResumeFilePath(app.getResumeFilePath());
        dto.setCoverNote(app.getCoverNote());
        dto.setCurrentStatus(app.getCurrentStatus().name());
        dto.setAppliedAt(app.getAppliedAt());
        dto.setUpdatedAt(app.getUpdatedAt());

        if (app.getAnswers() != null) {
            dto.setAnswers(app.getAnswers().stream().map(a -> {
                ScreeningAnswerDto saDto = new ScreeningAnswerDto();
                saDto.setQuestionId(a.getQuestion().getId());
                saDto.setQuestionText(a.getQuestion().getQuestionText());
                saDto.setAnswerText(a.getAnswerText());
                return saDto;
            }).collect(Collectors.toList()));
        }

        if (app.getStatusHistory() != null) {
            dto.setStatusHistory(app.getStatusHistory().stream().map(h -> {
                ApplicationDto.StatusHistoryDto shDto = new ApplicationDto.StatusHistoryDto();
                shDto.setId(h.getId());
                shDto.setStatus(h.getStatus().name());
                shDto.setNotes(h.getNotes());
                shDto.setChangedByName(h.getChangedBy() != null ? h.getChangedBy().getFullName() : "System");
                shDto.setChangedAt(h.getChangedAt());
                return shDto;
            }).collect(Collectors.toList()));
        }

        if (app.getRecruiterNotes() != null) {
            dto.setRecruiterNotes(app.getRecruiterNotes().stream().map(rn -> {
                RecruiterNoteDto rnDto = new RecruiterNoteDto();
                rnDto.setId(rn.getId());
                rnDto.setApplicationId(app.getId());
                rnDto.setRecruiterUserId(rn.getRecruiter().getId());
                rnDto.setRecruiterName(rn.getRecruiter().getFullName());
                rnDto.setNote(rn.getNote());
                rnDto.setCreatedAt(rn.getCreatedAt());
                return rnDto;
            }).collect(Collectors.toList()));
        }

        return dto;
    }
}
