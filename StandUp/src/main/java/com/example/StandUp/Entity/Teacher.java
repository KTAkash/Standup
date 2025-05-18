package com.example.StandUp.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Entity
@DiscriminatorValue("TEACHER")
@PrimaryKeyJoinColumn(name = "id")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Teacher extends User {

    @ManyToMany(fetch = FetchType.EAGER) // changed from LAZY to EAGER
    @JoinTable(
            name = "teacher_modules",
            joinColumns = @JoinColumn(name = "teacher_id"),
            inverseJoinColumns = @JoinColumn(name = "module_id")
    )
    @JsonIgnoreProperties("teachers") // Prevent recursive reference
    private Set<Module> modules = new HashSet<>();

    @Column(name = "name")
    private String name;

    @Column(name = "active")
    private Boolean active = true;
}
