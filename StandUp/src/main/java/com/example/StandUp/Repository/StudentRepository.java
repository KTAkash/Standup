package com.example.StandUp.Repository;

import com.example.StandUp.Entity.Student;
import com.example.StandUp.Entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface StudentRepository extends JpaRepository<Student, Long> {

    // Fetch students with their modules (eager loading)
    @Query("SELECT DISTINCT s FROM Student s LEFT JOIN FETCH s.modules")
    List<Student> findAllWithModules();

    // Basic fetch without modules
    @Query("SELECT s FROM Student s")
    List<Student> findAllStudents();

    // Find by username
    Optional<Student> findByUsername(String username);

    // Find students by module name
    @Query("SELECT DISTINCT s FROM Student s JOIN s.modules m WHERE m.moduleName = :moduleName")
    List<Student> findByModuleName(@Param("moduleName") String moduleName);

    // Find students by module ID (more efficient)
    @Query("SELECT DISTINCT s FROM Student s JOIN s.modules m WHERE m.id = :moduleId")
    List<Student> findByModuleId(@Param("moduleId") Long moduleId);

    // Find students by multiple module IDs
    @Query("SELECT DISTINCT s FROM Student s JOIN s.modules m WHERE m.id IN :moduleIds")
    List<Student> findByModuleIds(@Param("moduleIds") Set<Long> moduleIds);

    // Find active students by module
    @Query("SELECT DISTINCT s FROM Student s JOIN s.modules m WHERE m.id = :moduleId AND s.active = true")
    List<Student> findActiveByModuleId(@Param("moduleId") Long moduleId);
}