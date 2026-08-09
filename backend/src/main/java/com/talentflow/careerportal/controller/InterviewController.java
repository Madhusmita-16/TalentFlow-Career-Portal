package com.talentflow.careerportal.controller;

import com.talentflow.careerportal.dto.InterviewDto;
import com.talentflow.careerportal.entity.*;
import com.talentflow.careerportal.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewRepository interviewRepository;
    private final JobApplicationRepository applicationRepository;
    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public InterviewController(InterviewRepository interviewRepository, JobApplicationRepository applicationRepository,
                               CandidateRepository candidateRepository, UserRepository userRepository,
                               NotificationRepository notificationRepository) {
        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
        this.candidateRepository = candidateRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public ResponseEntity<?> getInterviews(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);

        List<Interview> interviews;
        if (user != null && user.getRole() == User.Role.CANDIDATE) {
            Candidate c = candidateRepository.findByUser(user).orElse(null);
            if (c == null) return ResponseEntity.ok(List.of());
            interviews = interviewRepository.findByCandidateIdOrderByScheduledDateAsc(c.getId());
        } else {
            interviews = interviewRepository.findAll();
        }

        return ResponseEntity.ok(interviews.stream().map(this::convertToDto).collect(Collectors.toList()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER')")
    public ResponseEntity<?> scheduleInterview(@RequestBody InterviewDto dto) {
        JobApplication app = applicationRepository.findById(dto.getApplicationId())
                .orElseThrow(() -> new RuntimeException("Application not found"));

        Interview interview = new Interview();
        interview.setApplication(app);
        interview.setCandidate(app.getCandidate());
        interview.setJob(app.getJob());
        interview.setInterviewType(dto.getInterviewType() != null ? dto.getInterviewType() : "Technical Interview");
        interview.setScheduledDate(dto.getScheduledDate());
        interview.setTimeSlot(dto.getTimeSlot());
        interview.setMeetingLink(dto.getMeetingLink());
        interview.setInterviewerName(dto.getInterviewerName());
        interview.setRecruiterNotes(dto.getRecruiterNotes());
        interview.setStatus(Interview.InterviewStatus.SCHEDULED);

        // Auto update application status to INTERVIEW if not already
        app.setCurrentStatus(JobApplication.ApplicationStatus.INTERVIEW);
        applicationRepository.save(app);

        Interview saved = interviewRepository.save(interview);

        // Send Candidate Notification
        Notification notification = new Notification(
                app.getCandidate().getUser(),
                "Interview Scheduled: " + app.getJob().getTitle(),
                "Your " + saved.getInterviewType() + " is scheduled for " + saved.getScheduledDate() + " (" + saved.getTimeSlot() + ").",
                "INTERVIEW_SCHEDULED",
                "/candidate/applications"
        );
        notificationRepository.save(notification);

        return ResponseEntity.ok(convertToDto(saved));
    }

    private InterviewDto convertToDto(Interview i) {
        InterviewDto dto = new InterviewDto();
        dto.setId(i.getId());
        dto.setApplicationId(i.getApplication().getId());
        dto.setCandidateId(i.getCandidate().getId());
        dto.setCandidateName(i.getCandidate().getUser().getFullName());
        dto.setCandidateEmail(i.getCandidate().getUser().getEmail());
        dto.setJobId(i.getJob().getId());
        dto.setJobTitle(i.getJob().getTitle());
        dto.setInterviewType(i.getInterviewType());
        dto.setScheduledDate(i.getScheduledDate());
        dto.setTimeSlot(i.getTimeSlot());
        dto.setMeetingLink(i.getMeetingLink());
        dto.setInterviewerName(i.getInterviewerName());
        dto.setRecruiterNotes(i.getRecruiterNotes());
        dto.setStatus(i.getStatus().name());
        dto.setCreatedAt(i.getCreatedAt());
        return dto;
    }
}
