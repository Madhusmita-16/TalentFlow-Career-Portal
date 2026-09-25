package com.talentflow.careerportal.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit test suite verifying AES-256-GCM encryption and decryption integrity.
 */
public class EncryptionServiceTest {

    private EncryptionService encryptionService;

    @BeforeEach
    void setUp() {
        encryptionService = new EncryptionService();
        ReflectionTestUtils.setField(encryptionService, "secretKeyPassphrase", "TestEncryptionSecretPassphrase2026!");
    }

    @Test
    @DisplayName("Should encrypt plain text string and decrypt back to exact original content")
    void encryptAndDecrypt_RoundTripSuccess() {
        String sensitiveData = "Candidate SSN / Tax ID: 987-65-4321";

        String encrypted = encryptionService.encrypt(sensitiveData);
        assertNotNull(encrypted);
        assertNotEquals(sensitiveData, encrypted);

        String decrypted = encryptionService.decrypt(encrypted);
        assertEquals(sensitiveData, decrypted);
    }
}
