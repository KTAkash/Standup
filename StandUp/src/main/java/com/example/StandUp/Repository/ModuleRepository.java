package com.example.StandUp.Repository;

import com.example.StandUp.Entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModuleRepository extends JpaRepository<Module, Long> {

    // Custom query method to check if a module with a given name already exists
    boolean existsByModuleName(String moduleName);
}
