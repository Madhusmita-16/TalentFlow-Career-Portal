package com.talentflow.careerportal.controller;

import com.talentflow.careerportal.entity.Organization;
import com.talentflow.careerportal.service.OrganizationService;
import org.junit.jupiter.api.BeforeEach;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * JUnit 5 test suite for OrganizationController REST endpoints.
 */
@ExtendWith(MockitoExtension.class)
public class OrganizationControllerTest {

    @Mock
    private OrganizationService organizationService;

    @InjectMocks
    private OrganizationController organizationController;

    private Organization organization;

    @BeforeEach
    void setUp() {
        organization = new Organization();
        organization.setId(10L);
        organization.setName("Link2Career Enterprise");
        organization.setIndustry("Software & Technology");
        organization.setWebsiteUrl("https://link2career.com");
    }

    @Test
    @DisplayName("Should return organization details by ID")
    void getOrganizationById_Success() {
        when(organizationService.getOrganizationById(10L)).thenReturn(organization);

        ResponseEntity<?> response = organizationController.getOrganizationById(10L);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @DisplayName("Should create new organization profile and return 200 OK")
    void createOrganization_Success() {
        when(organizationService.createOrganization(any(Organization.class))).thenReturn(organization);

        ResponseEntity<?> response = organizationController.createOrganization(organization);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(organizationService, times(1)).createOrganization(any(Organization.class));
    }
}
