package com.talentflow.careerportal.controller;

import com.talentflow.careerportal.dto.ApiResponse;
import com.talentflow.careerportal.dto.SkillEndorsementDto;
import com.talentflow.careerportal.service.SkillEndorsementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for peer skill endorsements.
 */
@RestController
@RequestMapping("/api/endorsements")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SkillEndorsementController {

    private final SkillEndorsementService endorsementService;

    @Autowired
    public SkillEndorsementController(SkillEndorsementService endorsementService) {
        this.endorsementService = endorsementService;
    }

    /**
     * Endpoint for endorsing a candidate skill.
     *
     * @param candidateId Candidate entity ID.
     * @param skillName Skill string name.
     * @param endorserName Peer endorser name.
     * @param endorserTitle Endorser professional title.
     * @return ResponseEntity with created SkillEndorsementDto.
     */
    @PostMapping("/endorse")
    public ResponseEntity<ApiResponse<SkillEndorsementDto>> endorseSkill(
            @RequestParam Long candidateId,
            @RequestParam String skillName,
            @RequestParam(required = false, defaultValue = "Colleague") String endorserName,
            @RequestParam(required = false, defaultValue = "Software Engineer") String endorserTitle) {
        SkillEndorsementDto dto = endorsementService.endorseSkill(candidateId, skillName, endorserName, endorserTitle);
        return ResponseEntity.ok(ApiResponse.success(dto, "Skill endorsed successfully."));
    }

    /**
     * Endpoint for retrieving candidate skill endorsements.
     *
     * @param candidateId Candidate entity ID.
     * @return ResponseEntity with list of SkillEndorsementDto.
     */
    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<ApiResponse<List<SkillEndorsementDto>>> getCandidateEndorsements(@PathVariable Long candidateId) {
        List<SkillEndorsementDto> list = endorsementService.getEndorsementsForCandidate(candidateId);
        return ResponseEntity.ok(ApiResponse.success(list, "Candidate skill endorsements fetched successfully."));
    }
}
