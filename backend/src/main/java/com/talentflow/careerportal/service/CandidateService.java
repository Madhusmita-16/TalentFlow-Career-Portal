package com.talentflow.careerportal.service;

import com.talentflow.careerportal.dto.CandidateDto;
import com.talentflow.careerportal.dto.CandidateProfileDTO;
import com.talentflow.careerportal.dto.CandidateUpdateDTO;
import com.talentflow.careerportal.dto.EducationDto;
import com.talentflow.careerportal.dto.WorkExperienceDto;
import com.talentflow.careerportal.dto.PagedResponse;
import com.talentflow.careerportal.entity.Candidate;

import java.util.List;

/**
 * Service interface for candidate profile management, resume uploads,
 * work experience, education records, skill tracking, and candidate discovery.
 */
public interface CandidateService {

    /**
     * Retrieves full candidate profile details by candidate ID.
     *
     * @param id Candidate ID.
     * @return CandidateProfileDTO complete profile payload.
     */
    CandidateProfileDTO getCandidateProfileById(Long id);

    /**
     * Retrieves candidate profile details by associated User ID.
     *
     * @param userId User entity ID.
     * @return CandidateProfileDTO complete profile payload.
     */
    CandidateProfileDTO getCandidateProfileByUserId(Long userId);

    /**
     * Updates candidate profile information (headline, location, bio, skills, socials).
     *
     * @param userId User ID of the candidate.
     * @param updateDto Profile updates payload.
     * @return Updated CandidateProfileDTO payload.
     */
    CandidateProfileDTO updateCandidateProfile(Long userId, CandidateUpdateDTO updateDto);

    /**
     * Updates candidate avatar/photo URL.
     *
     * @param userId User ID.
     * @param avatarUrl New avatar image URL.
     * @return Updated CandidateProfileDTO.
     */
    CandidateProfileDTO updateAvatarUrl(Long userId, String avatarUrl);

    /**
     * Updates candidate profile cover banner background URL.
     *
     * @param userId User ID.
     * @param bannerUrl New cover banner image URL.
     * @return Updated CandidateProfileDTO.
     */
    CandidateProfileDTO updateBannerUrl(Long userId, String bannerUrl);

    /**
     * Stores and attaches uploaded resume file metadata to candidate profile.
     *
     * @param userId User ID.
     * @param resumeUrl Downloadable or previewable resume document URL.
     * @param fileName Original uploaded file name.
     * @return Updated CandidateProfileDTO.
     */
    CandidateProfileDTO updateResume(Long userId, String resumeUrl, String fileName);

    /**
     * Adds a new work experience entry to candidate profile.
     *
     * @param userId User ID.
     * @param experienceDto Work experience details.
     * @return Updated candidate profile DTO.
     */
    CandidateProfileDTO addWorkExperience(Long userId, WorkExperienceDto experienceDto);

    /**
     * Removes a work experience entry from candidate profile.
     *
     * @param userId User ID.
     * @param experienceId Experience entity ID.
     * @return Updated candidate profile DTO.
     */
    CandidateProfileDTO deleteWorkExperience(Long userId, Long experienceId);

    /**
     * Adds an education record entry to candidate profile.
     *
     * @param userId User ID.
     * @param educationDto Education record details.
     * @return Updated candidate profile DTO.
     */
    CandidateProfileDTO addEducation(Long userId, EducationDto educationDto);

    /**
     * Removes an education record entry from candidate profile.
     *
     * @param userId User ID.
     * @param educationId Education record entity ID.
     * @return Updated candidate profile DTO.
     */
    CandidateProfileDTO deleteEducation(Long userId, Long educationId);

    /**
     * Searches candidates by keyword query, skill set, and location filter.
     *
     * @param query Free text search query.
     * @param skills Skills list filter.
     * @param location Target location filter.
     * @param page Zero-indexed page number.
     * @param size Page size limit.
     * @return PagedResponse of CandidateDto items.
     */
    PagedResponse<CandidateDto> searchCandidates(String query, List<String> skills, String location, int page, int size);

    /**
     * Recalculates candidate profile completeness score (0-100%).
     *
     * @param candidate Candidate entity instance.
     * @return Calculated integer percentage score.
     */
    int calculateProfileCompleteness(Candidate candidate);
}
