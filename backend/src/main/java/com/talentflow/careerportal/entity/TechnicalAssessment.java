package com.talentflow.careerportal.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing technical coding assessment tests, scores, and candidate evaluations.
 */
@Entity
@Table(name = "technical_assessments")
public class TechnicalAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(name = "assessment_name", nullable = false)
    private String assessmentName;

    @Column(name = "score")
    private Integer score;

    @Column(name = "max_score")
    private Integer maxScore = 100;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private AssessmentStatus status = AssessmentStatus.PENDING;

    @Column(name = "completion_time_minutes")
    private Integer completionTimeMinutes;

    @Column(name = "evaluator_feedback", length = 2000)
    private String evaluatorFeedback;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt = LocalDateTime.now();

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public enum AssessmentStatus {
        PENDING,
        IN_PROGRESS,
        PASSED,
        FAILED,
        EXPIRED
    }

    public TechnicalAssessment() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Candidate getCandidate() {
        return candidate;
    }

    public void setCandidate(Candidate candidate) {
        this.candidate = candidate;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
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

    public AssessmentStatus getStatus() {
        return status;
    }

    public void setStatus(AssessmentStatus status) {
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
