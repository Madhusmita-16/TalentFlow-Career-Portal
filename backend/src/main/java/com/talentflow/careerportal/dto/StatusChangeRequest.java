package com.talentflow.careerportal.dto;

public class StatusChangeRequest {
    private String status;
    private String notes;

    public StatusChangeRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
