package com.example.Standup.Controller;

import com.example.Standup.Entity.User;
import com.example.Standup.Enum.Role;
import com.example.Standup.JWT.JwtUtil;
import com.example.Standup.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/su")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin(@RequestBody User adminUser) {
        try {
            userService.createAdmin(adminUser.getUsername(), adminUser.getPassword());
            return ResponseEntity.ok("Admin created successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @GetMapping("/welcome")
    public ResponseEntity<String> welcomeMessage() {
        return ResponseEntity.ok("Welcome to the Standup API!");
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        try {
            userService.registerUser(user.getUsername(), user.getPassword(), user.getRole());
            return ResponseEntity.ok("Registered Successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {
        try {
            User authenticatedUser = userService.getUserByUsername(loginUser.getUsername());

            if (authenticatedUser != null &&
                    userService.validateCredentials(loginUser.getUsername(), loginUser.getPassword())) {

                String token = jwtUtil.generateToken(
                        authenticatedUser.getUsername(),
                        authenticatedUser.getRole().name()
                );

                return ResponseEntity.ok(Map.of(
                        "message", "Login successful",
                        "token", token,
                        "role", authenticatedUser.getRole().name()
                ));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login failed");
        }
    }

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