package com.talentflow.careerportal.service;

import com.talentflow.careerportal.dto.SkillEndorsementDto;

import java.util.List;

/**
 * Service interface for candidate peer skill endorsements.
 */
public interface SkillEndorsementService {

    /**
     * Endorses a candidate skill.
     *
     * @param candidateId Target Candidate ID.
     * @param skillName Skill string name.
     * @param endorserName Name of endorser peer.
     * @param endorserTitle Title of endorser.
     * @return SkillEndorsementDto created payload.
     */
    SkillEndorsementDto endorseSkill(Long candidateId, String skillName, String endorserName, String endorserTitle);

    /**
     * Retrieves all endorsements for candidate.
     *
     * @param candidateId Candidate ID.
     * @return List of SkillEndorsementDto.
     */
    List<SkillEndorsementDto> getEndorsementsForCandidate(Long candidateId);
}
