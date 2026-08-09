package com.talentflow.careerportal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "screening_answers")
public class ScreeningAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    @JsonIgnore
    private JobApplication application;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "question_id", nullable = false)
    private ScreeningQuestion question;

    @Column(name = "answer_text", columnDefinition = "TEXT")
    private String answerText;

    public ScreeningAnswer() {}

    public ScreeningAnswer(JobApplication application, ScreeningQuestion question, String answerText) {
        this.application = application;
        this.question = question;
        this.answerText = answerText;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public JobApplication getApplication() { return application; }
    public void setApplication(JobApplication application) { this.application = application; }

    public ScreeningQuestion getQuestion() { return question; }
    public void setQuestion(ScreeningQuestion question) { this.question = question; }

    public String getAnswerText() { return answerText; }
    public void setAnswerText(String answerText) { this.answerText = answerText; }
}
