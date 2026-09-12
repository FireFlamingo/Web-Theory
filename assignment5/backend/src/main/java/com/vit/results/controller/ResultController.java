package com.vit.results.controller;

import com.vit.results.model.StudentResult;
import com.vit.results.service.ResultService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ResultController {

    private final ResultService resultService;

    @Autowired
    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    @GetMapping
    public ResponseEntity<List<StudentResult>> getAllResults(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String branch) {
        List<StudentResult> results = resultService.getAllResults(query, branch);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResult> getResultById(@PathVariable String id) {
        return resultService.getResultById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/prn/{prn}")
    public ResponseEntity<StudentResult> getResultByPrn(@PathVariable String prn) {
        return resultService.getResultByPrn(prn)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createResult(@Valid @RequestBody StudentResult result) {
        try {
            StudentResult saved = resultService.saveResult(result);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateResult(@PathVariable String id, @Valid @RequestBody StudentResult result) {
        return resultService.updateResult(id, result)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResult(@PathVariable String id) {
        if (resultService.deleteResult(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/calculate")
    public ResponseEntity<StudentResult> calculateMarks(@RequestBody StudentResult result) {
        StudentResult calculated = resultService.calculateMetricsOnly(result);
        return ResponseEntity.ok(calculated);
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(resultService.getAnalytics());
    }
}
