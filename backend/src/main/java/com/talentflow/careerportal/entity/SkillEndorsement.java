package com.talentflow.careerportal.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing candidate skill peer endorsements on Link2Career platform.
 */
@Entity
@Table(name = "skill_endorsements")
public class SkillEndorsement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @Column(name = "skill_name", nullable = false)
    private String skillName;

    @Column(name = "endorser_name", nullable = false)
    private String endorserName;

    @Column(name = "endorser_title")
    private String endorserTitle;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public SkillEndorsement() {
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

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public String getEndorserName() {
        return endorserName;
    }

    public void setEndorserName(String endorserName) {
        this.endorserName = endorserName;
    }

    public String getEndorserTitle() {
        return endorserTitle;
    }

    public void setEndorserTitle(String endorserTitle) {
        this.endorserTitle = endorserTitle;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
