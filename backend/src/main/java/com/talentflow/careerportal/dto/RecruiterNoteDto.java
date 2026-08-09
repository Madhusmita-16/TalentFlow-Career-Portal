package com.talentflow.careerportal.dto;

import java.time.LocalDateTime;

public class RecruiterNoteDto {
    private Long id;
    private Long applicationId;
    private Long recruiterUserId;
    private String recruiterName;
    private String note;
    private LocalDateTime createdAt;

    public RecruiterNoteDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }

    public Long getRecruiterUserId() { return recruiterUserId; }
    public void setRecruiterUserId(Long recruiterUserId) { this.recruiterUserId = recruiterUserId; }

    public String getRecruiterName() { return recruiterName; }
    public void setRecruiterName(String recruiterName) { this.recruiterName = recruiterName; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
