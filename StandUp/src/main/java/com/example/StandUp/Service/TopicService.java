package com.example.StandUp.Service;

import com.example.StandUp.Entity.Module;
import com.example.StandUp.Entity.Topic;
import com.example.StandUp.Repository.ModuleRepository;
import com.example.StandUp.Repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TopicService {

    private final TopicRepository topicRepository;
    private final ModuleRepository moduleRepository;

    public Topic createTopic(Long moduleId, Topic topic) {
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found"));

        // Check for duplicate topic name within the same module
        boolean exists = topicRepository.existsByTopicNameAndModuleId(topic.getTopicName(), moduleId);
        if (exists) {
            throw new RuntimeException("Topic with this name already exists in this module.");
        }

        topic.setModule(module);
        return topicRepository.save(topic);
    }

    public List<Topic> getTopicsByModule(Long moduleId) {
        return topicRepository.findByModuleId(moduleId);
    }

    public Optional<Topic> getTopicById(Long topicId) {
        return topicRepository.findById(topicId);
    }

    public void deleteTopic(Long topicId) {
        topicRepository.deleteById(topicId);
    }

    public Topic updateTopic(Long topicId, Topic updatedTopic) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        // Optionally, also check for duplicates when updating the name
        if (!topic.getTopicName().equals(updatedTopic.getTopicName())) {
            boolean exists = topicRepository.existsByTopicNameAndModuleId(updatedTopic.getTopicName(), topic.getModule().getId());
            if (exists) {
                throw new RuntimeException("Topic with this name already exists in this module.");
            }
        }

        topic.setTopicName(updatedTopic.getTopicName());
        return topicRepository.save(topic);
    }
}
