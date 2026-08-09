package com.talentflow.careerportal.repository;

import com.talentflow.careerportal.entity.Candidate;
import com.talentflow.careerportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    Optional<Candidate> findByUser(User user);
    Optional<Candidate> findByUserId(Long userId);
}
