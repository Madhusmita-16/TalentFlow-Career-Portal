package com.talentflow.careerportal.dto;

import java.time.LocalDateTime;
import java.util.List;

public class CandidateProfileDTO {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String location;
    private String headline;
    private String summary;
    private String avatarUrl;
    private String bannerUrl;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
    private String resumeFilename;
    private String resumeFilePath;
    private LocalDateTime resumeUploadedAt;
    private Boolean openToWork;
    private Integer connectionsCount;
    private Integer profileViewsCount;
    private List<String> skills;

    public CandidateProfileDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getBannerUrl() {
        return bannerUrl;
    }

    public void setBannerUrl(String bannerUrl) {
        this.bannerUrl = bannerUrl;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getPortfolioUrl() {
        return portfolioUrl;
    }

    public void setPortfolioUrl(String portfolioUrl) {
        this.portfolioUrl = portfolioUrl;
    }

    public String getResumeFilename() {
        return resumeFilename;
    }

    public void setResumeFilename(String resumeFilename) {
        this.resumeFilename = resumeFilename;
    }

    public String getResumeFilePath() {
        return resumeFilePath;
    }

    public void setResumeFilePath(String resumeFilePath) {
        this.resumeFilePath = resumeFilePath;
    }

    public LocalDateTime getResumeUploadedAt() {
        return resumeUploadedAt;
    }

    public void setResumeUploadedAt(LocalDateTime resumeUploadedAt) {
        this.resumeUploadedAt = resumeUploadedAt;
    }

    public Boolean getOpenToWork() {
        return openToWork;
    }

    public void setOpenToWork(Boolean openToWork) {
        this.openToWork = openToWork;
    }

    public Integer getConnectionsCount() {
        return connectionsCount;
    }

    public void setConnectionsCount(Integer connectionsCount) {
        this.connectionsCount = connectionsCount;
    }

    public Integer getProfileViewsCount() {
        return profileViewsCount;
    }

    public void setProfileViewsCount(Integer profileViewsCount) {
        this.profileViewsCount = profileViewsCount;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }
}
