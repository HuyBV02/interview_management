package com.example.interviewback.config.annotion;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class DateRangeValidator implements ConstraintValidator<ValidDateRange, Object> {

    private String startDateField;
    private String endDateField;

    @Override
    public void initialize(ValidDateRange constraintAnnotation) {
        this.startDateField = constraintAnnotation.startDateField();
        this.endDateField = constraintAnnotation.endDateField();
    }

    @Override
    public boolean isValid(Object obj, ConstraintValidatorContext context) {
        try {
            Field startField = obj.getClass().getDeclaredField(startDateField);
            Field endField = obj.getClass().getDeclaredField(endDateField);

            startField.setAccessible(true);
            endField.setAccessible(true);

            Object startValue = startField.get(obj);
            Object endValue = endField.get(obj);

            if (startValue == null || endValue == null) {
                return true;
            }

            if (startValue instanceof LocalDate && endValue instanceof LocalDate) {
//                return ((LocalDate) endValue).isAfter((LocalDate) startValue);
                if (!((LocalDate) endValue).isAfter((LocalDate) startValue)) {
                    context.buildConstraintViolationWithTemplate(context.getDefaultConstraintMessageTemplate())
                            .addPropertyNode(endDateField)
                            .addConstraintViolation()
                            .disableDefaultConstraintViolation();
                    return false;
                }
                return true;
            }

            if (startValue instanceof LocalDateTime && endValue instanceof LocalDateTime) {
//                return ((LocalDateTime) endValue).isAfter((LocalDateTime) startValue);
                if (!((LocalDateTime) endValue).isAfter((LocalDateTime) startValue)) {
                    context.buildConstraintViolationWithTemplate(context.getDefaultConstraintMessageTemplate())
                            .addPropertyNode(endDateField)
                            .addConstraintViolation()
                            .disableDefaultConstraintViolation();
                    return false;
                }
                return true;
            }

            return false;
        } catch (NoSuchFieldException | IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }
}
