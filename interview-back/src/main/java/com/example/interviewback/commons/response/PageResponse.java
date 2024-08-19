package com.example.interviewback.commons.response;

import lombok.Builder;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

@Data
@Builder
@Accessors(chain = true)
public class PageResponse<T> {
    private Long total;
    private Integer page;
    private Integer limit;
    private Boolean preLoadAble;
    private Boolean loadMoreAble;
    private List<T> items;
}
