package com.talentflow.careerportal.repository;

import com.talentflow.careerportal.entity.RecruiterNote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecruiterNoteRepository extends JpaRepository<RecruiterNote, Long> {
    List<RecruiterNote> findByApplicationIdOrderByCreatedAtDesc(Long applicationId);
}
