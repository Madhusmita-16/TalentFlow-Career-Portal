package com.talentflow.careerportal.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "job_applications", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"job_id", "candidate_id"})
})
public class JobApplication {

    public enum ApplicationStatus {
        SUBMITTED, UNDER_REVIEW, SHORTLISTED, INTERVIEW, SELECTED, REJECTED, WITHDRAWN
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @Column(name = "resume_file_path")
    private String resumeFilePath;

    @Column(name = "cover_note", columnDefinition = "TEXT")
    private String coverNote;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_status", nullable = false)
    private ApplicationStatus currentStatus = ApplicationStatus.SUBMITTED;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ScreeningAnswer> answers = new ArrayList<>();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ApplicationStatusHistory> statusHistory = new ArrayList<>();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecruiterNote> recruiterNotes = new ArrayList<>();

    @Column(name = "applied_at", updatable = false)
    private LocalDateTime appliedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        appliedAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public JobApplication() {}

    public JobApplication(Job job, Candidate candidate, String resumeFilePath, String coverNote) {
        this.job = job;
        this.candidate = candidate;
        this.resumeFilePath = resumeFilePath;
        this.coverNote = coverNote;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Job getJob() { return job; }
    public void setJob(Job job) { this.job = job; }

    public Candidate getCandidate() { return candidate; }
    public void setCandidate(Candidate candidate) { this.candidate = candidate; }

    public String getResumeFilePath() { return resumeFilePath; }
    public void setResumeFilePath(String resumeFilePath) { this.resumeFilePath = resumeFilePath; }

    public String getCoverNote() { return coverNote; }
    public void setCoverNote(String coverNote) { this.coverNote = coverNote; }

    public ApplicationStatus getCurrentStatus() { return currentStatus; }
    public void setCurrentStatus(ApplicationStatus currentStatus) { this.currentStatus = currentStatus; }

    public List<ScreeningAnswer> getAnswers() { return answers; }
    public void setAnswers(List<ScreeningAnswer> answers) { this.answers = answers; }

    public List<ApplicationStatusHistory> getStatusHistory() { return statusHistory; }
    public void setStatusHistory(List<ApplicationStatusHistory> statusHistory) { this.statusHistory = statusHistory; }

    public List<RecruiterNote> getRecruiterNotes() { return recruiterNotes; }
    public void setRecruiterNotes(List<RecruiterNote> recruiterNotes) { this.recruiterNotes = recruiterNotes; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
