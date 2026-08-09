package com.talentflow.careerportal.repository;

import com.talentflow.careerportal.entity.ScreeningQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ScreeningQuestionRepository extends JpaRepository<ScreeningQuestion, Long> {
    List<ScreeningQuestion> findByJobId(Long jobId);
}
