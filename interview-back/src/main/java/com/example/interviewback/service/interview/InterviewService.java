package com.example.interviewback.service.interview;

import com.example.interviewback.commons.constant.attributes.Result;
import com.example.interviewback.commons.constant.status.InterviewStatus;
import com.example.interviewback.commons.entity.interview.Interview;
import com.example.interviewback.commons.request.NoteRequest;
import com.example.interviewback.commons.request.SearchRequest;
import com.example.interviewback.commons.request.interview.InterviewRequest;
import com.example.interviewback.commons.request.interview.ResultRequest;
import com.example.interviewback.commons.response.PageResponse;
import com.example.interviewback.commons.response.interview.InterviewResponse;
import com.example.interviewback.commons.response.interview.SimpleInterviewResponse;
import com.example.interviewback.config.exception.ApiException;

import java.util.List;

public interface InterviewService {
    InterviewResponse create(InterviewRequest interviewRequest);

    InterviewResponse getById(Long id);

    InterviewResponse update(Long id, InterviewRequest interviewRequest);

    InterviewResponse delete(Long id);
    InterviewResponse submit(Long id, ResultRequest resultRequest);
    InterviewResponse updateStatus(Long id, InterviewStatus status, NoteRequest noteRequest);
    InterviewResponse remindInterview(Long id);
    PageResponse<InterviewResponse> getList(SearchRequest searchRequest, Integer page, Integer limit);
    List<InterviewResponse> getListByCandidateId(Long candidateId);
    PageResponse<InterviewResponse> getListByInterviewer(SearchRequest searchRequest, Integer page, Integer limit, Long interviewerId);
    public void sendMail(Interview interview, String subject);
}
