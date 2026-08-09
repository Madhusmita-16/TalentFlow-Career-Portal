package com.talentflow.careerportal.dto;

import java.util.List;

public class ApplicationRequest {
    private Long jobId;
    private String coverNote;
    private String resumeFilePath;
    private List<ScreeningAnswerDto> answers;

    public ApplicationRequest() {}

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getCoverNote() { return coverNote; }
    public void setCoverNote(String coverNote) { this.coverNote = coverNote; }

    public String getResumeFilePath() { return resumeFilePath; }
    public void setResumeFilePath(String resumeFilePath) { this.resumeFilePath = resumeFilePath; }

    public List<ScreeningAnswerDto> getAnswers() { return answers; }
    public void setAnswers(List<ScreeningAnswerDto> answers) { this.answers = answers; }
}
