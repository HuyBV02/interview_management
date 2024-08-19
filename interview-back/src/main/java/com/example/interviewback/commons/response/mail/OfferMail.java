package com.example.interviewback.commons.response.mail;

import com.example.interviewback.commons.constant.attributes.ContractType;
import com.example.interviewback.commons.constant.attributes.Department;
import com.example.interviewback.commons.constant.attributes.Level;
import com.example.interviewback.commons.constant.attributes.Position;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OfferMail {
    private Long offerId;
    private String dueDate;
    private String startContract;
    private String endContract;
    private String basicSalary;
    private String note;
    private ContractType contractType;
    private Department department;
    private Position position;
    private Level level;
    private String candidateName;
    private String recruiter;
}
