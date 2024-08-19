package com.example.interviewback.controller.job;


import com.example.interviewback.commons.request.SearchRequest;
import com.example.interviewback.commons.request.job.JobRequest;
import com.example.interviewback.commons.response.DfResponse;
import com.example.interviewback.commons.response.PageResponse;
import com.example.interviewback.commons.response.job.JobResponse;
import com.example.interviewback.service.job.JobService;
import com.example.interviewback.util.FileUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
@RequestMapping("/api/job")
@RequiredArgsConstructor
public class JobController {
    private final JobService jobService;

    @PostMapping("")
    public DfResponse<JobResponse> create(@Valid @RequestBody JobRequest jobRequest) {
        return DfResponse.ok(jobService.create(jobRequest));
    }

    @GetMapping("/{id}")
    public DfResponse<JobResponse> getDetail(@PathVariable Long id) {
        return DfResponse.ok(jobService.findById(id));
    }

    @PutMapping("/{id}")
    public DfResponse<JobResponse> update(@PathVariable Long id, @Valid @RequestBody JobRequest jobRequest) {
        return DfResponse.ok(jobService.update(id, jobRequest));
    }

    @GetMapping("/list/open")
    public DfResponse<List<JobResponse>> findAllOpenJob() {
        return DfResponse.ok(jobService.findAllOpenJobs());
    }

    @PostMapping("/list")
    public DfResponse<PageResponse<JobResponse>> getList(@RequestParam("page") Integer page,
                                                         @RequestParam("limit") Integer limit,
                                                         @RequestBody SearchRequest searchRequest) {
        return DfResponse.ok(jobService.getList(
                searchRequest.setFieldValue(searchRequest.getFieldValue().trim()), page, limit));
    }

    @PostMapping("/list/open_pag")
    public DfResponse<PageResponse<JobResponse>> getListOpeningPage(@RequestParam("page") Integer page,
                                                                    @RequestParam("limit") Integer limit,
                                                                    @RequestBody SearchRequest searchRequest) {
        return DfResponse.ok(jobService.getListOpeningPage(
                searchRequest.setFieldValue(searchRequest.getFieldValue().trim()), page, limit));
    }

    @DeleteMapping("/{id}")
    public DfResponse<JobResponse> delete(@PathVariable Long id) {
        return DfResponse.ok(jobService.delete(id));
    }

    @PostMapping("/import")
    public DfResponse<String> importJobs(@RequestParam("file") MultipartFile file) {
        String response = jobService.importJobs(file, false);
        return DfResponse.ok(response);
    }

    @PostMapping("/validate-import")
    public DfResponse<String> validateImportJobs(@RequestParam("file") MultipartFile file) {
        if (!FileUtil.isValidExcelFile(file)) {
            return DfResponse.error(400, "Invalid file type. Please upload an .xlsx file.");
        }
        return DfResponse.ok(jobService.importJobs(file, true));
    }
}