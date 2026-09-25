package com.talentflow.careerportal.dto;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for candidate skill peer endorsements.
 */
public class SkillEndorsementDto {

    private Long id;
    private Long candidateId;
    private String skillName;
    private String endorserName;
    private String endorserTitle;
    private LocalDateTime createdAt;

    public SkillEndorsementDto() {
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
