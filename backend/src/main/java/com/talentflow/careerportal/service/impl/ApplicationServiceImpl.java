package com.talentflow.careerportal.service.impl;

import com.talentflow.careerportal.dto.ApplicationDto;
import com.talentflow.careerportal.dto.ApplicationStatusUpdateDTO;
import com.talentflow.careerportal.dto.ApplicationSubmitDTO;
import com.talentflow.careerportal.dto.PagedResponse;
import com.talentflow.careerportal.dto.RecruiterNoteDto;
import com.talentflow.careerportal.dto.ScreeningAnswerDto;
import com.talentflow.careerportal.entity.ApplicationStatusHistory;
import com.talentflow.careerportal.entity.Candidate;
import com.talentflow.careerportal.entity.CandidateSkill;
import com.talentflow.careerportal.entity.Job;
import com.talentflow.careerportal.entity.JobApplication;
import com.talentflow.careerportal.entity.RecruiterNote;
import com.talentflow.careerportal.entity.ScreeningAnswer;
import com.talentflow.careerportal.entity.ScreeningQuestion;
import com.talentflow.careerportal.entity.User;
import com.talentflow.careerportal.exception.BadRequestException;
import com.talentflow.careerportal.exception.DuplicateResourceException;
import com.talentflow.careerportal.exception.ResourceNotFoundException;
import com.talentflow.careerportal.repository.CandidateRepository;
import com.talentflow.careerportal.repository.JobApplicationRepository;
import com.talentflow.careerportal.repository.JobRepository;
import com.talentflow.careerportal.repository.UserRepository;
import com.talentflow.careerportal.service.ApplicationService;
import com.talentflow.careerportal.service.AuditService;
import com.talentflow.careerportal.util.SkillMatcherUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Enterprise implementation of ApplicationService managing application submission,
 * ATS candidate scoring, status pipeline state transitions, and recruiter audit logging.
 */
