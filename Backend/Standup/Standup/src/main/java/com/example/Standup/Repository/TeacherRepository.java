package com.example.Standup.Repository;

import com.example.Standup.Entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    @Query("SELECT t FROM Teacher t LEFT JOIN FETCH t.modules")
    List<Teacher> findAllWithModules();

    @Query("SELECT t FROM Teacher t")
    List<Teacher> findAllTeachers();
}
