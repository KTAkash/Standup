package com.example.StandUp.Repository;

import com.example.StandUp.Entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findByModuleId(Long moduleId);

    boolean existsByTopicNameAndModuleId(String topicName, Long moduleId);
}


