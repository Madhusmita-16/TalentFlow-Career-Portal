package com.talentflow.careerportal.controller;

import com.talentflow.careerportal.dto.CandidateDto;
import com.talentflow.careerportal.dto.EducationDto;
import com.talentflow.careerportal.dto.WorkExperienceDto;
import com.talentflow.careerportal.entity.*;
import com.talentflow.careerportal.repository.CandidateRepository;
import com.talentflow.careerportal.repository.UserRepository;
import com.talentflow.careerportal.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public CandidateController(CandidateRepository candidateRepository, UserRepository userRepository, FileStorageService fileStorageService) {
        this.candidateRepository = candidateRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyCandidateProfile(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Candidate candidate = candidateRepository.findByUser(user)
                .orElseGet(() -> candidateRepository.save(new Candidate(user)));

        return ResponseEntity.ok(convertToDto(candidate));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateCandidateProfile(@RequestBody CandidateDto request, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Candidate candidate = candidateRepository.findByUser(user)
                .orElseGet(() -> new Candidate(user));

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
            userRepository.save(user);
        }

        candidate.setLocation(request.getLocation());
        candidate.setSummary(request.getSummary());
        candidate.setLinkedinUrl(request.getLinkedinUrl());
        candidate.setGithubUrl(request.getGithubUrl());
        candidate.setPortfolioUrl(request.getPortfolioUrl());

        // Update Education List
        candidate.getEducationList().clear();
        if (request.getEducationList() != null) {
            for (EducationDto eduDto : request.getEducationList()) {
                Education edu = new Education(candidate, eduDto.getInstitution(), eduDto.getDegree(),
                        eduDto.getFieldOfStudy(), eduDto.getStartYear(), eduDto.getEndYear(), eduDto.getGrade());
                candidate.getEducationList().add(edu);
            }
        }

        // Update Work Experience List
        candidate.getWorkExperienceList().clear();
        if (request.getWorkExperienceList() != null) {
            for (WorkExperienceDto expDto : request.getWorkExperienceList()) {
                WorkExperience exp = new WorkExperience(candidate, expDto.getCompany(), expDto.getPosition(),
                        expDto.getStartDate(), expDto.getEndDate(), expDto.isCurrentlyWorking(), expDto.getResponsibilities());
                candidate.getWorkExperienceList().add(exp);
            }
        }

        // Update Skills List
        candidate.getSkills().clear();
        if (request.getSkills() != null) {
            for (String skillName : request.getSkills()) {
                if (skillName != null && !skillName.isBlank()) {
                    candidate.getSkills().add(new CandidateSkill(candidate, skillName.trim()));
                }
            }
        }

        Candidate saved = candidateRepository.save(candidate);
        return ResponseEntity.ok(convertToDto(saved));
    }

    @PostMapping("/resume")
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Candidate candidate = candidateRepository.findByUser(user)
                .orElseGet(() -> new Candidate(user));

        String filePath = fileStorageService.storeFile(file);
        candidate.setResumeFilename(file.getOriginalFilename());
        candidate.setResumeFilePath(filePath);
        candidate.setResumeUploadedAt(LocalDateTime.now());

        Candidate saved = candidateRepository.save(candidate);
        return ResponseEntity.ok(Map.of(
                "message", "Resume uploaded successfully",
                "filename", saved.getResumeFilename(),
                "filePath", saved.getResumeFilePath()
        ));
    }

    private CandidateDto convertToDto(Candidate c) {
        CandidateDto dto = new CandidateDto();
        dto.setId(c.getId());
        dto.setUserId(c.getUser().getId());
        dto.setFullName(c.getUser().getFullName());
        dto.setEmail(c.getUser().getEmail());
        dto.setPhone(c.getUser().getPhone() != null ? c.getUser().getPhone() : "");
        dto.setLocation(c.getLocation());
        dto.setSummary(c.getSummary());
        dto.setLinkedinUrl(c.getLinkedinUrl());
        dto.setGithubUrl(c.getGithubUrl());
        dto.setPortfolioUrl(c.getPortfolioUrl());
        dto.setResumeFilename(c.getResumeFilename());
        dto.setResumeFilePath(c.getResumeFilePath());
        dto.setResumeUploadedAt(c.getResumeUploadedAt());

        if (c.getEducationList() != null) {
            dto.setEducationList(c.getEducationList().stream().map(e -> {
                EducationDto ed = new EducationDto();
                ed.setId(e.getId());
                ed.setInstitution(e.getInstitution());
                ed.setDegree(e.getDegree());
                ed.setFieldOfStudy(e.getFieldOfStudy());
                ed.setStartYear(e.getStartYear());
                ed.setEndYear(e.getEndYear());
                ed.setGrade(e.getGrade());
                return ed;
            }).collect(Collectors.toList()));
        }

        if (c.getWorkExperienceList() != null) {
            dto.setWorkExperienceList(c.getWorkExperienceList().stream().map(w -> {
                WorkExperienceDto wd = new WorkExperienceDto();
                wd.setId(w.getId());
                wd.setCompany(w.getCompany());
                wd.setPosition(w.getPosition());
                wd.setStartDate(w.getStartDate());
                wd.setEndDate(w.getEndDate());
                wd.setCurrentlyWorking(w.isCurrentlyWorking());
                wd.setResponsibilities(w.getResponsibilities());
                return wd;
            }).collect(Collectors.toList()));
        }

        if (c.getSkills() != null) {
            dto.setSkills(c.getSkills().stream().map(CandidateSkill::getSkillName).collect(Collectors.toList()));
        }

        return dto;
    }
}
