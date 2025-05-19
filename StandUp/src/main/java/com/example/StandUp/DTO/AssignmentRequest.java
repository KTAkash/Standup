package com.example.StandUp.DTO;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AssignmentRequest {
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private Long moduleId;
    private Long topicId;
    private Long studentId;
}