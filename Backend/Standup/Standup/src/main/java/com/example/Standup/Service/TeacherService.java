package com.example.Standup.Service;

import com.example.Standup.Entity.Teacher;
import com.example.Standup.Repository.TeacherRepository;
import com.example.Standup.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherService {
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;

    public Teacher createTeacher(Teacher teacher) {
        return teacherRepository.save(teacher);
    }

    public Teacher updateTeacher(Long teacherId, Teacher teacher) {
        teacher.setId(teacherId);
        return teacherRepository.save(teacher);
    }

    public void deleteTeacher(Long teacherId) {
        teacherRepository.deleteById(teacherId);
    }

    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll(); // Or use findAllTeachers() from UserRepository
    }

    public Teacher getTeacherById(Long teacherId) {
        return teacherRepository.findById(teacherId).orElse(null);
    }
}