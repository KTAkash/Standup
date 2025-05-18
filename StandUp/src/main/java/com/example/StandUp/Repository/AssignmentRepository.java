package com.example.StandUp.Repository;

import com.example.StandUp.Entity.Assignment;
import com.example.StandUp.Entity.Module;
import com.example.StandUp.Entity.Student;
import com.example.StandUp.Entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    @Query("SELECT a FROM Assignment a WHERE a.teacher.id = :teacherId")
    List<Assignment> findByTeacherId(@Param("teacherId") Long teacherId);

    @Query("SELECT a FROM Assignment a WHERE a.student = :student")
    List<Assignment> findByStudent(@Param("student") Student student);

    // Corrected query using the proper relationship name 'module'
    @Query("SELECT a FROM Assignment a JOIN a.module m WHERE m.id = :moduleId")
    List<Assignment> findByModuleId(@Param("moduleId") Long moduleId);

    // Corrected query using the proper relationship name 'module'
    @Query("SELECT a FROM Assignment a JOIN a.module m WHERE m.moduleName = :moduleName")
    List<Assignment> findByModuleName(@Param("moduleName") String moduleName);

    @Query("SELECT a FROM Assignment a WHERE a.student.id = :studentId AND a.module.id = :moduleId")
    List<Assignment> findByStudentAndModule(@Param("studentId") Long studentId,
                                            @Param("moduleId") Long moduleId);

    @Query("SELECT a FROM Assignment a WHERE a.teacher.id = :teacherId AND a.module.id = :moduleId")
    List<Assignment> findByTeacherAndModule(@Param("teacherId") Long teacherId,
                                            @Param("moduleId") Long moduleId);
}