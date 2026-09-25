package com.talentflow.careerportal.repository;

import com.talentflow.careerportal.entity.SkillEndorsement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillEndorsementRepository extends JpaRepository<SkillEndorsement, Long> {
    List<SkillEndorsement> findByCandidateId(Long candidateId);
    List<SkillEndorsement> findByCandidateIdAndSkillName(Long candidateId, String skillName);
}
