package com.example.StandUp.Controller;
import com.example.StandUp.Entity.Module;

import com.example.StandUp.DTO.StudentDTO;
import com.example.StandUp.Entity.Assignment;
import com.example.StandUp.Entity.Student;
import com.example.StandUp.Entity.User;
import com.example.StandUp.Enum.Role;
import com.example.StandUp.Service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/su")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/student-dashboard")
    public ResponseEntity<?> getStudentDashboard(Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed");
            }

            String username = authentication.getName();
            System.out.println("Fetching dashboard for user: " + username);

            Student student = studentService.getStudentByUsername(username);
            if (student == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
            }

            List<Assignment> assignments = studentService.getAssignmentsByStudent(student.getId());

            return ResponseEntity.ok(new StudentDashboardResponse(student, assignments));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching dashboard: " + e.getMessage());
        }
    }

    // Create a student
    @PostMapping("/student")
    public ResponseEntity<?> createStudent(@RequestBody StudentDTO studentDTO) {
        try {
            // First create the User part
            User user = User.builder()
                    .username(studentDTO.getUsername())
                    .password(studentDTO.getPassword())
                    .role(Role.STUDENT)
                    .build();

            // Then create the Student with relationships
            Set<Module> modules = studentService.getModulesByIds(studentDTO.getModuleIds());

            Student student = Student.builder()
                    .name(studentDTO.getName())
                    .enrollmentNumber(studentDTO.getEnrollmentNumber())
                    .modules(modules)
                    .active(true)
                    .build();

            // Set the inheritance relationship
            student.setUsername(user.getUsername());
            student.setPassword(user.getPassword());
            student.setRole(user.getRole());

            Student createdStudent = studentService.createStudent(student);
            return ResponseEntity.ok(createdStudent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error creating student: " + e.getMessage());
        }
    }
    // Update student
    @PutMapping("/update-student/{studentId}")
    public ResponseEntity<?> updateStudent(
            @PathVariable Long studentId,
            @RequestBody StudentDTO updatedStudentDTO) {
        try {
            Student existingStudent = studentService.getStudentById(studentId);
            if (existingStudent == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
            }

            if (updatedStudentDTO.getName() != null) {
                existingStudent.setName(updatedStudentDTO.getName());
            }

            if (updatedStudentDTO.getEnrollmentNumber() != null) {
                existingStudent.setEnrollmentNumber(updatedStudentDTO.getEnrollmentNumber());
            }

            if (updatedStudentDTO.getModuleIds() != null) {
                Set<Module> modules = studentService.getModulesByIds(updatedStudentDTO.getModuleIds());
                existingStudent.setModules(modules);
            }

            if (updatedStudentDTO.getActive() != null) {
                existingStudent.setActive(updatedStudentDTO.getActive());
            }

            if (updatedStudentDTO.getPassword() != null && !updatedStudentDTO.getPassword().isEmpty()) {
                existingStudent.setPassword(passwordEncoder.encode(updatedStudentDTO.getPassword()));
            }

            Student savedStudent = studentService.updateStudent(studentId,existingStudent);
            return ResponseEntity.ok(savedStudent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error updating student: " + e.getMessage());
        }
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

    // DTO class for student dashboard response
    static class StudentDashboardResponse {
        public Student student;
        public List<Assignment> assignments;

        public StudentDashboardResponse(Student student, List<Assignment> assignments) {
            this.student = student;
            this.assignments = assignments;
        }
    }
}

