package com.talentflow.careerportal.service.impl;

import com.talentflow.careerportal.dto.CandidateDto;
import com.talentflow.careerportal.dto.CandidateProfileDTO;
import com.talentflow.careerportal.dto.CandidateUpdateDTO;
import com.talentflow.careerportal.dto.EducationDto;
import com.talentflow.careerportal.dto.WorkExperienceDto;
import com.talentflow.careerportal.dto.PagedResponse;
import com.talentflow.careerportal.entity.Candidate;
import com.talentflow.careerportal.entity.CandidateSkill;
import com.talentflow.careerportal.entity.Education;
import com.talentflow.careerportal.entity.User;
import com.talentflow.careerportal.entity.WorkExperience;
import com.talentflow.careerportal.exception.BadRequestException;
import com.talentflow.careerportal.exception.ResourceNotFoundException;
import com.talentflow.careerportal.repository.CandidateRepository;
import com.talentflow.careerportal.repository.UserRepository;
import com.talentflow.careerportal.service.CandidateService;
import com.talentflow.careerportal.service.AuditService;
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
 * Enterprise implementation of CandidateService managing profile updates,
 * experience items, education history, resume attachments, and skill graph parsing.
 */
@Service
@Transactional
public class CandidateServiceImpl implements CandidateService {

    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    @Autowired
    public CandidateServiceImpl(CandidateRepository candidateRepository,
                                UserRepository userRepository,
                                AuditService auditService) {
        this.candidateRepository = candidateRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateProfileDTO getCandidateProfileById(Long id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "id", id));

        return mapToProfileDTO(candidate);
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateProfileDTO getCandidateProfileByUserId(Long userId) {
        Candidate candidate = candidateRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultCandidateForUser(userId));

