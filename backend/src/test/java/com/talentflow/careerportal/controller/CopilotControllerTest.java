package com.talentflow.careerportal.controller;

import com.talentflow.careerportal.dto.CopilotMatchRequestDTO;
import com.talentflow.careerportal.dto.CopilotMatchResponseDTO;
import com.talentflow.careerportal.service.CopilotAIService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * JUnit 5 test suite for CopilotController REST endpoints.
 */
@ExtendWith(MockitoExtension.class)
public class CopilotControllerTest {

    @Mock
    private CopilotAIService copilotAIService;

    @InjectMocks
    private CopilotController copilotController;

    @Test
    @DisplayName("Should analyze candidate match and return 200 OK")
    void analyzeMatch_Success() {
        CopilotMatchRequestDTO request = new CopilotMatchRequestDTO();
        request.setCandidateSkills(List.of("Java", "Spring Boot"));
        request.setRequiredSkills(List.of("Java", "Spring Boot"));

        CopilotMatchResponseDTO responseDTO = new CopilotMatchResponseDTO();
        responseDTO.setMatchPercentage(100);

        when(copilotAIService.analyzeCandidateJobMatch(any(CopilotMatchRequestDTO.class))).thenReturn(responseDTO);

        ResponseEntity<?> response = copilotController.analyzeMatch(request);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}
