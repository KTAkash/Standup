package com.example.Standup.Controller;

import com.example.Standup.Entity.Teacher;
import com.example.Standup.Service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/su")
@CrossOrigin(origins = "*")

@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;
    private final PasswordEncoder passwordEncoder; // Inject PasswordEncoder


    // Create a teacher
    @PostMapping("/teacher")
    public ResponseEntity<String> createTeacher(@RequestBody Teacher teacher) {
        teacherService.createTeacher(teacher);
        return ResponseEntity.ok("Teacher created successfully");
    }

    // Update teacher
    @PutMapping("/update-teacher/{teacherId}")
    public ResponseEntity<?> updateTeacher(
            @PathVariable Long teacherId,
            @RequestBody Teacher updatedTeacher) {
        try {
            Teacher existingTeacher = teacherService.getTeacherById(teacherId);
            if (existingTeacher == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Teacher not found");
            }

            // Update fields
            if (updatedTeacher.getName() != null) {
                existingTeacher.setName(updatedTeacher.getName());
            }
            if (updatedTeacher.getModules() != null) {
                existingTeacher.setModules(updatedTeacher.getModules());
            }
            if (updatedTeacher.getActive() != null) {
                existingTeacher.setActive(updatedTeacher.getActive());
            }

            // Handle password separately
            if (updatedTeacher.getPassword() != null && !updatedTeacher.getPassword().isEmpty()) {
                existingTeacher.setPassword(passwordEncoder.encode(updatedTeacher.getPassword()));
            }

            Teacher savedTeacher = teacherService.updateTeacher(existingTeacher);
            return ResponseEntity.ok(savedTeacher);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error updating teacher: " + e.getMessage());
        }
    }


       // Delete teacher
    @DeleteMapping("/delete-teacher/{teacherId}")
    public ResponseEntity<String> deleteTeacher(@PathVariable Long teacherId) {
        teacherService.deleteTeacher(teacherId);
        return ResponseEntity.ok("Teacher deleted successfully");
    }

    // Get all teachers
    @GetMapping("/teachers")
    public ResponseEntity<List<Teacher>> getAllTeachers() {
        return ResponseEntity.ok(teacherService.getAllTeachers());
    }

    // Get teacher by ID
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<Teacher> getTeacherById(@PathVariable Long teacherId) {
        Teacher teacher = teacherService.getTeacherById(teacherId);
        if (teacher != null) {
            return ResponseEntity.ok(teacher);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
}
