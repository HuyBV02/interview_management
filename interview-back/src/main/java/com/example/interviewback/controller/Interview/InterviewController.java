package com.example.interviewback.controller.Interview;

import com.example.interviewback.commons.constant.status.InterviewStatus;
import com.example.interviewback.commons.request.NoteRequest;
import com.example.interviewback.commons.request.SearchRequest;
import com.example.interviewback.commons.request.interview.InterviewRequest;
import com.example.interviewback.commons.request.interview.ResultRequest;
import com.example.interviewback.commons.response.DfResponse;
import com.example.interviewback.commons.response.PageResponse;
import com.example.interviewback.commons.response.interview.InterviewResponse;
import com.example.interviewback.commons.response.interview.SimpleInterviewResponse;
import com.example.interviewback.service.interview.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/interview")
public class InterviewController {
    private final InterviewService interviewService;

    @PostMapping("")
    public DfResponse<InterviewResponse> create(@Valid @RequestBody InterviewRequest interviewRequest) {
        return DfResponse.ok(interviewService.create(interviewRequest));
    }

    @GetMapping("/{id}")
    public DfResponse<InterviewResponse> getById(@PathVariable Long id) {
        return DfResponse.ok(interviewService.getById(id));
    }

    @PutMapping("/{id}")
    public DfResponse<InterviewResponse> update(@PathVariable Long id, @Valid @RequestBody InterviewRequest interviewRequest) {
        return DfResponse.ok(interviewService.update(id, interviewRequest));
    }

    @DeleteMapping("/{id}")
    public DfResponse<InterviewResponse> delete(@PathVariable Long id) {
        return DfResponse.ok(interviewService.delete(id));
    }

    @PutMapping("/{id}/submit")
    public DfResponse<InterviewResponse> submit(@PathVariable Long id, @RequestBody ResultRequest resultRequest) {
        return DfResponse.ok(interviewService.submit(id, resultRequest));
    }

    @PutMapping("/{id}/cancel")
    public DfResponse<InterviewResponse> cancel(@PathVariable Long id, @RequestBody(required = false) NoteRequest noteRequest) {
        return DfResponse.ok(interviewService.updateStatus(id, InterviewStatus.CANCELLED, noteRequest));
    }

    @GetMapping("/{id}/reminder")
    public DfResponse<InterviewResponse> remindInterview(@PathVariable Long id) {
        return DfResponse.ok(interviewService.remindInterview(id));
    }

    @PostMapping("/list")
    public DfResponse<PageResponse<InterviewResponse>> getList(@RequestParam("page") Integer page,
                                                               @RequestParam("limit") Integer limit,
                                                               @RequestBody SearchRequest searchRequest) {
        return DfResponse.ok(interviewService.getList(
                searchRequest.setFieldValue(searchRequest.getFieldValue().trim()), page, limit));
    }

    @GetMapping("/list/{candidateId}")
    public DfResponse<List<InterviewResponse>> getListByCandidate(@PathVariable Long candidateId) {
        return DfResponse.ok(interviewService.getListByCandidateId(candidateId));
    }

    @PostMapping("/list/{interviewerId}")
    public DfResponse<PageResponse<InterviewResponse>> getListByInterviewer(@RequestParam("page") Integer page,
                                                                            @RequestParam("limit") Integer limit,
                                                                            @RequestBody SearchRequest searchRequest,
                                                                            @PathVariable Long interviewerId) {
        return DfResponse.ok(interviewService.getListByInterviewer(
                searchRequest.setFieldValue(searchRequest.getFieldValue().trim()), page, limit, interviewerId));
    }
}
