package com.talentflow.careerportal.dto;

import jakarta.validation.constraints.NotNull;

public class ApplicationSubmitDTO {

    @NotNull(message = "Job ID is required")
    private Long jobId;

    private String coverNote;
    private String resumeFilePath;

    public ApplicationSubmitDTO() {
    }

    public ApplicationSubmitDTO(Long jobId, String coverNote, String resumeFilePath) {
        this.jobId = jobId;
        this.coverNote = coverNote;
        this.resumeFilePath = resumeFilePath;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getCoverNote() {
        return coverNote;
    }

    public void setCoverNote(String coverNote) {
        this.coverNote = coverNote;
    }

    public String getResumeFilePath() {
        return resumeFilePath;
    }

    public void setResumeFilePath(String resumeFilePath) {
        this.resumeFilePath = resumeFilePath;
    }
}
