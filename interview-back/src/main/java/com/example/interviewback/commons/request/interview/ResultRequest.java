package com.example.interviewback.commons.request.interview;

import com.example.interviewback.commons.constant.attributes.Result;
import lombok.Data;

@Data
public class ResultRequest {
    private String result;
    private String note;
    private String fileNote;
}
