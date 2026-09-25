package com.talentflow.careerportal.dto;

import java.util.List;

public class CopilotMatchRequestDTO {
    private Long candidateId;
    private Long jobId;
    private List<String> candidateSkills;
    private String jobRequiredSkills;

    public CopilotMatchRequestDTO() {
    }

    public Long getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Long candidateId) {
        this.candidateId = candidateId;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public List<String> getCandidateSkills() {
        return candidateSkills;
    }

    public void setCandidateSkills(List<String> candidateSkills) {
        this.candidateSkills = candidateSkills;
    }

    public String getJobRequiredSkills() {
        return jobRequiredSkills;
    }

    public void setJobRequiredSkills(String jobRequiredSkills) {
        this.jobRequiredSkills = jobRequiredSkills;
    }
}
