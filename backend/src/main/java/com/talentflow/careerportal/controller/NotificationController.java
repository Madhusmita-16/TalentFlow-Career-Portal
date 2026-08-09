package com.talentflow.careerportal.controller;

import com.talentflow.careerportal.dto.NotificationDto;
import com.talentflow.careerportal.entity.Notification;
import com.talentflow.careerportal.entity.User;
import com.talentflow.careerportal.repository.NotificationRepository;
import com.talentflow.careerportal.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationController(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getMyNotifications(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        long unreadCount = notificationRepository.countByUserIdAndReadFalse(user.getId());

        List<NotificationDto> dtos = list.stream().map(n -> {
            NotificationDto dto = new NotificationDto();
            dto.setId(n.getId());
            dto.setTitle(n.getTitle());
            dto.setMessage(n.getMessage());
            dto.setType(n.getType());
            dto.setRead(n.isRead());
            dto.setLinkUrl(n.getLinkUrl());
            dto.setCreatedAt(n.getCreatedAt());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
                "notifications", dtos,
                "unreadCount", unreadCount
        ));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setRead(true);
        notificationRepository.save(notification);
        return ResponseEntity.ok(Map.of("message", "Marked as read"));
    }
}
