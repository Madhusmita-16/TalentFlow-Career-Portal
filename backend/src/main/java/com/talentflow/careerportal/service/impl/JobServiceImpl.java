package com.talentflow.careerportal.service.impl;

import com.talentflow.careerportal.dto.JobCreateDTO;
import com.talentflow.careerportal.dto.JobResponseDTO;
import com.talentflow.careerportal.dto.JobSearchCriteria;
import com.talentflow.careerportal.dto.PagedResponse;
import com.talentflow.careerportal.dto.ScreeningQuestionDto;
import com.talentflow.careerportal.entity.Candidate;
import com.talentflow.careerportal.entity.CandidateSkill;
import com.talentflow.careerportal.entity.Job;
import com.talentflow.careerportal.entity.Organization;
import com.talentflow.careerportal.entity.ScreeningQuestion;
import com.talentflow.careerportal.entity.User;
import com.talentflow.careerportal.exception.BadRequestException;
import com.talentflow.careerportal.exception.ResourceNotFoundException;
import com.talentflow.careerportal.exception.UnauthorizedException;
import com.talentflow.careerportal.repository.CandidateRepository;
import com.talentflow.careerportal.repository.JobRepository;
import com.talentflow.careerportal.repository.OrganizationRepository;
import com.talentflow.careerportal.repository.UserRepository;
import com.talentflow.careerportal.service.JobService;
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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Enterprise implementation of JobService managing job specifications,
 * multi-criteria searches, skill alignment algorithms, and candidate matching.
 */
