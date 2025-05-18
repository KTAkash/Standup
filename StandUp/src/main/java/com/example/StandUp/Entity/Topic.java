package com.example.StandUp.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;  // add this import
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String topicName;

    @ManyToOne
    @JoinColumn(name = "module_id")
    @JsonBackReference  // Prevent infinite recursion on serialization
    private Module module;
}
