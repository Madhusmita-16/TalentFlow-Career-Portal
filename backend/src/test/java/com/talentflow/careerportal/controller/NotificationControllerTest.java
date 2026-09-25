package com.talentflow.careerportal.controller;

import com.talentflow.careerportal.dto.NotificationDto;
import com.talentflow.careerportal.dto.PagedResponse;
import com.talentflow.careerportal.service.NotificationService;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * JUnit 5 test suite for NotificationController REST endpoints.
 */
@ExtendWith(MockitoExtension.class)
public class NotificationControllerTest {

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private NotificationController notificationController;

    private NotificationDto notificationDto;

    @BeforeEach
    void setUp() {
        notificationDto = new NotificationDto();
        notificationDto.setId(10L);
        notificationDto.setTitle("Application Status Update");
        notificationDto.setMessage("Your application status changed to IN_REVIEW.");
        notificationDto.setType("APPLICATION_UPDATE");
        notificationDto.setRead(false);
        notificationDto.setCreatedAt(LocalDateTime.now());
    }

    @Test
    @DisplayName("Should return user notifications paged response")
    void getUserNotifications_Success() {
        PagedResponse<NotificationDto> pagedResponse = new PagedResponse<>(
                List.of(notificationDto), 0, 10, 1, 1, true
        );

        when(notificationService.getUserNotifications(eq(1L), eq(false), eq(0), eq(10)))
                .thenReturn(pagedResponse);

        ResponseEntity<?> response = notificationController.getUserNotifications(1L, false, 0, 10);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @DisplayName("Should return unread notifications count")
    void getUnreadCount_Success() {
        when(notificationService.countUnreadNotifications(1L)).thenReturn(3L);

        ResponseEntity<?> response = notificationController.getUnreadCount(1L);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}
