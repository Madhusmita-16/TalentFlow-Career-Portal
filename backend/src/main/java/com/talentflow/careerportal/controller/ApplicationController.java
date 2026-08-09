package com.talentflow.careerportal.controller;

import com.talentflow.careerportal.dto.*;
import com.talentflow.careerportal.entity.*;
import com.talentflow.careerportal.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;
    private final ScreeningQuestionRepository questionRepository;
    private final NotificationRepository notificationRepository;

    public ApplicationController(JobApplicationRepository applicationRepository, JobRepository jobRepository,
                                 CandidateRepository candidateRepository, UserRepository userRepository,
                                 ScreeningQuestionRepository questionRepository, NotificationRepository notificationRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.candidateRepository = candidateRepository;
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
        this.notificationRepository = notificationRepository;
    }

    @PostMapping
    public ResponseEntity<?> submitApplication(@RequestBody ApplicationRequest request, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Candidate candidate = candidateRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Candidate profile not found"));

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + request.getJobId()));

        if (applicationRepository.existsByJobIdAndCandidateId(job.getId(), candidate.getId())) {
            return ResponseEntity.badRequest().body(Map.of("message", "You have already submitted an application for this job!"));
        }

        String resumePath = request.getResumeFilePath() != null ? request.getResumeFilePath() : candidate.getResumeFilePath();

        JobApplication application = new JobApplication(job, candidate, resumePath, request.getCoverNote());
        application.setCurrentStatus(JobApplication.ApplicationStatus.SUBMITTED);

        // Record Status History Entry
        ApplicationStatusHistory history = new ApplicationStatusHistory(application, JobApplication.ApplicationStatus.SUBMITTED, "Application submitted by candidate", user);
        application.getStatusHistory().add(history);

        // Process Answers
        if (request.getAnswers() != null) {
            for (ScreeningAnswerDto aDto : request.getAnswers()) {
                ScreeningQuestion question = questionRepository.findById(aDto.getQuestionId()).orElse(null);
                if (question != null) {
                    ScreeningAnswer answer = new ScreeningAnswer(application, question, aDto.getAnswerText());
                    application.getAnswers().add(answer);
                }
            }
        }

        JobApplication saved = applicationRepository.save(application);

        // Create Candidate Notification
        Notification notification = new Notification(
                user,
                "Application Submitted Successfully",
                "Your application for " + job.getTitle() + " has been received.",
                "APPLICATION_STATUS",
                "/candidate/applications"
        );
        notificationRepository.save(notification);

        return ResponseEntity.ok(convertToDto(saved));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyApplications(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Candidate candidate = candidateRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Candidate profile not found"));

        List<JobApplication> list = applicationRepository.findByCandidateIdOrderByAppliedAtDesc(candidate.getId());
        return ResponseEntity.ok(list.stream().map(this::convertToDto).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getApplicationById(@PathVariable Long id, Principal principal) {
        JobApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));

        return ResponseEntity.ok(convertToDto(application));
    }

    @PatchMapping("/{id}/withdraw")
    public ResponseEntity<?> withdrawApplication(@PathVariable Long id, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        JobApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setCurrentStatus(JobApplication.ApplicationStatus.WITHDRAWN);
        ApplicationStatusHistory history = new ApplicationStatusHistory(application, JobApplication.ApplicationStatus.WITHDRAWN, "Withdrawn by candidate", user);
        application.getStatusHistory().add(history);

        JobApplication saved = applicationRepository.save(application);
        return ResponseEntity.ok(convertToDto(saved));
    }

    private ApplicationDto convertToDto(JobApplication app) {
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
        jDto.setExperienceLevel(j.getExperienceLevel());
        jDto.setSalaryMin(j.getSalaryMin());
        jDto.setSalaryMax(j.getSalaryMax());
        dto.setJob(jDto);

        Candidate c = app.getCandidate();
        CandidateDto cDto = new CandidateDto();
        cDto.setId(c.getId());
        cDto.setFullName(c.getUser().getFullName());
        cDto.setEmail(c.getUser().getEmail());
        cDto.setPhone(c.getUser().getPhone());
        cDto.setLocation(c.getLocation());
        cDto.setSummary(c.getSummary());
        cDto.setLinkedinUrl(c.getLinkedinUrl());
        cDto.setGithubUrl(c.getGithubUrl());
        cDto.setPortfolioUrl(c.getPortfolioUrl());
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