        return mapToProfileDTO(candidate);
    }

    @Override
    public CandidateProfileDTO updateCandidateProfile(Long userId, CandidateUpdateDTO updateDto) {
        if (updateDto == null) {
            throw new BadRequestException("Update profile payload must not be null.");
        }

        Candidate candidate = candidateRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultCandidateForUser(userId));

        if (updateDto.getFullName() != null && !updateDto.getFullName().isBlank()) {
            candidate.setFullName(updateDto.getFullName().trim());
            // Also update parent User full name
            if (candidate.getUser() != null) {
                candidate.getUser().setFullName(updateDto.getFullName().trim());
                userRepository.save(candidate.getUser());
            }
        }

        if (updateDto.getHeadline() != null) {
            candidate.setHeadline(updateDto.getHeadline().trim());
        }

        if (updateDto.getLocation() != null) {
            candidate.setLocation(updateDto.getLocation().trim());
        }

        if (updateDto.getBio() != null) {
            candidate.setBio(updateDto.getBio().trim());
        }

        if (updateDto.getPhone() != null) {
            candidate.setPhone(updateDto.getPhone().trim());
        }

        if (updateDto.getWebsite() != null) {
            candidate.setWebsiteUrl(updateDto.getWebsite().trim());
        }

        if (updateDto.getGithubUrl() != null) {
            candidate.setGithubUrl(updateDto.getGithubUrl().trim());
        }

        if (updateDto.getLinkedinUrl() != null) {
            candidate.setLinkedinUrl(updateDto.getLinkedinUrl().trim());
        }

        if (updateDto.getPreferredRole() != null) {
            candidate.setPreferredRole(updateDto.getPreferredRole().trim());
        }

        if (updateDto.getExperienceYears() != null) {
            candidate.setExperienceYears(updateDto.getExperienceYears());
        }

        if (updateDto.getExpectedSalary() != null) {
            candidate.setExpectedSalary(updateDto.getExpectedSalary());
        }

        if (updateDto.getSkills() != null) {
            updateSkills(candidate, updateDto.getSkills());
        }

        int score = calculateProfileCompleteness(candidate);
        candidate.setProfileCompletionPercentage(score);

        Candidate saved = candidateRepository.save(candidate);

        auditService.logEvent(userId, "CANDIDATE_PROFILE_UPDATED", 
                "Updated candidate profile details for user: " + userId, "CANDIDATE_SERVICE");

        return mapToProfileDTO(saved);
    }

    @Override
    public CandidateProfileDTO updateAvatarUrl(Long userId, String avatarUrl) {
        Candidate candidate = candidateRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultCandidateForUser(userId));

        candidate.setAvatarUrl(avatarUrl);
        candidate.setProfileCompletionPercentage(calculateProfileCompleteness(candidate));

        Candidate saved = candidateRepository.save(candidate);

        auditService.logEvent(userId, "AVATAR_UPDATED", "Updated candidate profile picture URL.", "CANDIDATE_SERVICE");
        return mapToProfileDTO(saved);
    }

    @Override
    public CandidateProfileDTO updateBannerUrl(Long userId, String bannerUrl) {
        Candidate candidate = candidateRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultCandidateForUser(userId));

        candidate.setBannerUrl(bannerUrl);
        candidate.setProfileCompletionPercentage(calculateProfileCompleteness(candidate));

        Candidate saved = candidateRepository.save(candidate);

        auditService.logEvent(userId, "BANNER_UPDATED", "Updated candidate profile cover banner URL.", "CANDIDATE_SERVICE");
        return mapToProfileDTO(saved);
    }

    @Override
    public CandidateProfileDTO updateResume(Long userId, String resumeUrl, String fileName) {
        Candidate candidate = candidateRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultCandidateForUser(userId));

        candidate.setResumeUrl(resumeUrl);
        candidate.setResumeFileName(fileName);
        candidate.setResumeUploadedAt(LocalDateTime.now());
        candidate.setProfileCompletionPercentage(calculateProfileCompleteness(candidate));

        Candidate saved = candidateRepository.save(candidate);

        auditService.logEvent(userId, "RESUME_UPDATED", "Uploaded new resume document: " + fileName, "CANDIDATE_SERVICE");
        return mapToProfileDTO(saved);
    }

    @Override
    public CandidateProfileDTO addWorkExperience(Long userId, WorkExperienceDto dto) {
        if (dto == null || dto.getCompany() == null || dto.getPosition() == null) {
            throw new BadRequestException("Company and position title are required for work experience.");
        }

        Candidate candidate = candidateRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultCandidateForUser(userId));

        WorkExperience exp = new WorkExperience();
        exp.setCandidate(candidate);
        exp.setCompany(dto.getCompany().trim());
        exp.setPosition(dto.getPosition().trim());
        exp.setLocation(dto.getLocation() != null ? dto.getLocation().trim() : "");
        exp.setStartDate(dto.getStartDate());
        exp.setEndDate(dto.getEndDate());
        exp.setCurrent(dto.getIsCurrent() != null ? dto.getIsCurrent() : false);
        exp.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : "");

        candidate.getExperiences().add(exp);
        candidate.setProfileCompletionPercentage(calculateProfileCompleteness(candidate));

        Candidate saved = candidateRepository.save(candidate);

        auditService.logEvent(userId, "WORK_EXPERIENCE_ADDED", 
                "Added work experience: " + dto.getPosition() + " at " + dto.getCompany(), "CANDIDATE_SERVICE");

        return mapToProfileDTO(saved);
    }

    @Override
    public CandidateProfileDTO deleteWorkExperience(Long userId, Long experienceId) {
        Candidate candidate = candidateRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "userId", userId));

        candidate.getExperiences().removeIf(exp -> exp.getId() != null && exp.getId().equals(experienceId));
        candidate.setProfileCompletionPercentage(calculateProfileCompleteness(candidate));

        Candidate saved = candidateRepository.save(candidate);

        auditService.logEvent(userId, "WORK_EXPERIENCE_DELETED", "Deleted work experience entry: " + experienceId, "CANDIDATE_SERVICE");
        return mapToProfileDTO(saved);
    }

    @Override
    public CandidateProfileDTO addEducation(Long userId, EducationDto dto) {
        if (dto == null || dto.getInstitution() == null || dto.getDegree() == null) {
            throw new BadRequestException("Institution name and degree title are required for education.");
        }

        Candidate candidate = candidateRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultCandidateForUser(userId));

        Education edu = new Education();
        edu.setCandidate(candidate);
        edu.setInstitution(dto.getInstitution().trim());
        edu.setDegree(dto.getDegree().trim());
        edu.setFieldOfStudy(dto.getFieldOfStudy() != null ? dto.getFieldOfStudy().trim() : "");
        edu.setStartDate(dto.getStartDate());
        edu.setEndDate(dto.getEndDate());
        edu.setGpa(dto.getGpa() != null ? dto.getGpa() : "");

        candidate.getEducationList().add(edu);
        candidate.setProfileCompletionPercentage(calculateProfileCompleteness(candidate));

        Candidate saved = candidateRepository.save(candidate);

        auditService.logEvent(userId, "EDUCATION_ADDED", 
                "Added education record: " + dto.getDegree() + " at " + dto.getInstitution(), "CANDIDATE_SERVICE");

        return mapToProfileDTO(saved);
    }

    @Override
    public CandidateProfileDTO deleteEducation(Long userId, Long educationId) {
        Candidate candidate = candidateRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "userId", userId));

        candidate.getEducationList().removeIf(edu -> edu.getId() != null && edu.getId().equals(educationId));
        candidate.setProfileCompletionPercentage(calculateProfileCompleteness(candidate));

        Candidate saved = candidateRepository.save(candidate);

        auditService.logEvent(userId, "EDUCATION_DELETED", "Deleted education record entry: " + educationId, "CANDIDATE_SERVICE");
        return mapToProfileDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<CandidateDto> searchCandidates(String query, List<String> skills, String location, int page, int size) {
        Pageable pageable = PageRequest.of(page < 0 ? 0 : page, size <= 0 ? 10 : size, Sort.by(Sort.Direction.DESC, "profileCompletionPercentage"));

        Page<Candidate> candidatePage = candidateRepository.findAll(pageable);
        List<CandidateDto> dtos = candidatePage.getContent().stream()
                .map(this::mapToCandidateDto)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                dtos,
                candidatePage.getNumber(),
                candidatePage.getSize(),
                candidatePage.getTotalElements(),
                candidatePage.getTotalPages(),
                candidatePage.isLast()
        );
    }

    @Override
    public int calculateProfileCompleteness(Candidate candidate) {
        if (candidate == null) return 0;
        int score = 10; // Base score for registration

        if (candidate.getAvatarUrl() != null && !candidate.getAvatarUrl().isBlank()) score += 15;
        if (candidate.getHeadline() != null && !candidate.getHeadline().isBlank()) score += 15;
        if (candidate.getBio() != null && !candidate.getBio().isBlank()) score += 15;
        if (candidate.getResumeUrl() != null && !candidate.getResumeUrl().isBlank()) score += 20;
        if (candidate.getSkills() != null && !candidate.getSkills().isEmpty()) score += 15;
        if (candidate.getExperiences() != null && !candidate.getExperiences().isEmpty()) score += 10;

        return Math.min(100, score);
    }

    private Candidate createDefaultCandidateForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Candidate candidate = new Candidate();
        candidate.setUser(user);
        candidate.setFullName(user.getFullName());
        candidate.setEmail(user.getEmail());
        candidate.setHeadline("Member on Link2Career");
        candidate.setProfileCompletionPercentage(30);

        return candidateRepository.save(candidate);
    }

    private void updateSkills(Candidate candidate, List<String> skillNames) {
        candidate.getSkills().clear();
        for (String s : skillNames) {
            if (s != null && !s.isBlank()) {
                CandidateSkill skill = new CandidateSkill();
                skill.setCandidate(candidate);
                skill.setSkillName(s.trim());
                skill.setProficiencyLevel("Intermediate");
                candidate.getSkills().add(skill);
            }
        }
    }

    private CandidateProfileDTO mapToProfileDTO(Candidate candidate) {
        CandidateProfileDTO dto = new CandidateProfileDTO();
        dto.setId(candidate.getId());
        dto.setUserId(candidate.getUser() != null ? candidate.getUser().getId() : null);
        dto.setFullName(candidate.getFullName());
        dto.setEmail(candidate.getEmail());
        dto.setHeadline(candidate.getHeadline());
        dto.setLocation(candidate.getLocation());
        dto.setBio(candidate.getBio());
        dto.setPhone(candidate.getPhone());
        dto.setAvatarUrl(candidate.getAvatarUrl());
        dto.setBannerUrl(candidate.getBannerUrl());
        dto.setResumeUrl(candidate.getResumeUrl());
        dto.setResumeFileName(candidate.getResumeFileName());
        dto.setWebsite(candidate.getWebsiteUrl());
        dto.setGithubUrl(candidate.getGithubUrl());
        dto.setLinkedinUrl(candidate.getLinkedinUrl());
        dto.setPreferredRole(candidate.getPreferredRole());
        dto.setExperienceYears(candidate.getExperienceYears());
        dto.setExpectedSalary(candidate.getExpectedSalary());
        dto.setProfileCompletionPercentage(candidate.getProfileCompletionPercentage());

        if (candidate.getSkills() != null) {
            dto.setSkills(candidate.getSkills().stream()
                    .map(CandidateSkill::getSkillName)
                    .collect(Collectors.toList()));
        } else {
            dto.setSkills(Collections.emptyList());
        }

        if (candidate.getExperiences() != null) {
            dto.setExperiences(candidate.getExperiences().stream()
                    .map(this::mapToExperienceDto)
                    .collect(Collectors.toList()));
        } else {
            dto.setExperiences(Collections.emptyList());
        }

        if (candidate.getEducationList() != null) {
            dto.setEducationList(candidate.getEducationList().stream()
                    .map(this::mapToEducationDto)
                    .collect(Collectors.toList()));
        } else {
            dto.setEducationList(Collections.emptyList());
        }

        return dto;
    }

    private CandidateDto mapToCandidateDto(Candidate candidate) {
        CandidateDto dto = new CandidateDto();
        dto.setId(candidate.getId());
        dto.setFullName(candidate.getFullName());
        dto.setEmail(candidate.getEmail());
        dto.setHeadline(candidate.getHeadline());
        dto.setLocation(candidate.getLocation());
        dto.setAvatarUrl(candidate.getAvatarUrl());
        dto.setProfileCompletionPercentage(candidate.getProfileCompletionPercentage());
        if (candidate.getSkills() != null) {
            dto.setSkills(candidate.getSkills().stream()
                    .map(CandidateSkill::getSkillName)
                    .collect(Collectors.toList()));
        } else {
            dto.setSkills(Collections.emptyList());
        }
        return dto;
    }

    private WorkExperienceDto mapToExperienceDto(WorkExperience exp) {
        WorkExperienceDto dto = new WorkExperienceDto();
        dto.setId(exp.getId());
        dto.setCompany(exp.getCompany());
        dto.setPosition(exp.getPosition());
        dto.setLocation(exp.getLocation());
        dto.setStartDate(exp.getStartDate());
        dto.setEndDate(exp.getEndDate());
        dto.setIsCurrent(exp.isCurrent());
        dto.setDescription(exp.getDescription());
        return dto;
    }

    private EducationDto mapToEducationDto(Education edu) {
        EducationDto dto = new EducationDto();
        dto.setId(edu.getId());
        dto.setInstitution(edu.getInstitution());
        dto.setDegree(edu.getDegree());
        dto.setFieldOfStudy(edu.getFieldOfStudy());
        dto.setStartDate(edu.getStartDate());
        dto.setEndDate(edu.getEndDate());
        dto.setGpa(edu.getGpa());
        return dto;
    }
}

