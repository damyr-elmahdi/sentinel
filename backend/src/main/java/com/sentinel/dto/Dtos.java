package com.sentinel.dto;

import com.sentinel.models.User;
import jakarta.validation.constraints.*;
import lombok.*;

// ════════════════════════════════════════════════════════
//  AUTH DTOs
// ════════════════════════════════════════════════════════

class AuthDtos  {

    @Data
    public static class LoginRequest {
        @NotBlank @Email
        private String email;

        @NotBlank @Size(min = 6, max = 100)
        private String password;
    }
    

    @Data
    public static class RegisterRequest {
        @NotBlank @Size(min = 3, max = 40)
        private String username;

        @NotBlank @Email @Size(max = 100)
        private String email;

        @NotBlank @Size(min = 8, max = 100)
        private String password;

        @NotBlank
        private String fullName;
    }

    @Data @Builder
    public static class AuthResponse {
        private String token;
        private String type = "Bearer";
        private UserDto user;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class AuthResponse {
    private String token;
    private String type = "Bearer";
    private UserDto user;
}

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class UserDto {
        private Long id;
        private String username;
        private String email;
        private String fullName;
        private String role;
        private String avatar;

        public static UserDto from(User user) {
            return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .avatar(user.getAvatar())
                .build();
        }
    }
}

// ════════════════════════════════════════════════════════
//  SHIFT DTOs
// ════════════════════════════════════════════════════════
class ShiftDtos {

    @Data
    public static class ShiftRequest {
        @NotNull private Long userId;
        @NotNull private java.time.LocalDate date;
        @NotNull private java.time.LocalTime startTime;
        @NotNull private java.time.LocalTime endTime;
        @NotBlank private String location;
        private String notes;
    }

    @Data
    public static class ShiftStatusRequest {
        @NotBlank private String status;
    }
}

// ════════════════════════════════════════════════════════
//  TASK DTOs
// ════════════════════════════════════════════════════════
class TaskDtos {

    @Data
    public static class TaskRequest {
        @NotBlank private String title;
        private String description;
        private String priority;
        private Long assignedToId;
        private java.time.LocalDateTime dueDate;
    }

    @Data
    public static class TaskStatusRequest {
        @NotBlank private String status;
    }
}

// ════════════════════════════════════════════════════════
//  BROADCAST DTO
// ════════════════════════════════════════════════════════
class BroadcastDtos {

    @Data
    public static class BroadcastRequest {
        @NotBlank private String subject;
        @NotBlank private String body;
        private String type = "INFO";
        private Long recipientId;  // null = broadcast all
    }
}

// ════════════════════════════════════════════════════════
//  API ERROR RESPONSE
// ════════════════════════════════════════════════════════
class ErrorDtos {

    @Data @Builder
    public static class ApiError {
        private int status;
        private String message;
        private java.time.LocalDateTime timestamp;
    }
}
