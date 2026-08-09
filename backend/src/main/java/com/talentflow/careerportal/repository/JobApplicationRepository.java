package com.talentflow.careerportal.repository;

import com.talentflow.careerportal.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByCandidateIdOrderByAppliedAtDesc(Long candidateId);

    Optional<JobApplication> findByJobIdAndCandidateId(Long jobId, Long candidateId);

    boolean existsByJobIdAndCandidateId(Long jobId, Long candidateId);

    long countByCurrentStatus(JobApplication.ApplicationStatus status);

    List<JobApplication> findByJobId(Long jobId);
}
