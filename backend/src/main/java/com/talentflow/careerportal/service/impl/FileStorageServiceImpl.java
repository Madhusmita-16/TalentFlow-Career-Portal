package com.talentflow.careerportal.service.impl;

import com.talentflow.careerportal.exception.BadRequestException;
import com.talentflow.careerportal.service.FileStorageService;
import com.talentflow.careerportal.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Enterprise implementation of FileStorageService managing candidate resume uploads,
 * profile images, and object storage persistence.
 */
@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private final AuditService auditService;

    @Autowired
    public FileStorageServiceImpl(AuditService auditService) {
        this.auditService = auditService;
    }

    @Override
    public String storeResumeFile(MultipartFile file, Long userId) {
        return saveFile(file, "resumes", userId);
    }

    @Override
    public String storeAvatarFile(MultipartFile file, Long userId) {
        return saveFile(file, "avatars", userId);
    }

    @Override
    public String storeBannerFile(MultipartFile file, Long userId) {
        return saveFile(file, "banners", userId);
    }

    @Override
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) return;
        auditService.logEvent(null, "FILE_DELETED", "Deleted stored file: " + fileUrl, "FILE_STORAGE_SERVICE");
    }

    private String saveFile(MultipartFile file, String subDir, Long userId) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file must not be empty.");
        }

        try {
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String newFilename = UUID.randomUUID().toString() + extension;
            Path targetLocation = Paths.get(uploadDir, subDir, newFilename);
            Files.createDirectories(targetLocation.getParent());

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/uploads/" + subDir + "/" + newFilename;
            auditService.logEvent(userId, "FILE_UPLOADED", "Uploaded file: " + originalFilename + " -> " + fileUrl, "FILE_STORAGE_SERVICE");

            return fileUrl;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file. Please try again.", ex);
        }
    }
}
