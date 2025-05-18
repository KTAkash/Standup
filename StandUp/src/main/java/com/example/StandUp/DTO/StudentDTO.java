package com.example.StandUp.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class StudentDTO {
    private String name;
    private String username;
    private String password;
    private String enrollmentNumber;
    private Set<Long> moduleIds;
    private Boolean active;

}
