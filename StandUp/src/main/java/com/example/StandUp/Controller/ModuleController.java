package com.example.StandUp.Controller;

import com.example.StandUp.Entity.Module;
import com.example.StandUp.Service.ModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/su/modules")
@CrossOrigin(origins = "*")  // Allows requests from any origin; configure properly in production
@RequiredArgsConstructor
public class ModuleController {

    private final ModuleService moduleService;

    // ✅ Create a new module
    @PostMapping
    public ResponseEntity<Module> createModule(@RequestBody Module module) {
        System.out.println("Received moduleName: " + module.getModuleName());
        Module createdModule = moduleService.createModule(module);
        return ResponseEntity.ok(createdModule);
    }

    // ✅ Get all modules
    @GetMapping
    public ResponseEntity<List<Module>> getAllModules() {
        return ResponseEntity.ok(moduleService.getAllModules());
    }

    // ✅ Get a module by ID
    @GetMapping("/{id}")
    public ResponseEntity<Module> getModuleById(@PathVariable Long id) {
        return moduleService.getModuleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Update an existing module
    @PutMapping("/{id}")
    public ResponseEntity<Module> updateModule(@PathVariable Long id, @RequestBody Module updatedModule) {
        System.out.println("Updating module ID: " + id + ", New Name: " + updatedModule.getModuleName());
        Module updated = moduleService.updateModule(id, updatedModule);
        return ResponseEntity.ok(updated);
    }

    // ✅ Delete a module
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteModule(@PathVariable Long id) {
        moduleService.deleteModule(id);
        return ResponseEntity.ok("Module deleted successfully");
    }
}
