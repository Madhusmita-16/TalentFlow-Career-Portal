package com.talentflow.careerportal.dto;

public class ScreeningAnswerDto {
    private Long questionId;
    private String questionText;
    private String answerText;

    public ScreeningAnswerDto() {}

    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getAnswerText() { return answerText; }
    public void setAnswerText(String answerText) { this.answerText = answerText; }
}
