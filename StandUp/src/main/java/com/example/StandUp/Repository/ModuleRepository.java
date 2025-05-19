package com.example.StandUp.Repository;

import com.example.StandUp.Entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface ModuleRepository extends JpaRepository<Module, Long> {
    Set<Module> findByStudentsId(Long studentId);
    // Custom query method to check if a module with a given name already exists
    boolean existsByModuleName(String moduleName);
}
