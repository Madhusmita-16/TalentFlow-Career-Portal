package com.talentflow.careerportal.dto;

import java.util.Map;

public class AdminDashboardDto {
    private long totalJobs;
    private long activeJobs;
    private long totalApplications;
    private long newApplications;
    private long totalCandidates;
    private long scheduledInterviews;
    private long selectedCandidates;

    private Map<String, Long> applicationsByDepartment;
    private Map<String, Long> applicationStatusDistribution;

    public AdminDashboardDto() {}

    public long getTotalJobs() { return totalJobs; }
    public void setTotalJobs(long totalJobs) { this.totalJobs = totalJobs; }

    public long getActiveJobs() { return activeJobs; }
    public void setActiveJobs(long activeJobs) { this.activeJobs = activeJobs; }

    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }

    public long getNewApplications() { return newApplications; }
    public void setNewApplications(long newApplications) { this.newApplications = newApplications; }

    public long getTotalCandidates() { return totalCandidates; }
    public void setTotalCandidates(long totalCandidates) { this.totalCandidates = totalCandidates; }

    public long getScheduledInterviews() { return scheduledInterviews; }
    public void setScheduledInterviews(long scheduledInterviews) { this.scheduledInterviews = scheduledInterviews; }

    public long getSelectedCandidates() { return selectedCandidates; }
    public void setSelectedCandidates(long selectedCandidates) { this.selectedCandidates = selectedCandidates; }

    public Map<String, Long> getApplicationsByDepartment() { return applicationsByDepartment; }
    public void setApplicationsByDepartment(Map<String, Long> applicationsByDepartment) { this.applicationsByDepartment = applicationsByDepartment; }

    public Map<String, Long> getApplicationStatusDistribution() { return applicationStatusDistribution; }
    public void setApplicationStatusDistribution(Map<String, Long> applicationStatusDistribution) { this.applicationStatusDistribution = applicationStatusDistribution; }
}
