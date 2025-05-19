package com.example.StandUp.Service;

import com.example.StandUp.Entity.*;
import com.example.StandUp.Entity.Module;
import com.example.StandUp.Enum.Role;
import com.example.StandUp.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final ModuleRepository moduleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AssignmentRepository assignmentRepository;
    private final CreditRepository creditRepository;
    private final FeedbackRepository feedbackRepository;

    // other dependencies...

    public Set<Module> getModulesByIds(Set<Long> moduleIds) {
        if (moduleIds == null || moduleIds.isEmpty()) {
            return Collections.emptySet();
        }
        return new HashSet<>(moduleRepository.findAllById(moduleIds));
    }

    // fetchFullModules now ensures modules are fully fetched from DB before setting
    private Set<Module> fetchFullModules(Set<Module> modules) {
        if (modules == null || modules.isEmpty()) return Set.of();
        return modules.stream()
                .map(module -> moduleRepository.findById(module.getId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toSet());
    }

    // Create Teacher with modules fetched from DB
    public Teacher createTeacher(Teacher teacher) {
        teacher.setRole(Role.TEACHER);
        teacher.setPassword(passwordEncoder.encode(teacher.getPassword()));
        teacher.setModules(fetchFullModules(teacher.getModules())); // updated
        return teacherRepository.save(teacher);
    }

    // Update Teacher with correct modules
    public Teacher updateTeacher(Teacher teacher) {
        if (teacher.getModules() != null && !teacher.getModules().isEmpty()) {
            teacher.setModules(fetchFullModules(teacher.getModules())); // updated
        }
        return teacherRepository.save(teacher);
    }


    public void deleteTeacher(Long teacherId) {
        teacherRepository.deleteById(teacherId);
    }

    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAllWithModules();
    }

    public Teacher getTeacherById(Long teacherId) {
        return teacherRepository.findById(teacherId).orElse(null);
    }

    public Teacher getTeacherByUsername(String username) {
        return teacherRepository.findByUsername(username).orElse(null);
    }

    public Assignment createAssignment(Assignment assignment) {
        return assignmentRepository.save(assignment);
    }

    public List<Assignment> getAssignmentsByTeacher(Long teacherId) {
        return assignmentRepository.findByTeacherId(teacherId);
    }

    public Assignment getAssignmentById(Long assignmentId) {
        return assignmentRepository.findById(assignmentId).orElse(null);
    }

    public Module getModuleById(Long moduleId) {
        return moduleRepository.findById(moduleId).orElse(null);
    }
    public Student getStudentById(Long studentId) {
        return studentRepository.findById(studentId).orElse(null);
    }


    public Credit assignCredit(Credit credit) {
        return creditRepository.save(credit);
    }

    public Feedback sendFeedback(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    public List<Student> getStudentsByModules(String moduleName) {
        return studentRepository.findByModuleName(moduleName);
    }


}
