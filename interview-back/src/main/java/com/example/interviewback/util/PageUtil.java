package com.example.interviewback.util;

import com.example.interviewback.commons.entity.interview.ScheduledInterview;
import com.example.interviewback.commons.request.SearchRequest;
import com.example.interviewback.commons.response.PageResponse;
import com.example.interviewback.config.annotion.Search;
import jakarta.persistence.criteria.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class PageUtil {
    public static Pageable sortedMultiple(int page, int limit, List<String> cols) {
        return PageRequest.of(page - 1, limit,
                Sort.by(List.of(Sort.Order.asc(cols.get(0)), Sort.Order.desc(cols.get(1)))));
    }

    public static <T, E> PageResponse<T> toPageResponse(Page<E> pageEntities, int page, int limit, List<T> items) {
        return PageResponse.<T>builder()
                .total(pageEntities.getTotalElements())
                .page(page)
                .limit(limit)
                .preLoadAble(page != 1)
                .loadMoreAble(pageEntities.getTotalPages() > page)
                .items(items)
                .build();
    }

    public static <T> Specification<T> buildSpecification(Class<T> entityClass, SearchRequest searchRequest) {
        String fieldValue = searchRequest.getFieldValue();
        List<Specification<T>> fieldSpecifications = new ArrayList<>();

        for (Field field : entityClass.getDeclaredFields()) {
            String fieldName = field.getName();
            Class<?> fieldType = field.getType();
            if (field.isAnnotationPresent(Search.class)) {
                if (fieldType == LocalDate.class) fieldSpecifications.add(byDateField(fieldName, fieldValue));
                else if (fieldType == LocalDateTime.class)
                    fieldSpecifications.add(byDateTimeField(fieldName, fieldValue));
                else fieldSpecifications.add(byField(fieldName, fieldValue));
            }
        }

        Specification<T> fieldSpec = inStatus(searchRequest.getStatusCodes());
        if (!fieldSpecifications.isEmpty()) {
            for (Specification<T> spec : fieldSpecifications) {
                fieldSpec = Specification.where(fieldSpec).or(spec);
            }
        }
        return fieldSpec;
    }

    private static <T> Specification<T> inStatus(List<Integer> statusCodes) {
        return (root, query, builder) -> root.get("status").in(statusCodes);
    }

    private static <T> Specification<T> byField(String fieldName, String fieldValue) {
        return (root, query, builder) -> builder.like(root.get(fieldName), "%" + fieldValue + "%");
    }

    private static <T> Specification<T> byDateField(String fieldName, String searchValue) {
        return (root, query, builder) -> builder.like(
                builder.function("DATE_FORMAT", String.class, root.get(fieldName), builder.literal("%d-%m-%Y")),
                "%" + searchValue + "%"
        );
    }

    private static <T> Specification<T> byDateTimeField(String fieldName, String searchValue) {
        return (root, query, builder) -> builder.like(
                builder.function("DATE_FORMAT", String.class, root.get(fieldName), builder.literal("%d-%m-%Y %H:%i:%s")),
                "%" + searchValue + "%"
        );
    }

    public static <T> Specification<T> byListInterviewers(String fieldValue) {
        return (root, query, builder) -> {
            query.distinct(true);

            Subquery<Long> subquery = query.subquery(Long.class);
            Root<ScheduledInterview> subRoot = subquery.from(ScheduledInterview.class);
            Join<Object, Object> interviewJoin = subRoot.join("interview", JoinType.INNER);
            Join<Object, Object> userJoin = subRoot.join("interviewer", JoinType.INNER);

            subquery.select(interviewJoin.get("interviewId"))
                    .where(builder.like(userJoin.get("fullName"), "%" + fieldValue + "%"));

            return builder.in(root.get("interviewId")).value(subquery);
        };
    }

    public static <T> Specification<T> byStatus(Integer statusCode) {
        return (root, query, builder) ->
                statusCode != -1 ? builder.equal(root.get("status"), statusCode) : builder.conjunction();
    }

    public static <T> Specification<T> byRole(Integer roleId) {
        return (root, query, builder) -> roleId != -1
                ? builder.equal(root.join("role", JoinType.INNER).get("roleId"), roleId)
                : builder.conjunction();
    }

    public static <T> Specification<T> byNestedField(String nestedEntityName, String nestedFieldName, String fieldValue) {
        return (root, query, builder) ->
                builder.like(root.join(nestedEntityName, JoinType.INNER).get(nestedFieldName), "%" + fieldValue + "%");
    }


    public static <T> Specification<T> byCandidate(String fieldValue) {
        return (root, query, builder) -> {
            Join<Object, Object> candidateJoin = root.join("candidate", JoinType.INNER);
            return builder.or(
                    builder.like(candidateJoin.get("fullName"), "%" + fieldValue + "%"),
                    builder.like(candidateJoin.get("email"), "%" + fieldValue + "%"));
        };
    }

    public static <T> Specification<T> byInterviewer(Long interviewerId) {
        return (root, query, builder) ->
                builder.equal(root.join("scheduledInterviews", JoinType.INNER).get("interviewer").get("userId"), interviewerId);
    }

    public static <T> Specification<T> byManager(Long managerId) {
        return (root, query, builder) -> builder.equal(root.get("approver").get("userId"), managerId);
    }

    public static <T> Specification<T> isNotDeleted() {
        return (root, query, builder) -> {
            Predicate isFalse = builder.equal(root.get("isDeleted"), false);
            Predicate isNull = builder.isNull(root.get("isDeleted"));
            return builder.or(isFalse, isNull);
        };
    }
}
