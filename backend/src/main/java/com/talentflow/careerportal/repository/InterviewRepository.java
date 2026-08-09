package com.talentflow.careerportal.repository;

import com.talentflow.careerportal.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByCandidateIdOrderByScheduledDateAsc(Long candidateId);
    List<Interview> findByApplicationId(Long applicationId);
    long countByStatus(Interview.InterviewStatus status);
}
