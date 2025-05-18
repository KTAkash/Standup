package com.example.StandUp.Repository;

import com.example.StandUp.Entity.Student;
import com.example.StandUp.Entity.Teacher;
import com.example.StandUp.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    @Query("SELECT u FROM User u WHERE TYPE(u) = Student")
    List<Student> findAllStudents();

    @Query("SELECT u FROM User u WHERE TYPE(u) = Teacher")
    List<Teacher> findAllTeachers();
}

