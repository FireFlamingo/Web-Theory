package com.vit.results.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class SubjectMarks {

    @NotBlank(message = "Subject code is required")
    private String subjectCode;

    @NotBlank(message = "Subject name is required")
    private String subjectName;

    @Min(value = 1, message = "Credits must be at least 1")
    private int credits;

    @Min(value = 0, message = "MSE Marks cannot be negative")
    @Max(value = 30, message = "MSE Marks cannot exceed 30")
    private double mseMarks;

    @Min(value = 0, message = "ESE Marks cannot be negative")
    @Max(value = 70, message = "ESE Marks cannot exceed 70")
    private double eseMarks;

    private double totalCombinedMark;
    private String letterGrade;
    private int gradePoint;

    public SubjectMarks() {}

    public SubjectMarks(String subjectCode, String subjectName, int credits, double mseMarks, double eseMarks) {
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.credits = credits;
        this.mseMarks = mseMarks;
        this.eseMarks = eseMarks;
        this.calculateMarksAndGrade();
    }

    public void calculateMarksAndGrade() {
        // Combined score: MSE (30%) + ESE (70%)
        // If MSE is out of 30 and ESE out of 70, total is mseMarks + eseMarks
        this.totalCombinedMark = Math.round((this.mseMarks + this.eseMarks) * 100.0) / 100.0;
        
        // Grade allocation based on VIT Grading System
        if (this.totalCombinedMark >= 90) {
            this.letterGrade = "S";
            this.gradePoint = 10;
        } else if (this.totalCombinedMark >= 80) {
            this.letterGrade = "A";
            this.gradePoint = 9;
        } else if (this.totalCombinedMark >= 70) {
            this.letterGrade = "B";
            this.gradePoint = 8;
        } else if (this.totalCombinedMark >= 60) {
            this.letterGrade = "C";
            this.gradePoint = 7;
        } else if (this.totalCombinedMark >= 50) {
            this.letterGrade = "D";
            this.gradePoint = 6;
        } else if (this.totalCombinedMark >= 40) {
            this.letterGrade = "P";
            this.gradePoint = 5;
        } else {
            this.letterGrade = "F";
            this.gradePoint = 0;
        }
    }

    // Getters and Setters
    public String getSubjectCode() {
        return subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public int getCredits() {
        return credits;
    }

    public void setCredits(int credits) {
        this.credits = credits;
    }

    public double getMseMarks() {
        return mseMarks;
    }

    public void setMseMarks(double mseMarks) {
        this.mseMarks = mseMarks;
    }

    public double getEseMarks() {
        return eseMarks;
    }

    public void setEseMarks(double eseMarks) {
        this.eseMarks = eseMarks;
    }

    public double getTotalCombinedMark() {
        return totalCombinedMark;
    }

    public void setTotalCombinedMark(double totalCombinedMark) {
        this.totalCombinedMark = totalCombinedMark;
    }

    public String getLetterGrade() {
        return letterGrade;
    }

    public void setLetterGrade(String letterGrade) {
        this.letterGrade = letterGrade;
    }

    public int getGradePoint() {
        return gradePoint;
    }

    public void setGradePoint(int gradePoint) {
        this.gradePoint = gradePoint;
    }
}
