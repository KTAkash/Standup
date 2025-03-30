package com.example.Standup.Controller;

import com.example.Standup.Entity.Student;
import com.example.Standup.Service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/su")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    // Create a student
    @PostMapping("/student")
    public ResponseEntity<String> createStudent(@RequestBody Student student) {
        studentService.createStudent(student);
        return ResponseEntity.ok("Student created successfully");
    }

    // Update student
    @PutMapping("/update-student/{studentId}")
    public ResponseEntity<String> updateStudent(@PathVariable Long studentId, @RequestBody Student student) {
        studentService.updateStudent(studentId, student);
        return ResponseEntity.ok("Student updated successfully");
    }

    // Delete student
    @DeleteMapping("/delete-student/{studentId}")
    public ResponseEntity<String> deleteStudent(@PathVariable Long studentId) {
        studentService.deleteStudent(studentId);
        return ResponseEntity.ok("Student deleted successfully");
    }

    // Get all students
    @GetMapping("/students")
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    // Get student by ID
    @GetMapping("/student/{studentId}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long studentId) {
        Student student = studentService.getStudentById(studentId);
        if (student != null) {
            return ResponseEntity.ok(student);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
}
