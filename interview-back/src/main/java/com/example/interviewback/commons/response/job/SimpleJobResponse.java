package com.example.interviewback.commons.response.job;

import com.example.interviewback.commons.constant.attributes.Department;
import com.example.interviewback.commons.constant.attributes.Level;
import com.example.interviewback.commons.constant.attributes.Skill;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimpleJobResponse {
    private Long jobId;
    private String title;
    private List<Skill> skills;
    private Department department;
    private List<Level> levels;
}
