package com.talentflow.careerportal.service;

import com.talentflow.careerportal.dto.NotificationDto;
import com.talentflow.careerportal.entity.Notification;
import com.talentflow.careerportal.entity.User;
import com.talentflow.careerportal.repository.NotificationRepository;
import com.talentflow.careerportal.repository.UserRepository;
import com.talentflow.careerportal.service.impl.NotificationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * JUnit 5 test suite for NotificationServiceImpl.
 */
@ExtendWith(MockitoExtension.class)
public class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private NotificationServiceImpl notificationService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("candidate@example.com");
    }

    @Test
    @DisplayName("Should send notification and return NotificationDto")
    void sendNotification_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(notificationRepository.save(any(Notification.class))).thenAnswer(i -> {
            Notification n = i.getArgument(0);
            n.setId(99L);
            return n;
        });

        NotificationDto notif = notificationService.sendNotification(1L, "Interview Alert", "Your interview is set.", "INTERVIEW");

        assertNotNull(notif);
        assertEquals(99L, notif.getId());
        assertEquals("Interview Alert", notif.getTitle());
    }
}
