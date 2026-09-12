package com.vit.results.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "student_results")
public class StudentResult {

    @Id
    private String id;

    @NotBlank(message = "PRN is required")
    @Indexed(unique = true)
    private String prn;

    @NotBlank(message = "Student name is required")
    private String studentName;

    @NotBlank(message = "Roll No is required")
    private String rollNo;

    @NotBlank(message = "Branch is required")
    private String branch;

    private int semester = 5;
    private String academicYear = "2025-2026";

    @NotEmpty(message = "Subjects list cannot be empty")
    private List<SubjectMarks> subjects = new ArrayList<>();

    private double totalObtainedMarks;
    private double totalMaxMarks = 400.0;
    private double totalPercentage;
    private double sgpa;
    private String resultStatus;
    private String overallGrade;

    public StudentResult() {}

    public StudentResult(String prn, String studentName, String rollNo, String branch, int semester, List<SubjectMarks> subjects) {
        this.prn = prn;
        this.studentName = studentName;
        this.rollNo = rollNo;
        this.branch = branch;
        this.semester = semester;
        this.subjects = subjects;
        this.calculateResultMetrics();
    }

    public void calculateResultMetrics() {
        if (subjects == null || subjects.isEmpty()) {
            return;
        }

        double totalMarksSum = 0;
        double weightedPointsSum = 0;
        int totalCreditsSum = 0;
        boolean hasFailedSubject = false;

        for (SubjectMarks subject : subjects) {
            subject.calculateMarksAndGrade();
            totalMarksSum += subject.getTotalCombinedMark();
            weightedPointsSum += (subject.getGradePoint() * subject.getCredits());
            totalCreditsSum += subject.getCredits();

            if (subject.getLetterGrade().equals("F") || subject.getTotalCombinedMark() < 40) {
                hasFailedSubject = true;
            }
        }

        this.totalObtainedMarks = Math.round(totalMarksSum * 100.0) / 100.0;
        this.totalMaxMarks = subjects.size() * 100.0;
        this.totalPercentage = Math.round((totalMarksSum / this.totalMaxMarks * 100.0) * 100.0) / 100.0;

        if (totalCreditsSum > 0) {
            this.sgpa = Math.round((weightedPointsSum / totalCreditsSum) * 100.0) / 100.0;
        } else {
            this.sgpa = 0.0;
        }

        if (hasFailedSubject) {
            this.resultStatus = "FAIL";
            this.overallGrade = "Fail";
        } else {
            this.resultStatus = "PASS";
            if (this.sgpa >= 8.0) {
                this.overallGrade = "First Class with Distinction";
            } else if (this.sgpa >= 6.75) {
                this.overallGrade = "First Class";
            } else if (this.sgpa >= 6.0) {
                this.overallGrade = "Higher Second Class";
            } else {
                this.overallGrade = "Pass Class";
            }
        }
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPrn() {
        return prn;
    }

    public void setPrn(String prn) {
        this.prn = prn;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getRollNo() {
        return rollNo;
    }

    public void setRollNo(String rollNo) {
        this.rollNo = rollNo;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public int getSemester() {
        return semester;
    }

    public void setSemester(int semester) {
        this.semester = semester;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public List<SubjectMarks> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<SubjectMarks> subjects) {
        this.subjects = subjects;
    }

    public double getTotalObtainedMarks() {
        return totalObtainedMarks;
    }

    public void setTotalObtainedMarks(double totalObtainedMarks) {
        this.totalObtainedMarks = totalObtainedMarks;
    }

    public double getTotalMaxMarks() {
        return totalMaxMarks;
    }

    public void setTotalMaxMarks(double totalMaxMarks) {
        this.totalMaxMarks = totalMaxMarks;
    }

    public double getTotalPercentage() {
        return totalPercentage;
    }

    public void setTotalPercentage(double totalPercentage) {
        this.totalPercentage = totalPercentage;
    }

    public double getSgpa() {
        return sgpa;
    }

    public void setSgpa(double sgpa) {
        this.sgpa = sgpa;
    }

    public String getResultStatus() {
        return resultStatus;
    }

    public void setResultStatus(String resultStatus) {
        this.resultStatus = resultStatus;
    }

    public String getOverallGrade() {
        return overallGrade;
    }

    public void setOverallGrade(String overallGrade) {
        this.overallGrade = overallGrade;
    }
}
