package com.example.StandUp.Service;

import com.example.StandUp.Entity.Module;
import com.example.StandUp.Repository.ModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ModuleService {

    private final ModuleRepository moduleRepository;

    public Module createModule(Module module) {
        return moduleRepository.save(module);
    }

    public List<Module> getAllModules() {
        return moduleRepository.findAll();
    }

    public Optional<Module> getModuleById(Long id) {
        return moduleRepository.findById(id);
    }

    public Module updateModule(Long id, Module updatedModule) {
        Module existingModule = moduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Module not found"));
        existingModule.setModuleName(updatedModule.getModuleName());
        return moduleRepository.save(existingModule);
    }

    public void deleteModule(Long id) {
        moduleRepository.deleteById(id);
    }
}
