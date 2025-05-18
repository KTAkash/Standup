package com.example.StandUp.Controller;

import com.example.StandUp.Entity.Topic;
import com.example.StandUp.Service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/su/topics")
@CrossOrigin(origins = "*")  // Allow requests from any origin; configure appropriately in production
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    // ✅ Create a new topic under a specific module
    @PostMapping("/module/{moduleId}")
    public ResponseEntity<?> createTopic(@PathVariable Long moduleId, @RequestBody Topic topic) {
        try {
            Topic createdTopic = topicService.createTopic(moduleId, topic);
            return ResponseEntity.ok(createdTopic);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // ✅ Get all topics by module
    @GetMapping("/module/{moduleId}")
    public ResponseEntity<List<Topic>> getTopicsByModule(@PathVariable Long moduleId) {
        System.out.println("Fetching topics for Module ID: " + moduleId);
        return ResponseEntity.ok(topicService.getTopicsByModule(moduleId));
    }

    // ✅ Get topic by ID
    @GetMapping("/{id}")
    public ResponseEntity<Topic> getTopicById(@PathVariable Long id) {
        return topicService.getTopicById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Update topic by ID
    @PutMapping("/{id}")
    public ResponseEntity<Topic> updateTopic(@PathVariable Long id, @RequestBody Topic topic) {
        System.out.println("Updating topic ID: " + id + " | New Name: " + topic.getTopicName());
        Topic updatedTopic = topicService.updateTopic(id, topic);
        return ResponseEntity.ok(updatedTopic);
    }

    // ✅ Delete topic by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTopic(@PathVariable Long id) {
        topicService.deleteTopic(id);
        return ResponseEntity.ok("Topic deleted successfully");
    }
}
