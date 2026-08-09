package com.talentflow.careerportal.controller;

import com.talentflow.careerportal.dto.JobDto;
import com.talentflow.careerportal.dto.ScreeningQuestionDto;
import com.talentflow.careerportal.entity.Job;
import com.talentflow.careerportal.repository.JobRepository;
import com.talentflow.careerportal.repository.ScreeningQuestionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobRepository jobRepository;
    private final ScreeningQuestionRepository screeningQuestionRepository;

    public JobController(JobRepository jobRepository, ScreeningQuestionRepository screeningQuestionRepository) {
        this.jobRepository = jobRepository;
        this.screeningQuestionRepository = screeningQuestionRepository;
    }

    @GetMapping
    public ResponseEntity<?> getJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String employmentType,
            @RequestParam(required = false) String workMode,
            @RequestParam(required = false) Integer minSalary,
            @RequestParam(defaultValue = "recent") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        if ("salaryHigh".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "salaryMax");
        } else if ("salaryLow".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "salaryMin");
        } else if ("title".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "title");
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        Job.EmploymentType empTypeEnum = null;
        if (employmentType != null && !employmentType.isBlank()) {
            try { empTypeEnum = Job.EmploymentType.valueOf(employmentType.toUpperCase()); } catch (Exception ignored) {}
        }

        Job.WorkMode workModeEnum = null;
        if (workMode != null && !workMode.isBlank()) {
            try { workModeEnum = Job.WorkMode.valueOf(workMode.toUpperCase()); } catch (Exception ignored) {}
        }

        Page<Job> jobPage = jobRepository.findFilteredJobs(
                Job.JobStatus.PUBLISHED,
                (search != null && !search.isBlank()) ? search.trim() : null,
                (department != null && !department.isBlank() && !"ALL".equalsIgnoreCase(department)) ? department.trim() : null,
                (location != null && !location.isBlank() && !"ALL".equalsIgnoreCase(location)) ? location.trim() : null,
                empTypeEnum,
                workModeEnum,
                minSalary,
                pageable
        );

        Map<String, Object> response = new HashMap<>();
        response.put("jobs", jobPage.getContent().stream().map(this::convertToDto).collect(Collectors.toList()));
        response.put("currentPage", jobPage.getNumber());
        response.put("totalItems", jobPage.getTotalElements());
        response.put("totalPages", jobPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));

        return ResponseEntity.ok(convertToDto(job));
    }

    private JobDto convertToDto(Job job) {
        JobDto dto = new JobDto();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDepartment(job.getDepartment());
        dto.setLocation(job.getLocation());
        dto.setEmploymentType(job.getEmploymentType().name());
        dto.setWorkMode(job.getWorkMode().name());
        dto.setExperienceLevel(job.getExperienceLevel());
        dto.setSalaryMin(job.getSalaryMin());
        dto.setSalaryMax(job.getSalaryMax());
        dto.setOpenings(job.getOpenings());
        dto.setDeadline(job.getDeadline());
        dto.setDescription(job.getDescription());
        dto.setResponsibilities(job.getResponsibilities());
        dto.setRequirements(job.getRequirements());
        dto.setPreferredQualifications(job.getPreferredQualifications());
        dto.setRequiredSkills(job.getRequiredSkills());
        dto.setStatus(job.getStatus().name());
        dto.setCreatedAt(job.getCreatedAt());
        dto.setUpdatedAt(job.getUpdatedAt());

        if (job.getScreeningQuestions() != null) {
            dto.setScreeningQuestions(job.getScreeningQuestions().stream().map(q -> {
                ScreeningQuestionDto sqDto = new ScreeningQuestionDto();
                sqDto.setId(q.getId());
                sqDto.setQuestionText(q.getQuestionText());
                sqDto.setQuestionType(q.getQuestionType().name());
                sqDto.setOptionsJson(q.getOptionsJson());
                sqDto.setRequired(q.isRequired());
                return sqDto;
            }).collect(Collectors.toList()));
        }

        return dto;
    }
}
