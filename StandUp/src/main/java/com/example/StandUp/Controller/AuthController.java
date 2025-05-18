package com.example.StandUp.Controller;

import com.example.StandUp.Entity.User;
import com.example.StandUp.Enum.Role;
import com.example.StandUp.JWT.Jwt;
import com.example.StandUp.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/su")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final Jwt jwt;
    private final PasswordEncoder passwordEncoder; // Inject PasswordEncoder

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {
        try {
            // Check if user exists
            User authenticatedUser = userService.getUserByUsername(loginUser.getUsername());
            if (authenticatedUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid username"));
            }

            // Check if password matches
            if (!passwordEncoder.matches(loginUser.getPassword(), authenticatedUser.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid password"));
            }

            // Generate JWT token if authenticated
            String token = jwt.generateToken(
                    authenticatedUser.getUsername(),
                    authenticatedUser.getRole().name()
            );

            // Return the token with success message
            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "token", token,
                    "role", authenticatedUser.getRole().name(),
                    "username", authenticatedUser.getUsername()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Login failed: " + e.getMessage()));
        }
    }

    // Create admin
    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin(@RequestBody User adminUser) {
        try {
            userService.createAdmin(adminUser.getUsername(), adminUser.getPassword());
            return ResponseEntity.ok("Admin created successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    // Register user (e.g., Student, Teacher, etc.)
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        try {
            userService.registerUser(user.getUsername(), user.getPassword(), user.getRole());
            return ResponseEntity.ok("Registered Successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    // Create teacher
    @PostMapping("/create-teacher")
    public ResponseEntity<String> createTeacher(@RequestBody User teacherUser) {
        try {
            teacherUser.setRole(Role.TEACHER);
            userService.registerUser(teacherUser.getUsername(), teacherUser.getPassword(), teacherUser.getRole());
            return ResponseEntity.ok("Teacher created successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    // Create student
    @PostMapping("/create-student")
    public ResponseEntity<String> createStudent(@RequestBody User studentUser) {
        try {
            studentUser.setRole(Role.STUDENT);
            userService.registerUser(studentUser.getUsername(), studentUser.getPassword(), studentUser.getRole());
            return ResponseEntity.ok("Student created successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
}