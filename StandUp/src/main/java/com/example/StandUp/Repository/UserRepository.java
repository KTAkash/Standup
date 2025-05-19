package com.example.StandUp.Repository;

import com.example.StandUp.Entity.Student;
import com.example.StandUp.Entity.Teacher;
import com.example.StandUp.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {


    @Query("SELECT u FROM User u WHERE u.username = :username")
    Optional<User> findByUsername(@Param("username") String username);

    @Query("SELECT u FROM User u WHERE TYPE(u) = Student")
    List<Student> findAllStudents();

    @Query("SELECT u FROM User u WHERE TYPE(u) = Teacher")
    List<Teacher> findAllTeachers();

    @Query("SELECT s FROM Student s WHERE s.username = :username")
    Optional<Student> findStudentByUsername(@Param("username") String username);
}

