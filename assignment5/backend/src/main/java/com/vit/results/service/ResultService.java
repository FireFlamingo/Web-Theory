package com.vit.results.service;

import com.vit.results.model.StudentResult;
import com.vit.results.model.SubjectMarks;
import com.vit.results.repository.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ResultService {

    private final ResultRepository resultRepository;
    private final Map<String, StudentResult> inMemoryStore = new ConcurrentHashMap<>();

    @Autowired
    public ResultService(ResultRepository resultRepository) {
        this.resultRepository = resultRepository;
    }

    @PostConstruct
    public void initDefaultData() {
        // Default Seed Data
        List<SubjectMarks> s1Subjects = List.of(
            new SubjectMarks("CS301", "Web Technology", 4, 27.5, 63.0),
            new SubjectMarks("CS302", "Database Management Systems", 4, 26.0, 65.0),
            new SubjectMarks("CS303", "Software Engineering", 3, 25.0, 58.5),
            new SubjectMarks("CS304", "Computer Networks", 3, 28.0, 66.0)
        );
        StudentResult s1 = new StudentResult("22210045", "Aarav Sharma", "311045", "Computer Engineering", 5, s1Subjects);
        s1.setId("101");

        List<SubjectMarks> s2Subjects = List.of(
            new SubjectMarks("CS301", "Web Technology", 4, 29.0, 68.0),
            new SubjectMarks("CS302", "Database Management Systems", 4, 30.0, 69.0),
            new SubjectMarks("CS303", "Software Engineering", 3, 28.5, 65.5),
            new SubjectMarks("CS304", "Computer Networks", 3, 29.5, 67.0)
        );
        StudentResult s2 = new StudentResult("22210089", "Ananya Deshmukh", "321089", "Information Technology", 5, s2Subjects);
        s2.setId("102");

        List<SubjectMarks> s3Subjects = List.of(
            new SubjectMarks("CS301", "Web Technology", 4, 22.0, 53.0),
            new SubjectMarks("CS302", "Database Management Systems", 4, 21.5, 51.0),
            new SubjectMarks("CS303", "Software Engineering", 3, 23.0, 54.0),
            new SubjectMarks("CS304", "Computer Networks", 3, 20.0, 48.0)
        );
        StudentResult s3 = new StudentResult("22210102", "Priya Kulkarni", "331102", "AI & Data Science", 5, s3Subjects);
        s3.setId("103");

        List<SubjectMarks> s4Subjects = List.of(
            new SubjectMarks("CS301", "Web Technology", 4, 11.0, 24.0),
            new SubjectMarks("CS302", "Database Management Systems", 4, 15.0, 32.0),
            new SubjectMarks("CS303", "Software Engineering", 3, 14.0, 28.0),
            new SubjectMarks("CS304", "Computer Networks", 3, 18.0, 36.0)
        );
        StudentResult s4 = new StudentResult("22210250", "Vikram Mehta", "311250", "Computer Engineering", 5, s4Subjects);
        s4.setId("104");

        List<SubjectMarks> s5Subjects = List.of(
            new SubjectMarks("CS301", "Web Technology", 4, 25.0, 60.0),
            new SubjectMarks("CS302", "Database Management Systems", 4, 24.0, 59.0),
            new SubjectMarks("CS303", "Software Engineering", 3, 26.0, 62.0),
            new SubjectMarks("CS304", "Computer Networks", 3, 27.0, 61.0)
        );
        StudentResult s5 = new StudentResult("22210201", "Neha Joshi", "341201", "Electronics & Telecom", 5, s5Subjects);
        s5.setId("105");

        inMemoryStore.put(s1.getId(), s1);
        inMemoryStore.put(s2.getId(), s2);
        inMemoryStore.put(s3.getId(), s3);
        inMemoryStore.put(s4.getId(), s4);
        inMemoryStore.put(s5.getId(), s5);

        // Try syncing to MongoDB if available
        try {
            if (resultRepository.count() == 0) {
                resultRepository.saveAll(List.of(s1, s2, s3, s4, s5));
            }
        } catch (Exception e) {
            System.out.println("Notice: MongoDB connection pending. Operating seamlessly with In-Memory storage.");
        }
    }

    public List<StudentResult> getAllResults(String searchQuery, String branch) {
        List<StudentResult> all = new ArrayList<>();
        try {
            all = resultRepository.findAll();
            if (all.isEmpty()) {
                all = new ArrayList<>(inMemoryStore.values());
            }
        } catch (Exception e) {
            all = new ArrayList<>(inMemoryStore.values());
        }

        if (searchQuery != null && !searchQuery.trim().isEmpty()) {
            String queryLower = searchQuery.toLowerCase().trim();
            all = all.stream().filter(r -> 
                r.getStudentName().toLowerCase().contains(queryLower) ||
                r.getPrn().toLowerCase().contains(queryLower) ||
                r.getRollNo().toLowerCase().contains(queryLower)
            ).toList();
        }

        if (branch != null && !branch.trim().isEmpty() && !"ALL".equalsIgnoreCase(branch)) {
            all = all.stream().filter(r -> r.getBranch().equalsIgnoreCase(branch.trim())).toList();
        }

        return all;
    }

    public Optional<StudentResult> getResultById(String id) {
        try {
            Optional<StudentResult> fromDb = resultRepository.findById(id);
            if (fromDb.isPresent()) return fromDb;
        } catch (Exception ignored) {}
        return Optional.ofNullable(inMemoryStore.get(id));
    }

    public Optional<StudentResult> getResultByPrn(String prn) {
        try {
            Optional<StudentResult> fromDb = resultRepository.findByPrn(prn);
            if (fromDb.isPresent()) return fromDb;
        } catch (Exception ignored) {}
        return inMemoryStore.values().stream().filter(r -> r.getPrn().equalsIgnoreCase(prn)).findFirst();
    }

    public StudentResult saveResult(StudentResult result) {
        result.calculateResultMetrics();
        if (result.getId() == null || result.getId().trim().isEmpty()) {
            result.setId(UUID.randomUUID().toString());
        }
        inMemoryStore.put(result.getId(), result);
        try {
            return resultRepository.save(result);
        } catch (Exception e) {
            return result;
        }
    }

    public Optional<StudentResult> updateResult(String id, StudentResult updatedResult) {
        updatedResult.setId(id);
        updatedResult.calculateResultMetrics();
        inMemoryStore.put(id, updatedResult);

        try {
            resultRepository.save(updatedResult);
        } catch (Exception ignored) {}

        return Optional.of(updatedResult);
    }

    public boolean deleteResult(String id) {
        boolean removed = inMemoryStore.remove(id) != null;
        try {
            if (resultRepository.existsById(id)) {
                resultRepository.deleteById(id);
                return true;
            }
        } catch (Exception ignored) {}
        return removed;
    }

    public StudentResult calculateMetricsOnly(StudentResult inputResult) {
        inputResult.calculateResultMetrics();
        return inputResult;
    }

    public Map<String, Object> getAnalytics() {
        List<StudentResult> results = getAllResults(null, null);
        Map<String, Object> analytics = new HashMap<>();

        int totalStudents = results.size();
        long passCount = results.stream().filter(r -> "PASS".equalsIgnoreCase(r.getResultStatus())).count();
        long failCount = totalStudents - passCount;
        double passPercentage = totalStudents > 0 ? (double) passCount / totalStudents * 100.0 : 0.0;

        double avgSgpa = results.stream().mapToDouble(StudentResult::getSgpa).average().orElse(0.0);
        double maxSgpa = results.stream().mapToDouble(StudentResult::getSgpa).max().orElse(0.0);

        Map<String, Integer> gradeDistribution = new HashMap<>();
        for (StudentResult r : results) {
            String g = r.getOverallGrade() != null ? r.getOverallGrade() : "Unknown";
            gradeDistribution.put(g, gradeDistribution.getOrDefault(g, 0) + 1);
        }

        analytics.put("totalStudents", totalStudents);
        analytics.put("passCount", passCount);
        analytics.put("failCount", failCount);
        analytics.put("passPercentage", Math.round(passPercentage * 100.0) / 100.0);
        analytics.put("avgSgpa", Math.round(avgSgpa * 100.0) / 100.0);
        analytics.put("maxSgpa", Math.round(maxSgpa * 100.0) / 100.0);
        analytics.put("gradeDistribution", gradeDistribution);

        return analytics;
    }
}
