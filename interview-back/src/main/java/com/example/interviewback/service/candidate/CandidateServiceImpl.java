package com.example.interviewback.service.candidate;

import com.example.interviewback.commons.constant.attributes.Skill;
import com.example.interviewback.commons.constant.status.CandidateStatus;
import com.example.interviewback.commons.entity.candidate.Candidate;
import com.example.interviewback.commons.entity.candidate.CandidateJob;
import com.example.interviewback.commons.entity.key.CandidateJobKey;
import com.example.interviewback.commons.entity.user.User;
import com.example.interviewback.commons.request.NoteRequest;
import com.example.interviewback.commons.request.SearchRequest;
import com.example.interviewback.commons.request.candidate.CandidateRequest;
import com.example.interviewback.commons.response.PageResponse;
import com.example.interviewback.commons.response.candidate.CandidateResponse;
import com.example.interviewback.commons.response.candidate.SimpleCandidateResponse;
import com.example.interviewback.commons.response.job.SimpleJobResponse;
import com.example.interviewback.commons.response.mail.CandidateMail;
import com.example.interviewback.config.exception.ApiException;
import com.example.interviewback.repository.candidate.CandidateJobRepository;
import com.example.interviewback.repository.candidate.CandidateRepository;
import com.example.interviewback.repository.interview.InterviewRepository;
import com.example.interviewback.repository.interview.ScheduledInterviewRepository;
import com.example.interviewback.repository.offer.OfferRepository;
import com.example.interviewback.repository.user.UserRepository;
import com.example.interviewback.service.mail.MailService;
import com.example.interviewback.util.CandidateMapper;
import com.example.interviewback.util.PageUtil;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.context.Context;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.example.interviewback.util.AuthUtil.loggedId;

@Service
@RequiredArgsConstructor
public class CandidateServiceImpl implements CandidateService {
    private final CandidateRepository candidateRepository;
    private final CandidateJobRepository candidateJobRepository;
    private final InterviewRepository interviewRepository;
    private final OfferRepository offerRepository;
    private final UserRepository userRepository;
    private final MailService mailService;
    private final ScheduledInterviewRepository scheduledInterviewRepository;

    @Override
    public CandidateResponse create(CandidateRequest candidateRequest) {
        Candidate candidate = CandidateMapper.toEntity(candidateRequest);
        candidate.setStatus(CandidateStatus.OPEN.getCode());
        if (!candidateRequest.getIsPublic()) candidate.setCreatedBy(loggedId());
        candidate.setCreatedAt(LocalDateTime.now());

        try {
            candidateRepository.save(candidate);
        } catch (DataIntegrityViolationException e) {
            throw new ApiException(400, "Email already exists!");
        }

        Long candidateId = candidate.getCandidateId();

        Set<CandidateJob> candidateJobs = candidateRequest.getJobs()
                .stream()
                .map(j -> CandidateJob.builder()
                        .id(CandidateJobKey.builder()
                                .candidateId(candidateId)
                                .jobId(j.getJobId())
                                .build())
                        .cv(j.getCv())
                        .build())
                .collect(Collectors.toSet());
        candidateJobRepository.saveAll(candidateJobs);

        if (candidate.getCandidateJobs() == null) candidate.setCandidateJobs(new ArrayList<>());
        return CandidateMapper.toResponse(candidate);
    }

    @Override
    public CandidateResponse createPublic(CandidateRequest candidateRequest) {
        Candidate candidate = CandidateMapper.toEntity(candidateRequest);
        candidate.setStatus(CandidateStatus.OPEN.getCode());
        if (!candidateRequest.getIsPublic()) candidate.setCreatedBy(loggedId());
        candidate.setCreatedAt(LocalDateTime.now());

        try {
            candidateRepository.save(candidate);
        } catch (DataIntegrityViolationException e) {
            candidate = candidateRepository.findByEmail(candidate.getEmail());
            candidate = CandidateMapper.toEntity(candidate, candidateRequest);
        }

        Long candidateId = candidate.getCandidateId();

        Set<CandidateJob> candidateJobs = candidateRequest.getJobs()
                .stream()
                .map(j -> CandidateJob.builder()
                        .id(CandidateJobKey.builder()
                                .candidateId(candidateId)
                                .jobId(j.getJobId())
                                .build())
                        .cv(j.getCv())
                        .build())
                .collect(Collectors.toSet());
        candidateJobRepository.saveAll(candidateJobs);

        if (candidate.getCandidateJobs() == null) candidate.setCandidateJobs(new ArrayList<>());
        return CandidateResponse.builder().candidateId(candidateId).build();
    }

    @Override
    public CandidateResponse getById(Long id) {
        Candidate candidate = candidateRepository.findById(id).orElseThrow(() -> new ApiException(404, "Candidate not found!"));
        return CandidateMapper.toResponse(candidate);
    }

    @Override
    public CandidateResponse update(Long id, CandidateRequest candidateRequest) {
        Candidate candidate = candidateRepository.findById(id).orElseThrow(() -> new ApiException(404, "Candidate not found!"));
        List<CandidateJob> oldJobs = candidate.getCandidateJobs();
        List<CandidateJob> newJobs = candidateRequest.getJobs().stream()
                .map(j -> CandidateJob.builder()
                        .id(CandidateJobKey.builder().candidateId(id).jobId(j.getJobId()).build())
                        .cv(j.getCv())
                        .build())
                .toList();

        candidate = CandidateMapper.toEntity(candidate, candidateRequest);
        candidate.setUpdatedBy(loggedId());
        candidate.setUpdatedAt(LocalDateTime.now());
        try {
            candidateRepository.save(candidate);
        } catch (DataIntegrityViolationException e) {
            throw new ApiException(400, "Email already exists!");
        }
        candidateJobRepository.deleteAll(oldJobs);
        candidateJobRepository.saveAll(newJobs);

        return CandidateMapper.toResponse(candidate);
    }

