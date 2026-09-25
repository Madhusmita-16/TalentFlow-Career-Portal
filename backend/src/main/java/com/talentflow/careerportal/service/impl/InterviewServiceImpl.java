package com.talentflow.careerportal.service.impl;

import com.talentflow.careerportal.dto.InterviewDto;
import com.talentflow.careerportal.entity.Candidate;
import com.talentflow.careerportal.entity.Interview;
import com.talentflow.careerportal.entity.JobApplication;
import com.talentflow.careerportal.exception.BadRequestException;
import com.talentflow.careerportal.exception.ResourceNotFoundException;
import com.talentflow.careerportal.repository.CandidateRepository;
import com.talentflow.careerportal.repository.InterviewRepository;
import com.talentflow.careerportal.repository.JobApplicationRepository;
import com.talentflow.careerportal.service.InterviewService;
import com.talentflow.careerportal.service.NotificationService;
import com.talentflow.careerportal.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Enterprise implementation of InterviewService.
 */
@Service
@Transactional
public class InterviewServiceImpl implements InterviewService {

    private final InterviewRepository interviewRepository;
    private final JobApplicationRepository applicationRepository;
    private final CandidateRepository candidateRepository;
    private final NotificationService notificationService;
    private final AuditService auditService;

    @Autowired
    public InterviewServiceImpl(InterviewRepository interviewRepository,
                                JobApplicationRepository applicationRepository,
                                CandidateRepository candidateRepository,
                                NotificationService notificationService,
                                AuditService auditService) {
        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
        this.candidateRepository = candidateRepository;
        this.notificationService = notificationService;
        this.auditService = auditService;
    }

    @Override
    public InterviewDto scheduleInterview(Long recruiterUserId, InterviewDto dto) {
        if (dto == null || dto.getApplicationId() == null || dto.getScheduledTime() == null) {
            throw new BadRequestException("Application ID and scheduled time must be provided.");
        }

        JobApplication application = applicationRepository.findById(dto.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", dto.getApplicationId()));

        Interview interview = new Interview();
        interview.setApplication(application);
        interview.setTitle(dto.getTitle() != null ? dto.getTitle() : "Technical Interview");
        interview.setInterviewType(dto.getInterviewType() != null ? dto.getInterviewType() : "TECHNICAL");
        interview.setScheduledTime(dto.getScheduledTime());
        interview.setDurationMinutes(dto.getDurationMinutes() != null ? dto.getDurationMinutes() : 45);
        interview.setMeetingLink(dto.getMeetingLink() != null ? dto.getMeetingLink() : "https://meet.link2career.com/room-101");
        interview.setInterviewerName(dto.getInterviewerName() != null ? dto.getInterviewerName() : "Hiring Panel");
        interview.setStatus(Interview.InterviewStatus.SCHEDULED);

        Interview saved = interviewRepository.save(interview);

        // Send alert to candidate
        if (application.getCandidate() != null && application.getCandidate().getUser() != null) {
            notificationService.sendNotification(
                    application.getCandidate().getUser().getId(),
                    "Interview Scheduled!",
                    "Your interview for " + (application.getJob() != null ? application.getJob().getTitle() : "position") + " is scheduled on " + dto.getScheduledTime(),
                    "INTERVIEW_INVITE"
            );
        }

        auditService.logEvent(recruiterUserId, "INTERVIEW_SCHEDULED", "Scheduled interview ID: " + saved.getId(), "INTERVIEW_SERVICE");
        return mapToDto(saved);
    }

    @Override
    public InterviewDto updateInterview(Long recruiterUserId, Long interviewId, InterviewDto dto) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview", "id", interviewId));

        if (dto.getTitle() != null) interview.setTitle(dto.getTitle());
        if (dto.getScheduledTime() != null) interview.setScheduledTime(dto.getScheduledTime());
        if (dto.getMeetingLink() != null) interview.setMeetingLink(dto.getMeetingLink());
        if (dto.getStatus() != null) {
            try {
                interview.setStatus(Interview.InterviewStatus.valueOf(dto.getStatus().toUpperCase().trim()));
            } catch (Exception e) {}
        }

        Interview updated = interviewRepository.save(interview);
        auditService.logEvent(recruiterUserId, "INTERVIEW_UPDATED", "Updated interview ID: " + interviewId, "INTERVIEW_SERVICE");
        return mapToDto(updated);
    }

    @Override
    public InterviewDto submitInterviewFeedback(Long interviewerUserId, Long interviewId, String feedback, Integer rating) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview", "id", interviewId));

        interview.setFeedbackNotes(feedback);
        interview.setRating(rating);
        interview.setStatus(Interview.InterviewStatus.COMPLETED);

        Interview saved = interviewRepository.save(interview);
        auditService.logEvent(interviewerUserId, "INTERVIEW_FEEDBACK_SUBMITTED", "Submitted feedback for interview ID: " + interviewId, "INTERVIEW_SERVICE");
        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InterviewDto> getCandidateInterviews(Long candidateUserId) {
        Candidate candidate = candidateRepository.findByUserId(candidateUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "userId", candidateUserId));

        List<Interview> interviews = interviewRepository.findByCandidateId(candidate.getId());
        return interviews.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InterviewDto> getApplicationInterviews(Long applicationId) {
        List<Interview> interviews = interviewRepository.findByApplicationId(applicationId);
        return interviews.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private InterviewDto mapToDto(Interview interview) {
        InterviewDto dto = new InterviewDto();
        dto.setId(interview.getId());
        dto.setApplicationId(interview.getApplication() != null ? interview.getApplication().getId() : null);
        dto.setTitle(interview.getTitle());
        dto.setInterviewType(interview.getInterviewType());
        dto.setScheduledTime(interview.getScheduledTime());
        dto.setDurationMinutes(interview.getDurationMinutes());
        dto.setMeetingLink(interview.getMeetingLink());
        dto.setInterviewerName(interview.getInterviewerName());
        dto.setFeedbackNotes(interview.getFeedbackNotes());
        dto.setRating(interview.getRating());
        dto.setStatus(interview.getStatus() != null ? interview.getStatus().name() : "SCHEDULED");
        return dto;
    }
}
