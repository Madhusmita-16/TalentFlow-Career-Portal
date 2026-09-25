package com.talentflow.careerportal.controller;

import com.talentflow.careerportal.service.FileStorageService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * JUnit 5 test suite for FileStorageController REST endpoints.
 */
@ExtendWith(MockitoExtension.class)
public class FileStorageControllerTest {

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private FileStorageController fileStorageController;

    @Test
    @DisplayName("Should upload resume file and return 200 OK with file URL")
    void uploadResume_Success() {
        MockMultipartFile mockFile = new MockMultipartFile(
                "file", "resume.pdf", "application/pdf", "Dummy Resume Data".getBytes());

        when(fileStorageService.storeResumeFile(any(), eq(1L))).thenReturn("/uploads/resumes/resume.pdf");

        ResponseEntity<?> response = fileStorageController.uploadResume(mockFile, 1L);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(fileStorageService, times(1)).storeResumeFile(any(), eq(1L));
    }
}