@Service
@Transactional
public class ApplicationServiceImpl implements ApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    @Autowired
    public ApplicationServiceImpl(JobApplicationRepository applicationRepository,
                                  JobRepository jobRepository,
                                  CandidateRepository candidateRepository,
                                  UserRepository userRepository,
                                  AuditService auditService) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.candidateRepository = candidateRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    @Override
    public ApplicationDto submitApplication(Long userId, ApplicationSubmitDTO submitDto) {
        if (submitDto == null || submitDto.getJobId() == null) {
            throw new BadRequestException("Job ID must be specified to submit an application.");
        }

        Candidate candidate = candidateRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate Profile", "userId", userId));

        Job job = jobRepository.findById(submitDto.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job Posting", "id", submitDto.getJobId()));

        if (applicationRepository.existsByCandidateIdAndJobId(candidate.getId(), job.getId())) {
            throw new DuplicateResourceException("You have already submitted an application for this position.");
        }

        JobApplication application = new JobApplication();
        application.setCandidate(candidate);
        application.setJob(job);
        application.setCoverLetter(submitDto.getCoverLetter() != null ? submitDto.getCoverLetter().trim() : "");
        application.setStatus(JobApplication.ApplicationStatus.APPLIED);
        application.setAppliedAt(LocalDateTime.now());

        String resumeUrl = submitDto.getResumeUrl() != null && !submitDto.getResumeUrl().isBlank() ?
                submitDto.getResumeUrl() : candidate.getResumeUrl();
        application.setResumeSnapshotUrl(resumeUrl);

        // Calculate ATS score
        List<String> candidateSkills = candidate.getSkills() != null ?
                candidate.getSkills().stream().map(CandidateSkill::getSkillName).collect(Collectors.toList()) :
                Collections.emptyList();
        int score = (int) Math.round(SkillMatcherUtil.calculateMatchPercentage(candidateSkills, job.getRequiredSkills()));
        application.setMatchPercentage(score);

        // Process screening answers
        if (submitDto.getAnswers() != null && !submitDto.getAnswers().isEmpty()) {
            for (ScreeningAnswerDto ansDto : submitDto.getAnswers()) {
                ScreeningAnswer ans = new ScreeningAnswer();
                ans.setApplication(application);
                ans.setQuestionId(ansDto.getQuestionId());
                ans.setAnswerText(ansDto.getAnswerText() != null ? ansDto.getAnswerText().trim() : "");
                application.getAnswers().add(ans);
            }
        }

        // Add initial status history record
        ApplicationStatusHistory history = new ApplicationStatusHistory();
        history.setApplication(application);
        history.setStatus("APPLIED");
        history.setChangeReason("Initial application submission by candidate.");
        history.setTimestamp(LocalDateTime.now());
        application.getStatusHistory().add(history);

        // Update job applications count
        job.setApplicationsCount(job.getApplicationsCount() + 1);
        jobRepository.save(job);

        JobApplication saved = applicationRepository.save(application);

        auditService.logEvent(userId, "APPLICATION_SUBMITTED", 
                "Candidate submitted application for job ID: " + job.getId() + " (" + job.getTitle() + ")", "APPLICATION_SERVICE");

        return mapToApplicationDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationDto getApplicationById(Long id) {
        JobApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", id));

        return mapToApplicationDto(application);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ApplicationDto> getApplicationsByCandidateUser(Long userId, int page, int size) {
        Candidate candidate = candidateRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "userId", userId));

        Pageable pageable = PageRequest.of(page < 0 ? 0 : page, size <= 0 ? 10 : size, Sort.by(Sort.Direction.DESC, "appliedAt"));
        Page<JobApplication> appPage = applicationRepository.findByCandidateId(candidate.getId(), pageable);

        List<ApplicationDto> dtos = appPage.getContent().stream()
                .map(this::mapToApplicationDto)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                dtos,
                appPage.getNumber(),
                appPage.getSize(),
                appPage.getTotalElements(),
                appPage.getTotalPages(),
                appPage.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ApplicationDto> getApplicationsByJob(Long jobId, int page, int size) {
        Pageable pageable = PageRequest.of(page < 0 ? 0 : page, size <= 0 ? 10 : size, Sort.by(Sort.Direction.DESC, "appliedAt"));
        Page<JobApplication> appPage = applicationRepository.findByJobId(jobId, pageable);

        List<ApplicationDto> dtos = appPage.getContent().stream()
                .map(this::mapToApplicationDto)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                dtos,
                appPage.getNumber(),
                appPage.getSize(),
                appPage.getTotalElements(),
                appPage.getTotalPages(),
                appPage.isLast()
        );
    }

    @Override
    public ApplicationDto updateApplicationStatus(Long userId, Long applicationId, ApplicationStatusUpdateDTO updateDto) {
        if (updateDto == null || updateDto.getStatus() == null) {
            throw new BadRequestException("Target application status must be provided.");
        }

        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        try {
            JobApplication.ApplicationStatus newStatus = 
                    JobApplication.ApplicationStatus.valueOf(updateDto.getStatus().toUpperCase().trim());
            application.setStatus(newStatus);
        } catch (Exception e) {
            throw new BadRequestException("Invalid status provided: " + updateDto.getStatus());
        }

        ApplicationStatusHistory history = new ApplicationStatusHistory();
        history.setApplication(application);
        history.setStatus(updateDto.getStatus().toUpperCase().trim());
        history.setChangeReason(updateDto.getNotes() != null ? updateDto.getNotes() : "Status updated by recruiter.");
        history.setTimestamp(LocalDateTime.now());
        application.getStatusHistory().add(history);

        JobApplication updated = applicationRepository.save(application);

        auditService.logEvent(userId, "APPLICATION_STATUS_UPDATED", 
                "Updated application ID " + applicationId + " status to " + updateDto.getStatus(), "APPLICATION_SERVICE");

        return mapToApplicationDto(updated);
    }

    @Override
    public ApplicationDto addRecruiterNote(Long recruiterUserId, Long applicationId, String noteText) {
        if (noteText == null || noteText.isBlank()) {
            throw new BadRequestException("Note content must not be blank.");
        }

        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        User recruiter = userRepository.findById(recruiterUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", recruiterUserId));

        RecruiterNote note = new RecruiterNote();
        note.setApplication(application);
        note.setAuthorName(recruiter.getFullName());
        note.setNoteText(noteText.trim());
        note.setCreatedAt(LocalDateTime.now());

        application.getNotes().add(note);

        JobApplication saved = applicationRepository.save(application);

        auditService.logEvent(recruiterUserId, "RECRUITER_NOTE_ADDED", 
                "Added note to application ID: " + applicationId, "APPLICATION_SERVICE");

        return mapToApplicationDto(saved);
    }

    @Override
    public ApplicationDto withdrawApplication(Long userId, Long applicationId) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        application.setStatus(JobApplication.ApplicationStatus.WITHDRAWN);

        ApplicationStatusHistory history = new ApplicationStatusHistory();
        history.setApplication(application);
        history.setStatus("WITHDRAWN");
        history.setChangeReason("Application withdrawn by candidate.");
        history.setTimestamp(LocalDateTime.now());
        application.getStatusHistory().add(history);

        JobApplication saved = applicationRepository.save(application);

        auditService.logEvent(userId, "APPLICATION_WITHDRAWN", 
                "Candidate withdrew application ID: " + applicationId, "APPLICATION_SERVICE");

        return mapToApplicationDto(saved);
    }

    @Override
    public int recalculateAtsMatchScore(Long applicationId) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        Candidate candidate = application.getCandidate();
        Job job = application.getJob();

        if (candidate == null || job == null) return 0;

        List<String> candidateSkills = candidate.getSkills() != null ?
                candidate.getSkills().stream().map(CandidateSkill::getSkillName).collect(Collectors.toList()) :
                Collections.emptyList();

        int score = (int) Math.round(SkillMatcherUtil.calculateMatchPercentage(candidateSkills, job.getRequiredSkills()));
        application.setMatchPercentage(score);

        applicationRepository.save(application);
        return score;
    }

    private ApplicationDto mapToApplicationDto(JobApplication app) {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(app.getId());
        dto.setStatus(app.getStatus() != null ? app.getStatus().name() : "APPLIED");
        dto.setAppliedAt(app.getAppliedAt());
        dto.setMatchPercentage(app.getMatchPercentage());
        dto.setCoverLetter(app.getCoverLetter());
        dto.setResumeSnapshotUrl(app.getResumeSnapshotUrl());

        if (app.getJob() != null) {
            dto.setJobId(app.getJob().getId());
            dto.setJobTitle(app.getJob().getTitle());
            if (app.getJob().getOrganization() != null) {
                dto.setCompanyName(app.getJob().getOrganization().getName());
                dto.setCompanyLogo(app.getJob().getOrganization().getLogoUrl());
            }
        }

        if (app.getCandidate() != null) {
            dto.setCandidateId(app.getCandidate().getId());
            dto.setCandidateName(app.getCandidate().getFullName());
            dto.setCandidateHeadline(app.getCandidate().getHeadline());
            dto.setCandidateAvatar(app.getCandidate().getAvatarUrl());
        }

        if (app.getNotes() != null) {
            dto.setNotes(app.getNotes().stream()
                    .map(n -> {
                        RecruiterNoteDto nDto = new RecruiterNoteDto();
                        nDto.setId(n.getId());
                        nDto.setAuthorName(n.getAuthorName());
                        nDto.setNoteText(n.getNoteText());
                        nDto.setCreatedAt(n.getCreatedAt());
                        return nDto;
                    })
                    .collect(Collectors.toList()));
        }

        return dto;
    }
}
