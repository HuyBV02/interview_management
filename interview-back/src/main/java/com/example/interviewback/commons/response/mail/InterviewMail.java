package com.example.interviewback.commons.response.mail;

import com.example.interviewback.commons.constant.attributes.Position;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InterviewMail {
    private String title;
    private String date;
    private String startTime;
    private String endTime;
    private String location;
    private String meetingId;
    private String candidateName;
    private Position position;
    private String recruiter;
    private String jobTitle;
    private String note;
    private String cv;
}
