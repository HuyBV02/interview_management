package com.example.interviewback.config.annotion;

import com.example.interviewback.commons.request.job.JobRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class SalaryRangeValidator implements ConstraintValidator<ValidSalaryRange, JobRequest> {

    @Override
    public boolean isValid(JobRequest jobRequest, ConstraintValidatorContext context) {
        if (jobRequest.getSalaryFrom() == null || jobRequest.getSalaryTo() == null) {
            return true;
        }
        boolean isValid = jobRequest.getSalaryTo() > jobRequest.getSalaryFrom();
        if (!isValid) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Salary to must be greater than salary from")
                    .addPropertyNode("salaryTo")
                    .addConstraintViolation();
        }
        return isValid;
    }
}
