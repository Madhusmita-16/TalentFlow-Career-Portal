package com.talentflow.careerportal.service.impl;

import com.talentflow.careerportal.entity.Organization;
import com.talentflow.careerportal.exception.ResourceNotFoundException;
import com.talentflow.careerportal.repository.OrganizationRepository;
import com.talentflow.careerportal.service.OrganizationService;
import com.talentflow.careerportal.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Enterprise implementation of OrganizationService.
 */
@Service
@Transactional
public class OrganizationServiceImpl implements OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final AuditService auditService;

    @Autowired
    public OrganizationServiceImpl(OrganizationRepository organizationRepository, AuditService auditService) {
        this.organizationRepository = organizationRepository;
        this.auditService = auditService;
    }

    @Override
    @Transactional(readOnly = true)
    public Organization getOrganizationById(Long id) {
        return organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization", "id", id));
    }

    @Override
    public Organization createOrganization(Organization organization) {
        Organization saved = organizationRepository.save(organization);
        auditService.logEvent(null, "ORGANIZATION_CREATED", "Created employer organization: " + saved.getName(), "ORGANIZATION_SERVICE");
        return saved;
    }

    @Override
    public Organization updateOrganization(Long id, Organization organization) {
        Organization existing = getOrganizationById(id);
        if (organization.getName() != null) existing.setName(organization.getName());
        if (organization.getDescription() != null) existing.setDescription(organization.getDescription());
        if (organization.getWebsiteUrl() != null) existing.setWebsiteUrl(organization.getWebsiteUrl());
        if (organization.getLogoUrl() != null) existing.setLogoUrl(organization.getLogoUrl());
        if (organization.getIndustry() != null) existing.setIndustry(organization.getIndustry());

        Organization updated = organizationRepository.save(existing);
        auditService.logEvent(null, "ORGANIZATION_UPDATED", "Updated organization: " + id, "ORGANIZATION_SERVICE");
        return updated;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAll();
    }
}
