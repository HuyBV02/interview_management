package com.example.interviewback.controller.candidate;

import com.example.interviewback.commons.constant.status.CandidateStatus;
import com.example.interviewback.commons.request.NoteRequest;
import com.example.interviewback.commons.request.SearchRequest;
import com.example.interviewback.commons.request.candidate.CandidateRequest;
import com.example.interviewback.commons.response.DfResponse;
import com.example.interviewback.commons.response.PageResponse;
import com.example.interviewback.commons.response.candidate.CandidateResponse;
import com.example.interviewback.commons.response.candidate.SimpleCandidateResponse;
import com.example.interviewback.service.candidate.CandidateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/candidate")
@RequiredArgsConstructor
@CrossOrigin
public class CandidateController {
    private final CandidateService candidateService;

    @PostMapping("")
    public DfResponse<CandidateResponse> create(@Valid @RequestBody CandidateRequest candidateRequest) {
        return DfResponse.ok(candidateService.create(candidateRequest));
    }

    @GetMapping("/{id}")
    public DfResponse<CandidateResponse> getDetail(@PathVariable Long id) {
        return DfResponse.ok(candidateService.getById(id));
    }

    @PutMapping("/{id}")
    public DfResponse<CandidateResponse> update(@PathVariable Long id, @Valid @RequestBody CandidateRequest candidateRequest) {
        return DfResponse.ok(candidateService.update(id, candidateRequest));
    }


    @PutMapping("/{id}/ban")
    public DfResponse<CandidateResponse> ban(@PathVariable Long id, @RequestBody(required = false) NoteRequest noteRequest) {
        return DfResponse.ok(candidateService.updateStatus(id, CandidateStatus.BANNED, noteRequest));
    }

    @GetMapping("")
    public DfResponse getList() {
        return DfResponse.ok(candidateService.getListCandidate());
    }

    @PostMapping("/list")
    public DfResponse<PageResponse<CandidateResponse>> getList(@RequestParam("page") Integer page,
                                                               @RequestParam("limit") Integer limit,
                                                               @RequestBody SearchRequest searchRequest) {
        return DfResponse.ok(candidateService.getList(
                searchRequest.setFieldValue(searchRequest.getFieldValue().trim()), page, limit));
    }

    @GetMapping("/list")
    public DfResponse<List<SimpleCandidateResponse>> getListForInterview(@RequestParam("search") String searchValue) {
        return DfResponse.ok(candidateService.getListNotBanned(searchValue.trim(), CandidateStatus.OPEN.getCode()));
    }

    @GetMapping("/list/passed")
    public DfResponse<List<SimpleCandidateResponse>> getListForOffer(@RequestParam("search") String searchValue) {
        return DfResponse.ok(candidateService.getListNotBanned(searchValue.trim(), CandidateStatus.PASSED_INTERVIEW.getCode()));
    }

    @DeleteMapping("/{id}")
    public DfResponse<CandidateResponse> delete(@PathVariable Long id) {
        return DfResponse.ok(candidateService.delete(id));
    }

//    @PostMapping("/uploadCv")
//    public ResponseEntity<?> uploadCandidateCv(
//            @RequestParam("file") MultipartFile file,
//            @RequestParam("candidateRequest") String candidateRequestJson) {
//        try {
//            CandidateRequest candidateRequest = objectMapper.readValue(candidateRequestJson, CandidateRequest.class);
//            String fileUrl = candidateService.uploadCandidateCv(file, candidateRequest);
//            return ResponseEntity.ok(DfResponse.ok(fileUrl));
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body(DfResponse.error(500, e.getMessage()));
//        }
//    }

//    @PostMapping("/upload")
//    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
//        try {
//            String fileUrl = candidateService.uploadFile(file);
//            return ResponseEntity.ok(fileUrl);
//        } catch (IOException e) {
//            return ResponseEntity.status(500).body("File upload failed");
//        }
//    }

    @PostMapping("/upload")
    public DfResponse<String> uploadCV(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = candidateService.uploadFile(file);
            return DfResponse.ok(fileUrl);
        } catch (Exception e) {
            return DfResponse.error(465, "File upload failed");
        }
    }
}
