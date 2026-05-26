package com.vietride.api.controller;

import com.vietride.api.service.AIService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        if (message == null) {
            message = "";
        }
        String reply = aiService.generateReply(message);
        return Map.of("reply", reply);
    }
}
