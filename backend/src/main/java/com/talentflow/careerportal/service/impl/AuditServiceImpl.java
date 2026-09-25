package com.talentflow.careerportal.service.impl;

import com.talentflow.careerportal.dto.PagedResponse;
import com.talentflow.careerportal.entity.AuditLog;
import com.talentflow.careerportal.repository.AuditLogRepository;
import com.talentflow.careerportal.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Enterprise implementation of AuditService managing audit trail persistence.
 */
@Service
@Transactional
public class AuditServiceImpl implements AuditService {

    private final AuditLogRepository auditLogRepository;

    @Autowired
    public AuditServiceImpl(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    public void logEvent(Long userId, String eventType, String description, String module) {
        logEventWithContext(userId, eventType, description, module, "127.0.0.1", "Internal API");
    }

    @Override
    public void logEventWithContext(Long userId, String eventType, String description, String module, String ipAddress, String userAgent) {
        AuditLog log = new AuditLog();
        log.setUserId(userId);
        log.setEventType(eventType);
        log.setDescription(description);
        log.setModule(module);
        log.setIpAddress(ipAddress);
        log.setUserAgent(userAgent);
        log.setTimestamp(LocalDateTime.now());

        auditLogRepository.save(log);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<AuditLog> getAuditLogs(int page, int size) {
        Pageable pageable = PageRequest.of(page < 0 ? 0 : page, size <= 0 ? 10 : size, Sort.by(Sort.Direction.DESC, "timestamp"));
        Page<AuditLog> logPage = auditLogRepository.findAll(pageable);
        return new PagedResponse<>(logPage.getContent(), logPage.getNumber(), logPage.getSize(), logPage.getTotalElements(), logPage.getTotalPages(), logPage.isLast());
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<AuditLog> getAuditLogsByUser(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page < 0 ? 0 : page, size <= 0 ? 10 : size, Sort.by(Sort.Direction.DESC, "timestamp"));
        Page<AuditLog> logPage = auditLogRepository.findByUserId(userId, pageable);
        return new PagedResponse<>(logPage.getContent(), logPage.getNumber(), logPage.getSize(), logPage.getTotalElements(), logPage.getTotalPages(), logPage.isLast());
    }
}
