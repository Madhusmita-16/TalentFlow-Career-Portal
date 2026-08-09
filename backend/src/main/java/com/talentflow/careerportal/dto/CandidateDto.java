package com.talentflow.careerportal.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class CandidateDto {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String location;
    private String summary;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
    private String resumeFilename;
    private String resumeFilePath;
    private LocalDateTime resumeUploadedAt;
    private List<EducationDto> educationList;
    private List<WorkExperienceDto> workExperienceList;
    private List<String> skills;

    public CandidateDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getPortfolioUrl() { return portfolioUrl; }
    public void setPortfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; }

    public String getResumeFilename() { return resumeFilename; }
    public void setResumeFilename(String resumeFilename) { this.resumeFilename = resumeFilename; }

    public String getResumeFilePath() { return resumeFilePath; }
    public void setResumeFilePath(String resumeFilePath) { this.resumeFilePath = resumeFilePath; }

    public LocalDateTime getResumeUploadedAt() { return resumeUploadedAt; }
    public void setResumeUploadedAt(LocalDateTime resumeUploadedAt) { this.resumeUploadedAt = resumeUploadedAt; }

    public List<EducationDto> getEducationList() { return educationList; }
    public void setEducationList(List<EducationDto> educationList) { this.educationList = educationList; }

    public List<WorkExperienceDto> getWorkExperienceList() { return workExperienceList; }
    public void setWorkExperienceList(List<WorkExperienceDto> workExperienceList) { this.workExperienceList = workExperienceList; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
}
