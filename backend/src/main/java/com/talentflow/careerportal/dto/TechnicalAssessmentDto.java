package com.talentflow.careerportal.dto;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for technical coding assessments.
 */
public class TechnicalAssessmentDto {

    private Long id;
    private Long candidateId;
    private String candidateName;
    private Long jobId;
    private String jobTitle;
    private String assessmentName;
    private Integer score;
    private Integer maxScore;
    private String status;
    private Integer completionTimeMinutes;
    private String evaluatorFeedback;
    private LocalDateTime assignedAt;
    private LocalDateTime completedAt;

    public TechnicalAssessmentDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Long candidateId) {
        this.candidateId = candidateId;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getAssessmentName() {
        return assessmentName;
    }

    public void setAssessmentName(String assessmentName) {
        this.assessmentName = assessmentName;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(Integer maxScore) {
        this.maxScore = maxScore;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getCompletionTimeMinutes() {
        return completionTimeMinutes;
    }

    public void setCompletionTimeMinutes(Integer completionTimeMinutes) {
        this.completionTimeMinutes = completionTimeMinutes;
    }

    public String getEvaluatorFeedback() {
        return evaluatorFeedback;
    }

    public void setEvaluatorFeedback(String evaluatorFeedback) {
        this.evaluatorFeedback = evaluatorFeedback;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
