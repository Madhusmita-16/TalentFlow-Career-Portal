package com.talentflow.careerportal.dto;

public class ScreeningQuestionDto {
    private Long id;
    private String questionText;
    private String questionType;
    private String optionsJson;
    private boolean required;

    public ScreeningQuestionDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getQuestionType() { return questionType; }
    public void setQuestionType(String questionType) { this.questionType = questionType; }

    public String getOptionsJson() { return optionsJson; }
    public void setOptionsJson(String optionsJson) { this.optionsJson = optionsJson; }

    public boolean isRequired() { return required; }
    public void setRequired(boolean required) { this.required = required; }
}
