package com.example.StandUp.Service;

import com.example.StandUp.Entity.User;
import com.example.StandUp.Enum.Role;
import com.example.StandUp.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Method to create an admin
    public void createAdmin(String username, String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Admin already exists!");
        }

        User admin = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .role(Role.ADMIN)
                .build();

        userRepository.save(admin);
    }

    // Get user by username (FIXED)
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    // Validate login credentials
    public boolean validateCredentials(String username, String password) {
        User user = getUserByUsername(username); // Use the fixed method
        return user != null && passwordEncoder.matches(password, user.getPassword());
    }

    // Register a new user (Student or Teacher)
    public User registerUser(String username, String password, Role role) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("User already exists!");
        }

        String finalPassword = password;
        if (!password.startsWith("$2a$")) {
            finalPassword = passwordEncoder.encode(password);
        }

        User user = User.builder()
                .username(username)
                .password(password)
                .role(role)
                .build();

        return userRepository.save(user);
    }

    // Get user by ID
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // Update user
    public void updateUser(User user) {
        userRepository.save(user);
    }
}
