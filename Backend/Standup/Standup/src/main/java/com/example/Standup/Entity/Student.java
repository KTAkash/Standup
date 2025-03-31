package com.example.Standup.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;


@Entity
@DiscriminatorValue("STUDENT")
@PrimaryKeyJoinColumn(name = "id")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Student extends User {
    @ElementCollection
    @CollectionTable(name = "student_modules", joinColumns = @JoinColumn(name = "student_id"))
    @Column(name = "module")
    private List<String> modules;

    @Column(name = "name")
    private String name;

    @Column(name = "enrollment_number", unique = true)
    private String enrollmentNumber;

    @Column(name = "active")
    private Boolean active = true;


}