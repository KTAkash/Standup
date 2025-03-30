package com.example.Standup.Controller;

import com.example.Standup.Entity.Teacher;
import com.example.Standup.Service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/su")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    // Create a teacher
    @PostMapping("/teacher")
    public ResponseEntity<String> createTeacher(@RequestBody Teacher teacher) {
        teacherService.createTeacher(teacher);
        return ResponseEntity.ok("Teacher created successfully");
    }

    // Update teacher
    @PutMapping("/update-teacher/{teacherId}")
    public ResponseEntity<String> updateTeacher(@PathVariable Long teacherId, @RequestBody Teacher teacher) {
        teacherService.updateTeacher(teacherId, teacher);
        return ResponseEntity.ok("Teacher updated successfully");
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
