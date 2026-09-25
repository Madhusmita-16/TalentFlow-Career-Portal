package com.talentflow.careerportal.controller;

import com.talentflow.careerportal.dto.InterviewDto;
import com.talentflow.careerportal.service.InterviewService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * JUnit 5 test suite for InterviewController REST endpoints.
 */
@ExtendWith(MockitoExtension.class)
public class InterviewControllerTest {

    @Mock
    private InterviewService interviewService;

    @InjectMocks
    private InterviewController interviewController;

    private InterviewDto interviewDto;

    @BeforeEach
    void setUp() {
        interviewDto = new InterviewDto();
        interviewDto.setId(50L);
        interviewDto.setApplicationId(10L);
        interviewDto.setTitle("System Architecture Interview");
        interviewDto.setInterviewType("TECHNICAL");
        interviewDto.setScheduledTime(LocalDateTime.now().plusDays(3));
        interviewDto.setDurationMinutes(60);
        interviewDto.setMeetingLink("https://meet.link2career.com/room-202");
        interviewDto.setStatus("SCHEDULED");
    }

    @Test
    @DisplayName("Should schedule interview and return 200 OK")
    void scheduleInterview_Success() {
        when(interviewService.scheduleInterview(eq(1L), any(InterviewDto.class))).thenReturn(interviewDto);

        ResponseEntity<?> response = interviewController.scheduleInterview(1L, interviewDto);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(interviewService, times(1)).scheduleInterview(eq(1L), any(InterviewDto.class));
    }

    @Test
    @DisplayName("Should return candidate interviews list")
    void getCandidateInterviews_Success() {
        when(interviewService.getCandidateInterviews(5L)).thenReturn(List.of(interviewDto));

        ResponseEntity<?> response = interviewController.getCandidateInterviews(5L);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}
