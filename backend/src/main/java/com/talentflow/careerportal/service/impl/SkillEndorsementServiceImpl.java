package com.talentflow.careerportal.service.impl;

import com.talentflow.careerportal.dto.SkillEndorsementDto;
import com.talentflow.careerportal.entity.Candidate;
import com.talentflow.careerportal.entity.SkillEndorsement;
import com.talentflow.careerportal.exception.ResourceNotFoundException;
import com.talentflow.careerportal.repository.CandidateRepository;
import com.talentflow.careerportal.repository.SkillEndorsementRepository;
import com.talentflow.careerportal.service.SkillEndorsementService;
import com.talentflow.careerportal.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Enterprise implementation of SkillEndorsementService.
 */
@Service
@Transactional
public class SkillEndorsementServiceImpl implements SkillEndorsementService {

    private final SkillEndorsementRepository endorsementRepository;
    private final CandidateRepository candidateRepository;
    private final AuditService auditService;

    @Autowired
    public SkillEndorsementServiceImpl(SkillEndorsementRepository endorsementRepository,
                                       CandidateRepository candidateRepository,
                                       AuditService auditService) {
        this.endorsementRepository = endorsementRepository;
        this.candidateRepository = candidateRepository;
        this.auditService = auditService;
    }

    @Override
    public SkillEndorsementDto endorseSkill(Long candidateId, String skillName, String endorserName, String endorserTitle) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate", "id", candidateId));

        SkillEndorsement endorsement = new SkillEndorsement();
        endorsement.setCandidate(candidate);
        endorsement.setSkillName(skillName);
        endorsement.setEndorserName(endorserName != null ? endorserName : "Colleague");
        endorsement.setEndorserTitle(endorserTitle != null ? endorserTitle : "Senior Software Engineer");
        endorsement.setCreatedAt(LocalDateTime.now());

        SkillEndorsement saved = endorsementRepository.save(endorsement);
        auditService.logEvent(null, "SKILL_ENDORSED", "Endorsed skill " + skillName + " for candidate: " + candidateId, "ENDORSEMENT_SERVICE");
        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillEndorsementDto> getEndorsementsForCandidate(Long candidateId) {
        List<SkillEndorsement> list = endorsementRepository.findByCandidateId(candidateId);
        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private SkillEndorsementDto mapToDto(SkillEndorsement endorsement) {
        SkillEndorsementDto dto = new SkillEndorsementDto();
        dto.setId(endorsement.getId());
        dto.setCandidateId(endorsement.getCandidate() != null ? endorsement.getCandidate().getId() : null);
        dto.setSkillName(endorsement.getSkillName());
        dto.setEndorserName(endorsement.getEndorserName());
        dto.setEndorserTitle(endorsement.getEndorserTitle());
        dto.setCreatedAt(endorsement.getCreatedAt());
        return dto;
    }
}
