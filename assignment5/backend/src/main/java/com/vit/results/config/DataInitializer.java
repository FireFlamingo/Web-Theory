package com.vit.results.config;

import com.vit.results.model.StudentResult;
import com.vit.results.model.SubjectMarks;
import com.vit.results.repository.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ResultRepository resultRepository;

    @Autowired
    public DataInitializer(ResultRepository resultRepository) {
        this.resultRepository = resultRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            if (resultRepository.count() == 0) {
                System.out.println("Initializing MongoDB with default VIT student semester result records...");

                // Student 1: Aarav Sharma
                List<SubjectMarks> s1Subjects = List.of(
                    new SubjectMarks("CS301", "Web Technology", 4, 27.5, 63.0),
                    new SubjectMarks("CS302", "Database Management Systems", 4, 26.0, 65.0),
                    new SubjectMarks("CS303", "Software Engineering", 3, 25.0, 58.5),
                    new SubjectMarks("CS304", "Computer Networks", 3, 28.0, 66.0)
                );
                StudentResult s1 = new StudentResult("22210045", "Aarav Sharma", "311045", "Computer Engineering", 5, s1Subjects);

                // Student 2: Ananya Deshmukh (Distinction)
                List<SubjectMarks> s2Subjects = List.of(
                    new SubjectMarks("CS301", "Web Technology", 4, 29.0, 68.0),
                    new SubjectMarks("CS302", "Database Management Systems", 4, 30.0, 69.0),
                    new SubjectMarks("CS303", "Software Engineering", 3, 28.5, 65.5),
                    new SubjectMarks("CS304", "Computer Networks", 3, 29.5, 67.0)
                );
                StudentResult s2 = new StudentResult("22210089", "Ananya Deshmukh", "321089", "Information Technology", 5, s2Subjects);

                // Student 3: Priya Kulkarni
                List<SubjectMarks> s3Subjects = List.of(
                    new SubjectMarks("CS301", "Web Technology", 4, 22.0, 53.0),
                    new SubjectMarks("CS302", "Database Management Systems", 4, 21.5, 51.0),
                    new SubjectMarks("CS303", "Software Engineering", 3, 23.0, 54.0),
                    new SubjectMarks("CS304", "Computer Networks", 3, 20.0, 48.0)
                );
                StudentResult s3 = new StudentResult("22210102", "Priya Kulkarni", "331102", "AI & Data Science", 5, s3Subjects);

                // Student 4: Vikram Mehta (Fail case)
                List<SubjectMarks> s4Subjects = List.of(
                    new SubjectMarks("CS301", "Web Technology", 4, 11.0, 24.0), // Combined 35 -> Fail
                    new SubjectMarks("CS302", "Database Management Systems", 4, 15.0, 32.0),
                    new SubjectMarks("CS303", "Software Engineering", 3, 14.0, 28.0),
                    new SubjectMarks("CS304", "Computer Networks", 3, 18.0, 36.0)
                );
                StudentResult s4 = new StudentResult("22210250", "Vikram Mehta", "311250", "Computer Engineering", 5, s4Subjects);

                // Student 5: Neha Joshi
                List<SubjectMarks> s5Subjects = List.of(
                    new SubjectMarks("CS301", "Web Technology", 4, 25.0, 60.0),
                    new SubjectMarks("CS302", "Database Management Systems", 4, 24.0, 59.0),
                    new SubjectMarks("CS303", "Software Engineering", 3, 26.0, 62.0),
                    new SubjectMarks("CS304", "Computer Networks", 3, 27.0, 61.0)
                );
                StudentResult s5 = new StudentResult("22210201", "Neha Joshi", "341201", "Electronics & Telecom", 5, s5Subjects);

                resultRepository.saveAll(List.of(s1, s2, s3, s4, s5));
                System.out.println("Successfully seeded 5 default student result records into MongoDB!");
            }
        } catch (Exception e) {
            System.err.println("Note: Could not seed data to MongoDB directly (MongoDB connection pending or offline). Fallback mode active: " + e.getMessage());
        }
    }
}
