package com.example.StandUp.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Module {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String moduleName;

    @ManyToMany(mappedBy = "modules", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Student> students = new HashSet<>();
    @OneToMany(mappedBy = "module", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Topic> topics = new ArrayList<>();

    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Assignment> assignments;
}