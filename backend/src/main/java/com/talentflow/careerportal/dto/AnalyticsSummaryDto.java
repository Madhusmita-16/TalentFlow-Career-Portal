package com.talentflow.careerportal.dto;

import java.util.Map;

/**
 * Enterprise Data Transfer Object capturing platform analytics, candidate metrics,
 * job posting statistics, application conversion rates, and recruitment trends.
 */
public class AnalyticsSummaryDto {

    private long totalCandidates;
    private long totalJobsPosted;
    private long totalApplications;
    private double averageAtsScore;
    private double applicationConversionRate;
    private Map<String, Long> applicationsByStatus;
    private Map<String, Long> topSkillsDemand;
    private Map<String, Long> jobsByDepartment;

    public AnalyticsSummaryDto() {
    }

    public long getTotalCandidates() {
        return totalCandidates;
    }

    public void setTotalCandidates(long totalCandidates) {
        this.totalCandidates = totalCandidates;
    }

    public long getTotalJobsPosted() {
        return totalJobsPosted;
    }

    public void setTotalJobsPosted(long totalJobsPosted) {
        this.totalJobsPosted = totalJobsPosted;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public double getAverageAtsScore() {
        return averageAtsScore;
    }

    public void setAverageAtsScore(double averageAtsScore) {
        this.averageAtsScore = averageAtsScore;
    }

    public double getApplicationConversionRate() {
        return applicationConversionRate;
    }

    public void setApplicationConversionRate(double applicationConversionRate) {
        this.applicationConversionRate = applicationConversionRate;
    }

    public Map<String, Long> getApplicationsByStatus() {
        return applicationsByStatus;
    }

    public void setApplicationsByStatus(Map<String, Long> applicationsByStatus) {
        this.applicationsByStatus = applicationsByStatus;
    }

    public Map<String, Long> getTopSkillsDemand() {
        return topSkillsDemand;
    }

    public void setTopSkillsDemand(Map<String, Long> topSkillsDemand) {
        this.topSkillsDemand = topSkillsDemand;
    }

    public Map<String, Long> getJobsByDepartment() {
        return jobsByDepartment;
    }

    public void setJobsByDepartment(Map<String, Long> jobsByDepartment) {
        this.jobsByDepartment = jobsByDepartment;
    }
}