    @Override
    public CandidateResponse updateStatus(Long id, CandidateStatus status, NoteRequest noteRequest) {
        Candidate candidate = candidateRepository.findById(id).orElseThrow(() -> new ApiException(404, "Candidate not found!"));
        candidate.setStatus(status.getCode());
        if (noteRequest != null && !noteRequest.getNote().equals("")) candidate.setNote(noteRequest.getNote());
        candidate.setUpdatedBy(loggedId());
        candidate.setUpdatedAt(LocalDateTime.now());
        candidateRepository.save(candidate);

        sendMail(candidate);
        return CandidateMapper.toResponse(candidate);
    }

    private void sendMail(Candidate candidate) {
        User recruiter = userRepository.findById(candidate.getRecruiter().getUserId())
                .orElseThrow(() -> new ApiException(404, "Recruiter not found!"));
        CandidateMail mail = CandidateMail.builder()
                .fullName(candidate.getFullName())
                .email(candidate.getEmail())
                .note(candidate.getNote())
                .recruiter(recruiter.getEmail())
                .build();
        Context context = new Context();
        context.setVariable("data", mail);
        mailService.sendEmail(Stream.of(candidate.getEmail()).toArray(String[]::new), "BAN CANDIDATE", "ban_candidate", context);
    }

    @Override
    public List<CandidateResponse> getListCandidate() {
        List<Candidate> candidates = candidateRepository.findAll();
        return candidates.stream()
                .map(CandidateMapper::toResponse)
                .toList();
    }

    @Override
    public PageResponse<CandidateResponse> getList(SearchRequest searchRequest, Integer page, Integer limit) {
        if (page < 1 || limit < 1) throw new ApiException(400, "bad request!");
        Specification<Candidate> specification = PageUtil.buildSpecification(Candidate.class,
                        searchRequest.setStatusCodes(CandidateStatus.findContain(searchRequest.getFieldValue())))
                .or(PageUtil.byNestedField("recruiter", "username", searchRequest.getFieldValue()))
                .and(PageUtil.byStatus(searchRequest.getStatusCode()))
                .and(PageUtil.isNotDeleted());
        Pageable pageable = PageUtil.sortedMultiple(page, limit, List.of("status", "createdAt"));

        Page<Candidate> pages = candidateRepository.findAll(specification, pageable);

        return PageUtil.toPageResponse(pages, page, limit,
                pages.map(CandidateMapper::toResponse).toList());
    }

    @Override
    public List<SimpleCandidateResponse> getListNotBanned(String searchValue, Integer status) {
        List<Candidate> candidates = candidateRepository.findByStatusAndFullName(
                status, searchValue);
        return candidates.stream()
                .map(c -> SimpleCandidateResponse.builder()
                        .candidateId(c.getCandidateId())
                        .fullName(c.getFullName())
                        .position(c.getPosition())
                        .jobs(c.getCandidateJobs().stream()
                                .filter(candidateJob -> candidateJob.getJob().getIsDeleted() == null ||
                                        !candidateJob.getJob().getIsDeleted())
                                .map(candidateJob -> SimpleJobResponse.builder()
                                        .jobId(candidateJob.getJob().getJobId())
                                        .title(candidateJob.getJob().getTitle())
                                        .skills(Arrays.stream(candidateJob.getJob().getSkills().split(", "))
                                                .map(Skill::fromValue).collect(Collectors.toList()))
                                        .build())
                                .collect(Collectors.toList()))
                        .build()).toList();
    }

    @Override
    public CandidateResponse delete(Long id) {
        Candidate candidate = candidateRepository.findById(id).orElseThrow(() -> new ApiException(404, "Candidate not found!"));
        candidate.setIsDeleted(true);
        candidate.setUpdatedBy(loggedId());
        candidate.setUpdatedAt(LocalDateTime.now());

        candidateRepository.save(candidate);
        interviewRepository.deleteByCandidate(id);
        scheduledInterviewRepository.setAvailableByCandidateId(id);
        offerRepository.deleteByCandidate(id);
        return CandidateMapper.toResponse(candidate);
    }

    @Override
    public String uploadFile(MultipartFile multipartFile) throws IOException {
        String objectName = generateFileName(multipartFile);

        FileInputStream serviceAccount = new FileInputStream(
                "interview-back/src/main/resources/interview-management-g5-firebase-adminsdk-ps2qf-df981befe5.json");
        File file = convertMultiPartToFile(multipartFile);
        Path filePath = file.toPath();

        Storage storage = StorageOptions.newBuilder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setProjectId("interview-management-g5")
                .build()
                .getService();
        BlobId blobId = BlobId.of("interview-management-g5.appspot.com", objectName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setMetadata(Map.of("firebaseStorageDownloadTokens", "randomAccessToken"))
                .build();

        Blob blob = storage.create(blobInfo, Files.readAllBytes(filePath));

        return blob.getMediaLink().concat("&token=randomAccessToken");
    }

    private File convertMultiPartToFile(MultipartFile file) throws IOException {
        File convertedFile = new File(Objects.requireNonNull(file.getOriginalFilename()));
        FileOutputStream fos = new FileOutputStream(convertedFile);
        fos.write(file.getBytes());
        fos.close();
        return convertedFile;
    }

    private String generateFileName(MultipartFile multiPart) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy hh:mm:ss.SSSSSS");
        return sdf.format(new Date()) + "-" + Objects.requireNonNull(multiPart.getOriginalFilename()).replace(" ", "_");
    }
}