@Service
@Transactional
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final CandidateRepository candidateRepository;
    private final AuditService auditService;

    @Autowired
    public JobServiceImpl(JobRepository jobRepository,
                          OrganizationRepository organizationRepository,
                          UserRepository userRepository,
                          CandidateRepository candidateRepository,
                          AuditService auditService) {
        this.jobRepository = jobRepository;
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
        this.candidateRepository = candidateRepository;
        this.auditService = auditService;
    }

    @Override
    @Transactional(readOnly = true)
    public JobResponseDTO getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));

        return mapToJobResponseDTO(job);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<JobResponseDTO> searchJobs(JobSearchCriteria criteria, int page, int size) {
        Pageable pageable = PageRequest.of(
                page < 0 ? 0 : page, 
                size <= 0 ? 10 : size, 
                Sort.by(Sort.Direction.DESC, "postedAt")
        );

        Page<Job> jobPage = jobRepository.findAll(pageable);

        List<JobResponseDTO> dtos = jobPage.getContent().stream()
                .filter(job -> filterByCriteria(job, criteria))
                .map(this::mapToJobResponseDTO)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                dtos,
                jobPage.getNumber(),
                jobPage.getSize(),
                jobPage.getTotalElements(),
                jobPage.getTotalPages(),
                jobPage.isLast()
        );
    }

    @Override
    public JobResponseDTO createJob(Long userId, JobCreateDTO createDto) {
        if (createDto == null || createDto.getTitle() == null || createDto.getDescription() == null) {
            throw new BadRequestException("Job title and description are required.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Job job = new Job();
        job.setTitle(createDto.getTitle().trim());
        job.setDescription(createDto.getDescription().trim());
        job.setDepartment(createDto.getDepartment() != null ? createDto.getDepartment().trim() : "Engineering");
        job.setLocation(createDto.getLocation() != null ? createDto.getLocation().trim() : "Remote");
        job.setJobType(createDto.getJobType() != null ? createDto.getJobType().trim() : "Full-time");
        job.setExperienceLevel(createDto.getExperienceLevel() != null ? createDto.getExperienceLevel().trim() : "Mid-Level");
        job.setRemote(createDto.getRemote() != null ? createDto.getRemote() : true);
        job.setSalaryMin(createDto.getSalaryMin());
        job.setSalaryMax(createDto.getSalaryMax());
        job.setCurrency(createDto.getCurrency() != null ? createDto.getCurrency() : "USD");
        job.setStatus(Job.JobStatus.ACTIVE);
        job.setPostedAt(LocalDateTime.now());
        job.setViewsCount(0);
        job.setApplicationsCount(0);

        if (createDto.getRequirements() != null) {
            job.setRequirements(createDto.getRequirements());
        }

        if (createDto.getRequiredSkills() != null) {
            job.setRequiredSkills(createDto.getRequiredSkills());
        }

        if (createDto.getOrganizationId() != null) {
            Organization org = organizationRepository.findById(createDto.getOrganizationId())
                    .orElse(null);
            job.setOrganization(org);
        }

        if (createDto.getScreeningQuestions() != null && !createDto.getScreeningQuestions().isEmpty()) {
            for (ScreeningQuestionDto sqDto : createDto.getScreeningQuestions()) {
                ScreeningQuestion sq = new ScreeningQuestion();
                sq.setJob(job);
                sq.setQuestionText(sqDto.getQuestionText());
                sq.setQuestionType(sqDto.getQuestionType() != null ? sqDto.getQuestionType() : "TEXT");
                sq.setRequired(sqDto.getRequired() != null ? sqDto.getRequired() : true);
                job.getScreeningQuestions().add(sq);
            }
        }

        Job savedJob = jobRepository.save(job);

        auditService.logEvent(userId, "JOB_CREATED", 
                "Created new job posting: " + savedJob.getTitle() + " (ID: " + savedJob.getId() + ")", "JOB_SERVICE");

        return mapToJobResponseDTO(savedJob);
    }

    @Override
    public JobResponseDTO updateJob(Long userId, Long jobId, JobCreateDTO updateDto) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (updateDto.getTitle() != null) job.setTitle(updateDto.getTitle().trim());
        if (updateDto.getDescription() != null) job.setDescription(updateDto.getDescription().trim());
        if (updateDto.getLocation() != null) job.setLocation(updateDto.getLocation().trim());
        if (updateDto.getJobType() != null) job.setJobType(updateDto.getJobType().trim());
        if (updateDto.getExperienceLevel() != null) job.setExperienceLevel(updateDto.getExperienceLevel().trim());
        if (updateDto.getRemote() != null) job.setRemote(updateDto.getRemote());
        if (updateDto.getSalaryMin() != null) job.setSalaryMin(updateDto.getSalaryMin());
        if (updateDto.getSalaryMax() != null) job.setSalaryMax(updateDto.getSalaryMax());
        if (updateDto.getRequirements() != null) job.setRequirements(updateDto.getRequirements());
        if (updateDto.getRequiredSkills() != null) job.setRequiredSkills(updateDto.getRequiredSkills());

        Job updated = jobRepository.save(job);

        auditService.logEvent(userId, "JOB_UPDATED", "Updated job posting: " + jobId, "JOB_SERVICE");
        return mapToJobResponseDTO(updated);
    }

    @Override
    public JobResponseDTO updateJobStatus(Long userId, Long jobId, String statusStr) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        try {
            Job.JobStatus status = Job.JobStatus.valueOf(statusStr.toUpperCase().trim());
            job.setStatus(status);
        } catch (Exception e) {
            throw new BadRequestException("Invalid job status value: " + statusStr);
        }

        Job updated = jobRepository.save(job);

        auditService.logEvent(userId, "JOB_STATUS_CHANGED", 
                "Updated job status to " + statusStr + " for job ID: " + jobId, "JOB_SERVICE");

        return mapToJobResponseDTO(updated);
    }

    @Override
    public void deleteJob(Long userId, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        jobRepository.delete(job);

        auditService.logEvent(userId, "JOB_DELETED", "Deleted job posting: " + jobId, "JOB_SERVICE");
    }

    @Override
    public void incrementViewsCount(Long jobId) {
        Job job = jobRepository.findById(jobId).orElse(null);
        if (job != null) {
            job.setViewsCount(job.getViewsCount() + 1);
            jobRepository.save(job);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<JobResponseDTO> getJobsByOrganization(Long organizationId, int page, int size) {
        Pageable pageable = PageRequest.of(page < 0 ? 0 : page, size <= 0 ? 10 : size, Sort.by(Sort.Direction.DESC, "postedAt"));
        Page<Job> jobPage = jobRepository.findAll(pageable);

        List<JobResponseDTO> dtos = jobPage.getContent().stream()
                .filter(job -> job.getOrganization() != null && job.getOrganization().getId().equals(organizationId))
                .map(this::mapToJobResponseDTO)
                .collect(Collectors.toList());

        return new PagedResponse<>(dtos, page, size, dtos.size(), 1, true);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponseDTO> getRecommendedJobsForCandidate(Long candidateId, int limit) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "id", candidateId));

        List<String> candidateSkills = candidate.getSkills() != null ?
                candidate.getSkills().stream().map(CandidateSkill::getSkillName).collect(Collectors.toList()) :
                Collections.emptyList();

        List<Job> allJobs = jobRepository.findAll();

        return allJobs.stream()
                .filter(j -> j.getStatus() == Job.JobStatus.ACTIVE)
                .sorted((j1, j2) -> {
                    double match1 = SkillMatcherUtil.calculateMatchPercentage(candidateSkills, j1.getRequiredSkills());
                    double match2 = SkillMatcherUtil.calculateMatchPercentage(candidateSkills, j2.getRequiredSkills());
                    return Double.compare(match2, match1);
                })
                .limit(limit <= 0 ? 5 : limit)
                .map(this::mapToJobResponseDTO)
                .collect(Collectors.toList());
    }

    private boolean filterByCriteria(Job job, JobSearchCriteria criteria) {
        if (criteria == null) return true;

        if (criteria.getQuery() != null && !criteria.getQuery().isBlank()) {
            String q = criteria.getQuery().toLowerCase();
            boolean titleMatch = job.getTitle() != null && job.getTitle().toLowerCase().contains(q);
            boolean descMatch = job.getDescription() != null && job.getDescription().toLowerCase().contains(q);
            if (!titleMatch && !descMatch) return false;
        }

        if (criteria.getLocation() != null && !criteria.getLocation().isBlank()) {
            if (job.getLocation() == null || !job.getLocation().toLowerCase().contains(criteria.getLocation().toLowerCase())) {
                return false;
            }
        }

        if (criteria.getRemoteOnly() != null && criteria.getRemoteOnly()) {
            if (job.getRemote() == null || !job.getRemote()) return false;
        }

        if (criteria.getSalaryMin() != null) {
            if (job.getSalaryMax() != null && job.getSalaryMax() < criteria.getSalaryMin()) return false;
        }

        return true;
    }

    private JobResponseDTO mapToJobResponseDTO(Job job) {
        JobResponseDTO dto = new JobResponseDTO();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setDepartment(job.getDepartment());
        dto.setLocation(job.getLocation());
        dto.setJobType(job.getJobType());
        dto.setExperienceLevel(job.getExperienceLevel());
        dto.setRemote(job.getRemote());
        dto.setSalaryMin(job.getSalaryMin());
        dto.setSalaryMax(job.getSalaryMax());
        dto.setCurrency(job.getCurrency());
        dto.setStatus(job.getStatus() != null ? job.getStatus().name() : "ACTIVE");
        dto.setPostedAt(job.getPostedAt());
        dto.setViewsCount(job.getViewsCount());
        dto.setApplicationsCount(job.getApplicationsCount());
        dto.setRequirements(job.getRequirements());
        dto.setRequiredSkills(job.getRequiredSkills());

        if (job.getOrganization() != null) {
            dto.setOrganizationId(job.getOrganization().getId());
            dto.setOrganizationName(job.getOrganization().getName());
            dto.setOrganizationLogo(job.getOrganization().getLogoUrl());
        }

        if (job.getScreeningQuestions() != null) {
            dto.setScreeningQuestions(job.getScreeningQuestions().stream()
                    .map(sq -> {
                        ScreeningQuestionDto qDto = new ScreeningQuestionDto();
                        qDto.setId(sq.getId());
                        qDto.setQuestionText(sq.getQuestionText());
                        qDto.setQuestionType(sq.getQuestionType());
                        qDto.setRequired(sq.isRequired());
                        return qDto;
                    })
                    .collect(Collectors.toList()));
        }

        return dto;
    }
}
