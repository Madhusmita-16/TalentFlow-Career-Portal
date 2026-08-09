package com.talentflow.careerportal.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ApplicationDto {
    private Long id;
    private JobDto job;
    private CandidateDto candidate;
    private String resumeFilePath;
    private String coverNote;
    private String currentStatus;
    private List<ScreeningAnswerDto> answers;
    private List<StatusHistoryDto> statusHistory;
    private List<RecruiterNoteDto> recruiterNotes;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

    public static class StatusHistoryDto {
        private Long id;
        private String status;
        private String notes;
        private String changedByName;
        private LocalDateTime changedAt;

        public StatusHistoryDto() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }

        public String getChangedByName() { return changedByName; }
        public void setChangedByName(String changedByName) { this.changedByName = changedByName; }

        public LocalDateTime getChangedAt() { return changedAt; }
        public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }
    }

    public ApplicationDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public JobDto getJob() { return job; }
    public void setJob(JobDto job) { this.job = job; }

    public CandidateDto getCandidate() { return candidate; }
    public void setCandidate(CandidateDto candidate) { this.candidate = candidate; }

    public String getResumeFilePath() { return resumeFilePath; }
    public void setResumeFilePath(String resumeFilePath) { this.resumeFilePath = resumeFilePath; }

    public String getCoverNote() { return coverNote; }
    public void setCoverNote(String coverNote) { this.coverNote = coverNote; }

    public String getCurrentStatus() { return currentStatus; }
    public void setCurrentStatus(String currentStatus) { this.currentStatus = currentStatus; }

    public List<ScreeningAnswerDto> getAnswers() { return answers; }
    public void setAnswers(List<ScreeningAnswerDto> answers) { this.answers = answers; }

    public List<StatusHistoryDto> getStatusHistory() { return statusHistory; }
    public void setStatusHistory(List<StatusHistoryDto> statusHistory) { this.statusHistory = statusHistory; }

    public List<RecruiterNoteDto> getRecruiterNotes() { return recruiterNotes; }
    public void setRecruiterNotes(List<RecruiterNoteDto> recruiterNotes) { this.recruiterNotes = recruiterNotes; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
