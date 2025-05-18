package com.example.StandUp.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;  // add this import
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

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

    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL)
    @JsonManagedReference  // Prevent infinite recursion on serialization
    private List<Topic> topics;

    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Assignment> assignments;
}
