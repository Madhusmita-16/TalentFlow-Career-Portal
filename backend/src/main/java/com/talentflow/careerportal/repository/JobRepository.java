package com.talentflow.careerportal.repository;

import com.talentflow.careerportal.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByStatus(Job.JobStatus status);

    @Query("SELECT j FROM Job j WHERE j.status = :status AND " +
           "(:search IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(j.requiredSkills) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:department IS NULL OR j.department = :department) AND " +
           "(:location IS NULL OR j.location = :location) AND " +
           "(:employmentType IS NULL OR j.employmentType = :employmentType) AND " +
           "(:workMode IS NULL OR j.workMode = :workMode) AND " +
           "(:minSalary IS NULL OR j.salaryMax >= :minSalary)")
    Page<Job> findFilteredJobs(
            @Param("status") Job.JobStatus status,
            @Param("search") String search,
            @Param("department") String department,
            @Param("location") String location,
            @Param("employmentType") Job.EmploymentType employmentType,
            @Param("workMode") Job.WorkMode workMode,
            @Param("minSalary") Integer minSalary,
            Pageable pageable
    );

    long countByStatus(Job.JobStatus status);
}
