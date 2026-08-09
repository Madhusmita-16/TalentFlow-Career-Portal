package com.talentflow.careerportal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "screening_questions")
public class ScreeningQuestion {

    public enum QuestionType {
        TEXT, YES_NO, SINGLE_CHOICE, MULTIPLE_CHOICE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    @JsonIgnore
    private Job job;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Enumerated(EnumType.STRING)
    @Column(name = "question_type", nullable = false)
    private QuestionType questionType = QuestionType.TEXT;

    @Column(name = "options_json", columnDefinition = "TEXT")
    private String optionsJson; // Comma separated or JSON string for choices

    @Column(name = "is_required")
    private boolean required = true;

    public ScreeningQuestion() {}

    public ScreeningQuestion(Job job, String questionText, QuestionType questionType, String optionsJson, boolean required) {
        this.job = job;
        this.questionText = questionText;
        this.questionType = questionType;
        this.optionsJson = optionsJson;
        this.required = required;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Job getJob() { return job; }
    public void setJob(Job job) { this.job = job; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public QuestionType getQuestionType() { return questionType; }
    public void setQuestionType(QuestionType questionType) { this.questionType = questionType; }

    public String getOptionsJson() { return optionsJson; }
    public void setOptionsJson(String optionsJson) { this.optionsJson = optionsJson; }

    public boolean isRequired() { return required; }
    public void setRequired(boolean required) { this.required = required; }
}
