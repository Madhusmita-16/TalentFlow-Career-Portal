package com.talentflow.careerportal.util;

import com.talentflow.careerportal.dto.PagedResponse;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Utility helper for building unified PagedResponse wrappers from Spring Data Page objects.
 */
public final class PaginationUtil {

    private PaginationUtil() {
        // Private constructor
    }

    /**
     * Converts a Spring Data Page object to a generic PagedResponse DTO.
     *
     * @param page Spring Data Page instance.
     * @param <T> Content element type.
     * @return Formatted PagedResponse instance.
     */
    public static <T> PagedResponse<T> toPagedResponse(Page<T> page) {
        if (page == null) {
            return new PagedResponse<>(List.of(), 0, 0, 0, 0, true);
        }

        return new PagedResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }
}
