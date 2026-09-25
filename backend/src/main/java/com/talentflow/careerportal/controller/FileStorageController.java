package com.talentflow.careerportal.controller;

import com.talentflow.careerportal.dto.ApiResponse;
import com.talentflow.careerportal.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

/**
 * REST controller handling resume document uploads, avatar photo uploads, and banner background image uploads.
 */
@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FileStorageController {

    private final FileStorageService fileStorageService;

    @Autowired
    public FileStorageController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    /**
     * Endpoint for uploading candidate resume document.
     *
     * @param file Resume multipart document file.
     * @param userId Candidate User ID.
     * @return ResponseEntity with uploaded file URL.
     */
    @PostMapping("/upload-resume")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") Long userId) {
        String fileUrl = fileStorageService.storeResumeFile(file, userId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("resumeUrl", fileUrl, "fileName", file.getOriginalFilename()), "Resume uploaded successfully."));
    }

    /**
     * Endpoint for uploading profile photo avatar image.
     *
     * @param file Image multipart file.
     * @param userId Candidate User ID.
     * @return ResponseEntity with uploaded avatar URL.
     */
    @PostMapping("/upload-avatar")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") Long userId) {
        String avatarUrl = fileStorageService.storeAvatarFile(file, userId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("avatarUrl", avatarUrl), "Avatar image uploaded successfully."));
    }

    /**
     * Endpoint for uploading profile cover banner background image.
     *
     * @param file Image multipart file.
     * @param userId Candidate User ID.
     * @return ResponseEntity with uploaded banner URL.
     */
    @PostMapping("/upload-banner")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadBanner(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") Long userId) {
        String bannerUrl = fileStorageService.storeBannerFile(file, userId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("bannerUrl", bannerUrl), "Cover banner image uploaded successfully."));
    }
}
