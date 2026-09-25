package com.talentflow.careerportal.service;

import com.talentflow.careerportal.entity.Organization;

import java.util.List;

/**
 * Service interface managing employer organization profiles, branding, company details,
 * and company directory listings.
 */
public interface OrganizationService {

    /**
     * Retrieves organization entity by ID.
     *
     * @param id Organization ID.
     * @return Organization entity.
     */
    Organization getOrganizationById(Long id);

    /**
     * Creates a new organization profile.
     *
     * @param organization Organization entity details.
     * @return Created Organization entity.
     */
    Organization createOrganization(Organization organization);

    /**
     * Updates an existing organization profile.
     *
     * @param id Target Organization ID.
     * @param organization Organization details update.
     * @return Updated Organization entity.
     */
    Organization updateOrganization(Long id, Organization organization);

    /**
     * Retrieves list of all active registered employer organizations.
     *
     * @return List of Organizations.
     */
    List<Organization> getAllOrganizations();
}
