package com.example.StandUp.DTO;

import lombok.Data;
import java.util.Set;

@Data
public class TeacherDTO {
    private String name;
    private String username;
    private String password;
    private Boolean active;
    private Set<Long> moduleIds;
}
