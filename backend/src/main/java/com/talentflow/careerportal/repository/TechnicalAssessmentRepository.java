package com.talentflow.careerportal.repository;

import com.talentflow.careerportal.entity.TechnicalAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TechnicalAssessmentRepository extends JpaRepository<TechnicalAssessment, Long> {
    List<TechnicalAssessment> findByCandidateId(Long candidateId);
    List<TechnicalAssessment> findByJobId(Long jobId);
}
