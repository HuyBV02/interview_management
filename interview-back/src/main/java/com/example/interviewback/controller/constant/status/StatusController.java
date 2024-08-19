package com.example.interviewback.controller.constant.status;

import com.example.interviewback.commons.constant.status.*;
import com.example.interviewback.commons.constant.status.CandidateStatus;
import com.example.interviewback.commons.constant.status.JobStatus;
import com.example.interviewback.commons.response.DfResponse;
import com.example.interviewback.util.EnumUtil;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/status")
public class StatusController {
    @GetMapping("/candidate_status")
    public DfResponse<List<Map<String, Object>>> getCandidateStatus() {
        return DfResponse.ok(EnumUtil.getAll(CandidateStatus.class));
    }

    @GetMapping("/interview_status")
    public DfResponse<List<Map<String, Object>>> getInterviewStatus() {
        return DfResponse.ok(EnumUtil.getAll(InterviewStatus.class));
    }

    @GetMapping("/job_status")
    public DfResponse<List<Map<String, Object>>> getJobStatus() {
        return DfResponse.ok(EnumUtil.getAll(JobStatus.class));
    }

    @GetMapping("/offer_status")
    public DfResponse<List<Map<String, Object>>> getOfferStatus() {
        return DfResponse.ok(EnumUtil.getAll(OfferStatus.class));
    }

    @GetMapping("/user_status")
    public DfResponse<List<Map<String, Object>>> getUserStatus() {
        return DfResponse.ok(EnumUtil.getAll(UserStatus.class));
    }
}
