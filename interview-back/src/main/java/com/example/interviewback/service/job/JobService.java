package com.example.interviewback.service.job;

import com.example.interviewback.commons.request.SearchRequest;
import com.example.interviewback.commons.request.job.JobRequest;
import com.example.interviewback.commons.response.PageResponse;
import com.example.interviewback.commons.response.job.JobResponse;
import com.example.interviewback.config.exception.ApiException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface JobService {
    JobResponse create(JobRequest jobRequest);

    JobResponse findById(Long id);

    JobResponse update(Long id, JobRequest jobRequest);

    List<JobResponse> findAllOpenJobs();

    PageResponse<JobResponse> getList(SearchRequest searchRequest, Integer page, Integer limit);

    PageResponse<JobResponse> getListOpeningPage(SearchRequest searchRequest, Integer page, Integer limit);
    JobResponse delete(Long id);

    String importJobs(MultipartFile file, Boolean toValid);
}
