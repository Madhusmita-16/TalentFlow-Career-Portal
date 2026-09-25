package com.talentflow.careerportal.service;

import com.talentflow.careerportal.entity.AuditLog;
import com.talentflow.careerportal.repository.AuditLogRepository;
import com.talentflow.careerportal.service.impl.AuditServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * JUnit 5 test suite for AuditServiceImpl event logging.
 */
@ExtendWith(MockitoExtension.class)
public class AuditServiceTest {

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private AuditServiceImpl auditService;

    @Test
    @DisplayName("Should save audit log entity when logging system event")
    void logEvent_Success() {
        auditService.logEvent(1L, "TEST_EVENT", "Testing event persistence", "TEST_MODULE");

        verify(auditLogRepository, times(1)).save(any(AuditLog.class));
    }
}
