package com.example.interviewback.service.candidate;

import com.example.interviewback.commons.constant.status.CandidateStatus;
import com.example.interviewback.commons.request.NoteRequest;
import com.example.interviewback.commons.request.SearchRequest;
import com.example.interviewback.commons.request.candidate.CandidateRequest;
import com.example.interviewback.commons.response.PageResponse;
import com.example.interviewback.commons.response.candidate.CandidateResponse;
import com.example.interviewback.commons.response.candidate.SimpleCandidateResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface CandidateService {
    CandidateResponse create(CandidateRequest candidateRequest);
    CandidateResponse createPublic(CandidateRequest candidateRequest);

    CandidateResponse getById(Long id);

    CandidateResponse update(Long id, CandidateRequest candidateRequest);

    CandidateResponse updateStatus(Long id, CandidateStatus status, NoteRequest note);

    List<CandidateResponse> getListCandidate();

    PageResponse<CandidateResponse> getList(SearchRequest searchRequest, Integer page, Integer limit);

    List<SimpleCandidateResponse> getListNotBanned(String searchValue, Integer status);

    CandidateResponse delete(Long id);

    //String uploadCandidateCv(MultipartFile file, CandidateRequest candidateRequest) throws IOException;

    String uploadFile(MultipartFile file) throws IOException;
}
