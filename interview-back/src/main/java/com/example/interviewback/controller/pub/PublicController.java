package com.example.interviewback.controller.pub;

import com.example.interviewback.commons.request.SearchRequest;
import com.example.interviewback.commons.request.candidate.CandidateRequest;
import com.example.interviewback.commons.response.DfResponse;
import com.example.interviewback.commons.response.PageResponse;
import com.example.interviewback.commons.response.candidate.CandidateResponse;
import com.example.interviewback.commons.response.job.JobResponse;
import com.example.interviewback.commons.response.user.SimpleUserResponse;
import com.example.interviewback.service.candidate.CandidateService;
import com.example.interviewback.service.job.JobService;
import com.example.interviewback.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {
    private final JobService jobService;
    private final CandidateService candidateService;
    private final UserService userService;

    @GetMapping("/job/list/open")
    public DfResponse<List<JobResponse>> findAllOpenJob() {
        return DfResponse.ok(jobService.findAllOpenJobs());
    }

    @PostMapping("/job/list/open_pag")
    public DfResponse<PageResponse<JobResponse>> getListOpeningPage(@RequestParam("page") Integer page,
                                                                    @RequestParam("limit") Integer limit,
                                                                    @RequestBody SearchRequest searchRequest) {
        return DfResponse.ok(jobService.getListOpeningPage(
                searchRequest.setFieldValue(searchRequest.getFieldValue().trim()), page, limit));
    }

    @PostMapping("/candidate")
    public DfResponse<CandidateResponse> create(@Valid @RequestBody CandidateRequest candidateRequest) {
        return DfResponse.ok(candidateService.createPublic(candidateRequest.setIsPublic(true)));
    }

    @PostMapping("/candidate/upload")
    public DfResponse<String> uploadCV(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = candidateService.uploadFile(file);
            return DfResponse.ok(fileUrl);
        } catch (Exception e) {
            return DfResponse.error(465, "File upload failed");
        }
    }

    @GetMapping("/user/list/{roleId}/tempt")
    public DfResponse<List<SimpleUserResponse>> getListByRole(@PathVariable Long roleId) {
        return DfResponse.ok(userService.getListByRole(roleId));
    }

    @GetMapping("/user/list/{roleId}")
    public DfResponse<List<SimpleUserResponse>> searchByRole(@PathVariable Long roleId,
                                                             @RequestParam("search") String searchValue) {
        return DfResponse.ok(userService.searchByRoleAndName(roleId, searchValue.trim()));
    }
}
