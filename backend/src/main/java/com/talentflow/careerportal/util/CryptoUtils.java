package com.talentflow.careerportal.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

/**
 * Utility for computing secure SHA-256 digests and token checksums.
 */
public final class CryptoUtils {

    private CryptoUtils() {
        // Private constructor
    }

    /**
     * Computes SHA-256 hash string for raw text input.
     *
     * @param input Raw input text.
     * @return Hexadecimal SHA-256 hash string.
     */
    public static String sha256Hex(String input) {
        if (input == null) return "";

        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("SHA-256 hashing failure.", e);
        }
    }
}
