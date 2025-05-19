package com.example.StandUp.Service;
import com.example.StandUp.Entity.Module;

import com.example.StandUp.Entity.Assignment;
import com.example.StandUp.Entity.Student;
import com.example.StandUp.Enum.Role;
import com.example.StandUp.Repository.AssignmentRepository;
import com.example.StandUp.Repository.ModuleRepository;
import com.example.StandUp.Repository.StudentRepository;
import com.example.StandUp.Repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final ModuleRepository moduleRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Inject PasswordEncoder

    @Autowired  // Make sure this annotation is present
    private AssignmentRepository assignmentRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public Set<Module> getModulesByIds(Set<Long> moduleIds) {
        if (moduleIds == null || moduleIds.isEmpty()) {
            return Collections.emptySet();
        }
        return new HashSet<>(moduleRepository.findAllById(moduleIds));
    }


    public Student createStudent(Student student) {
        student.setRole(Role.STUDENT); // Ensure role is assigned
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        return studentRepository.save(student);
    }

    @Transactional
    public Student updateStudent(Long studentId, Student updatedStudent) {
        Student existingStudent = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Update basic fields
        if (updatedStudent.getName() != null) {
            existingStudent.setName(updatedStudent.getName());
        }
        if (updatedStudent.getEnrollmentNumber() != null) {
            existingStudent.setEnrollmentNumber(updatedStudent.getEnrollmentNumber());
        }
        if (updatedStudent.getActive() != null) {
            existingStudent.setActive(updatedStudent.getActive());
        }

        // Handle password update separately
        if (updatedStudent.getPassword() != null && !updatedStudent.getPassword().isEmpty()) {
            // Ensure password is encoded before saving
            String encodedPassword = passwordEncoder.encode(updatedStudent.getPassword());
            existingStudent.setPassword(encodedPassword);
        }

        // Handle modules update
        if (updatedStudent.getModules() != null) {
            existingStudent.setModules(updatedStudent.getModules());
        }

        return studentRepository.save(existingStudent);
    }

    @Transactional
    public void deleteStudent(Long studentId) {
        try {
            // First, directly execute SQL to clean up the join table
            entityManager.createNativeQuery(
                            "DELETE FROM student_modules WHERE student_id = :studentId")
                    .setParameter("studentId", studentId)
                    .executeUpdate();

            // Clear assignments related to this student
            assignmentRepository.findByStudentId(studentId)
                    .forEach(assignment -> {
                        assignment.setStudent(null);
                        assignmentRepository.save(assignment);
                    });

            // Ensure all changes are flushed
            entityManager.flush();

            // Finally delete the student
            studentRepository.deleteById(studentId);

            // Delete user entry if needed (depending on your inheritance strategy)
            if (userRepository.existsById(studentId)) {
                userRepository.deleteById(studentId);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error deleting student: " + e.getMessage(), e);
        }
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll(); // Or use findAllStudents() from UserRepository
    }

    public Student getStudentById(Long studentId) {
        return studentRepository.findById(studentId).orElse(null);
    }

    public Student getStudentByUsername(String username) {
        return studentRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public List<Assignment> getAssignmentsByStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return assignmentRepository.findByStudent(student); // Assuming such a relationship exists
    }

    public Map<String, Object> getStudentDashboard(String username) {
        return Map.of();
    }
}