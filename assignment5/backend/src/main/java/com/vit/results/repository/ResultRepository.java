package com.vit.results.repository;

import com.vit.results.model.StudentResult;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResultRepository extends MongoRepository<StudentResult, String> {
    
    Optional<StudentResult> findByPrn(String prn);

    List<StudentResult> findByBranch(String branch);

    List<StudentResult> findByStudentNameContainingIgnoreCaseOrPrnContainingIgnoreCase(String studentName, String prn);
}
