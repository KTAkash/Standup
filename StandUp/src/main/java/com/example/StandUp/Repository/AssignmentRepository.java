package com.example.StandUp.Repository;

import com.example.StandUp.Entity.Assignment;
import com.example.StandUp.Entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByTeacherId(Long teacherId);

    List<Assignment> findByStudent(Student student);

    List<Assignment> findByModules(String module);
}
