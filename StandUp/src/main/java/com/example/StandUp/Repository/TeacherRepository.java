package com.example.StandUp.Repository;

import com.example.StandUp.Entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    @Query("SELECT t FROM Teacher t LEFT JOIN FETCH t.modules")
    List<Teacher> findAllWithModules();

    @Query("SELECT t FROM Teacher t")
    List<Teacher> findAllTeachers();

    Optional<Teacher> findByUsername(String username);


}
