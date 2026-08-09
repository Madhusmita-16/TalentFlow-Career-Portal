package com.talentflow.careerportal.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class JobDto {
    private Long id;
    private String title;
    private String department;
    private String location;
    private String employmentType;
    private String workMode;
    private String experienceLevel;
    private Integer salaryMin;
    private Integer salaryMax;
    private Integer openings;
    private LocalDate deadline;
    private String description;
    private String responsibilities;
    private String requirements;
    private String preferredQualifications;
    private String requiredSkills;
    private String status;
    private List<ScreeningQuestionDto> screeningQuestions;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public JobDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getEmploymentType() { return employmentType; }
    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }

    public String getWorkMode() { return workMode; }
    public void setWorkMode(String workMode) { this.workMode = workMode; }

    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }

    public Integer getSalaryMin() { return salaryMin; }
    public void setSalaryMin(Integer salaryMin) { this.salaryMin = salaryMin; }

    public Integer getSalaryMax() { return salaryMax; }
    public void setSalaryMax(Integer salaryMax) { this.salaryMax = salaryMax; }

    public Integer getOpenings() { return openings; }
    public void setOpenings(Integer openings) { this.openings = openings; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getResponsibilities() { return responsibilities; }
    public void setResponsibilities(String responsibilities) { this.responsibilities = responsibilities; }

    public String getRequirements() { return requirements; }
    public void setRequirements(String requirements) { this.requirements = requirements; }

    public String getPreferredQualifications() { return preferredQualifications; }
    public void setPreferredQualifications(String preferredQualifications) { this.preferredQualifications = preferredQualifications; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<ScreeningQuestionDto> getScreeningQuestions() { return screeningQuestions; }
    public void setScreeningQuestions(List<ScreeningQuestionDto> screeningQuestions) { this.screeningQuestions = screeningQuestions; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
