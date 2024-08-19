package com.example.interviewback.commons.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class SearchRequest {
    private String fieldValue;
    private Integer statusCode = -1;
    private Integer roleId = -1;
    List<Integer> statusCodes;
}
