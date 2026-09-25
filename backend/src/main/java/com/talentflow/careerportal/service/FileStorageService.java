package com.talentflow.careerportal.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * Service interface for candidate resume uploads, profile photo attachments,
 * cover banner images, and AWS S3 / local file storage management.
 */
public interface FileStorageService {

    /**
     * Stores a candidate resume document file and returns its public URL.
     *
     * @param file Multipart file payload.
     * @param userId Associated candidate User ID.
     * @return Public accessible file URL string.
     */
    String storeResumeFile(MultipartFile file, Long userId);

    /**
     * Stores a profile photo or avatar image file.
     *
     * @param file Image multipart file payload.
     * @param userId Associated User ID.
     * @return Public accessible image URL string.
     */
    String storeAvatarFile(MultipartFile file, Long userId);

    /**
     * Stores a profile cover banner background image file.
     *
     * @param file Image multipart file.
     * @param userId Associated User ID.
     * @return Public accessible banner URL string.
     */
    String storeBannerFile(MultipartFile file, Long userId);

    /**
     * Deletes a stored file from cloud or local storage.
     *
     * @param fileUrl Public file URL string.
     */
    void deleteFile(String fileUrl);
}
