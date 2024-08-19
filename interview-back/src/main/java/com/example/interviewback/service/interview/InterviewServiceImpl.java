package com.example.interviewback.service.interview;

import com.example.interviewback.commons.constant.attributes.Result;
import com.example.interviewback.commons.constant.status.CandidateStatus;
import com.example.interviewback.commons.constant.status.InterviewStatus;
import com.example.interviewback.commons.entity.candidate.Candidate;
import com.example.interviewback.commons.entity.candidate.CandidateJob;
import com.example.interviewback.commons.entity.interview.Interview;
import com.example.interviewback.commons.entity.interview.ScheduledInterview;
import com.example.interviewback.commons.entity.job.Job;
import com.example.interviewback.commons.entity.key.InterviewKey;
import com.example.interviewback.commons.entity.user.User;
import com.example.interviewback.commons.request.NoteRequest;
import com.example.interviewback.commons.request.SearchRequest;
import com.example.interviewback.commons.request.interview.InterviewRequest;
import com.example.interviewback.commons.request.interview.ResultRequest;
import com.example.interviewback.commons.response.PageResponse;
import com.example.interviewback.commons.response.interview.InterviewResponse;
import com.example.interviewback.commons.response.mail.InterviewMail;
import com.example.interviewback.config.exception.ApiException;
import com.example.interviewback.repository.candidate.CandidateJobRepository;
import com.example.interviewback.repository.candidate.CandidateRepository;
import com.example.interviewback.repository.interview.InterviewRepository;
import com.example.interviewback.repository.interview.ScheduledInterviewRepository;
import com.example.interviewback.repository.job.JobRepository;
import com.example.interviewback.repository.user.UserRepository;
import com.example.interviewback.service.mail.MailService;
import com.example.interviewback.service.schedule.ScheduleService;
import com.example.interviewback.util.InterviewMapper;
import com.example.interviewback.util.PageUtil;
import lombok.RequiredArgsConstructor;
import org.quartz.SchedulerException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.example.interviewback.util.AuthUtil.loggedId;
import static com.example.interviewback.util.AuthUtil.loggedRole;
import static com.example.interviewback.util.TimeUtil.dateTimeToDateString;
import static com.example.interviewback.util.TimeUtil.dateTimeToTimeString;

@Service
@RequiredArgsConstructor
public class InterviewServiceImpl implements InterviewService {
    private final InterviewRepository interviewRepository;
    private final ScheduledInterviewRepository scheduledInterviewRepository;
    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final CandidateJobRepository candidateJobRepository;
    private final MailService mailService;
    private final ScheduleService scheduleService;

    @Override
    public InterviewResponse create(InterviewRequest interviewRequest) {
        Interview interview = InterviewMapper.toEntity(interviewRequest);
        interview.setStatus(InterviewStatus.INVITED.getCode());
        interview.setCreatedBy(loggedId());
        interview.setCreatedAt(LocalDateTime.now());

        Candidate candidate = candidateRepository.findById(interview.getCandidate().getCandidateId()).orElseThrow(() -> new ApiException(404, "Candidate not found!"));
        if (!Objects.equals(candidate.getStatus(), CandidateStatus.OPEN.getCode())
                && !Objects.equals(candidate.getStatus(), CandidateStatus.WAITING_FOR_INTERVIEW.getCode())
                && !Objects.equals(candidate.getStatus(), CandidateStatus.PASSED_INTERVIEW.getCode())
                && !Objects.equals(candidate.getStatus(), CandidateStatus.FAILED_INTERVIEW.getCode())
                && !Objects.equals(candidate.getStatus(), CandidateStatus.CANCELLED_INTERVIEW.getCode())) {
            throw new ApiException(400, "Candidate is not in Open status!");
        }
        candidate.setStatus(CandidateStatus.WAITING_FOR_INTERVIEW.getCode());

        List<Long> userIds = scheduledInterviewRepository.existsOverlappingScheduledInterview(interview.getStartTime(), interview.getEndTime(),
                interviewRequest.getInterviewerIds());
        String notify = "";
        for (Long uid : userIds) {
            User user = userRepository.findById(uid).orElseThrow(() -> new ApiException(404, "User not found!"));
            notify += (user.getFullName() + "-" + user.getUsername() + ", ");
        }
        if (!notify.equals("")) notify = notify.trim().substring(0, notify.length() - 2);
        if (!userIds.isEmpty()) throw new ApiException(409, notify + " has overlaps scheduler");

        interviewRepository.save(interview);
        candidateRepository.save(candidate);
        Long interviewId = interview.getInterviewId();

        Set<ScheduledInterview> scheduledInterviews = interviewRequest.getInterviewerIds()
                .stream()
                .map(s -> ScheduledInterview.builder()
                        .id(InterviewKey.builder().interviewId(interviewId).interviewerId(s).build())
                        .startTime(interview.getStartTime())
                        .endTime(interview.getEndTime())
                        .isAvailable(false)
                        .build())
                .collect(Collectors.toSet());
        scheduledInterviewRepository.saveAll(scheduledInterviews);

        interview.setScheduledInterviews(scheduledInterviews.stream().toList());
        sendMail(interview, "INTERVIEW SCHEDULE");
        reminderBeforeOneHour(interview);
        interview.setScheduledInterviews(new ArrayList<>());
        return InterviewMapper.toResponse(interview);
    }

    private void reminderBeforeOneHour(Interview interview) {
        if (interview.getStartTime().toLocalDate().isEqual(LocalDate.now())) {
            try {
                scheduleService.notifyBeforeInterview(interview);
            } catch (SchedulerException e) {
                throw new ApiException(400, "schedule failed!");
            }
        }
    }

    public void sendMail(Interview interview, String subject) {
        Candidate candidate = candidateRepository.findById(interview.getCandidate().getCandidateId()).orElseThrow(() -> new ApiException(404, "Candidate not found!"));
        User recruiter = userRepository.findById(interview.getRecruit().getUserId()).orElseThrow(() -> new ApiException(404, "Recruiter not found!"));
        Job job = jobRepository.findById(interview.getJob().getJobId()).orElseThrow(() -> new ApiException(404, "Job not found!"));
        CandidateJob candidateJob = candidateJobRepository.findByJobIdAndCandidateId(job.getJobId(), candidate.getCandidateId());
        String[] interviewerMails = userRepository.findByUserIdIn(interview.getScheduledInterviews()
                        .stream().map(s -> s.getId().getInterviewerId()).collect(Collectors.toList()))
                .stream()
                .map(User::getEmail)
                .distinct()
                .toArray(String[]::new);
        String[] candidateMails = Stream.of(candidate.getEmail()).toArray(String[]::new);
        InterviewMail mail = InterviewMail.builder()
                .title(interview.getTitle())
                .date(dateTimeToDateString(interview.getStartTime()))
                .startTime(dateTimeToTimeString(interview.getStartTime()))
                .endTime(dateTimeToTimeString(interview.getEndTime()))
                .location(interview.getLocation())
                .meetingId(interview.getMeetingId())
                .candidateName(candidate.getFullName())
                .position(candidate.getPosition())
                .recruiter(recruiter.getEmail())
                .jobTitle(job.getTitle())
                .note(interview.getNote())
                .cv(candidateJob.getCv())
                .build();

        if (subject.equals("INTERVIEW TODAY")) mail.setDate("today");
        if (!Objects.equals(interview.getStatus(), InterviewStatus.CANCELLED.getCode())) {
            sendMail(mail, subject, interviewerMails, "interview");
            sendMail(mail, subject, candidateMails, "interview_candidate");
        } else {
            sendMail(mail, subject, interviewerMails, "cancel_interview");
            sendMail(mail, subject, candidateMails, "cancel_interview_candidate");
        }
    }

    private void sendMail(InterviewMail mail, String subject, String[] emails, String template) {
        Context context = new Context();
        context.setVariable("data", mail);
        mailService.sendEmail(emails, subject, template, context);
    }

    @Override
    public InterviewResponse getById(Long id) {
        Interview interview = interviewRepository.findById(id).orElseThrow(() -> new ApiException(404, "Interview schedule not found!"));
        return InterviewMapper.toResponse(interview);
    }

    @Override
    public InterviewResponse update(Long id, InterviewRequest interviewRequest) {
        Interview interview = interviewRepository.findById(id).orElseThrow(() -> new ApiException(404, "Interview schedule not found!"));
        interview = InterviewMapper.toEntity(interview, interviewRequest);
        List<ScheduledInterview> oldSchedules = interview.getScheduledInterviews();

//        Candidate candidate = candidateRepository.findById(interview.getCandidate().getCandidateId()).orElseThrow(() -> new ApiException(404, "Candidate not found!"));
//        if (!Objects.equals(candidate.getStatus(), CandidateStatus.OPEN.getCode())) {
//            throw new ApiException(400, "Candidate is not in Open status!");
//        }
//        candidate.setStatus(CandidateStatus.WAITING_FOR_INTERVIEW.getCode());

        List<Long> userIds = scheduledInterviewRepository.existsOverlappingScheduledInterview(interview.getStartTime(), interview.getEndTime(),
                interviewRequest.getInterviewerIds(), id);
        String notify = "";
        for (Long uid : userIds) {
            User user = userRepository.findById(uid).orElseThrow(() -> new ApiException(404, "User not found!"));
            notify += (user.getFullName() + "-" + user.getUsername() + ", ");
        }
        if (!notify.equals("")) notify = notify.trim().substring(0, notify.length() - 2);
        if (!userIds.isEmpty()) throw new ApiException(409, notify + " has overlaps scheduler");

        Interview finalInterview = interview;
        List<ScheduledInterview> newSchedules = interviewRequest.getInterviewerIds().stream()
                .map(s -> ScheduledInterview.builder()
                        .id(InterviewKey.builder().interviewId(id).interviewerId(s).build())
                        .startTime(finalInterview.getStartTime())
                        .endTime(finalInterview.getEndTime())
                        .isAvailable(false)
                        .build())
                .toList();

        interview = InterviewMapper.toEntity(interview, interviewRequest);
        interview.setUpdatedBy(loggedId());
        interview.setUpdatedAt(LocalDateTime.now());
        interviewRepository.save(interview);
//        candidateRepository.save(candidate);
        scheduledInterviewRepository.deleteAll(oldSchedules);
        scheduledInterviewRepository.saveAll(newSchedules);

        interview.setScheduledInterviews(newSchedules.stream().toList());
        sendMail(interview, "UPDATE INTERVIEW SCHEDULE");
        reminderBeforeOneHour(interview);
        interview.setScheduledInterviews(new ArrayList<>());
        return InterviewMapper.toResponse(interview);
    }


    @Override
    public InterviewResponse delete(Long id) {
        Interview interview = interviewRepository.findById(id).orElseThrow(() -> new ApiException(404, "Interview schedule not found!"));
        interview.setUpdatedBy(loggedId());
        interview.setUpdatedAt(LocalDateTime.now());
        interviewRepository.delete(interview);
        return InterviewMapper.toResponse(interview);
    }

    @Override
    public InterviewResponse submit(Long id, ResultRequest resultRequest) {
        Result result = Result.fromValue(resultRequest.getResult().toUpperCase());
        Interview interview = interviewRepository.findById(id).orElseThrow(() -> new ApiException(404, "Interview schedule not found!"));
        Candidate candidate = candidateRepository.findById(interview.getCandidate().getCandidateId())
                .orElseThrow(() -> new ApiException(404, "Candidate not found!"));
        interview.setResult(result);
        interview.setNote(resultRequest.getNote());
        interview.setFileNote(resultRequest.getFileNote());
        interview.setStatus(InterviewStatus.INTERVIEWED.getCode());
        if (result == Result.PASSED) candidate.setStatus(CandidateStatus.PASSED_INTERVIEW.getCode());
        else if (result == Result.FAILED) candidate.setStatus(CandidateStatus.FAILED_INTERVIEW.getCode());
        interview.setUpdatedBy(loggedId());
        interview.setUpdatedAt(LocalDateTime.now());

        List<ScheduledInterview> oldSchedules = interview.getScheduledInterviews();
        oldSchedules.forEach(o -> o.setIsAvailable(true));
        interviewRepository.save(interview);
        candidateRepository.save(candidate);
        scheduledInterviewRepository.saveAll(oldSchedules);
        return InterviewMapper.toResponse(interview);
    }

    @Override
    public InterviewResponse updateStatus(Long id, InterviewStatus status, NoteRequest noteRequest) {
        Interview interview = interviewRepository.findById(id).orElseThrow(() -> new ApiException(404, "Interview schedule not found!"));
        Candidate candidate = candidateRepository.findById(interview.getCandidate().getCandidateId())
                .orElseThrow(() -> new ApiException(404, "Candidate not found!"));
        if (noteRequest != null && !noteRequest.getNote().equals("")) interview.setNote(noteRequest.getNote());
        interview.setStatus(status.getCode());
        if (status == InterviewStatus.CANCELLED) {
            candidate.setStatus(CandidateStatus.CANCELLED_INTERVIEW.getCode());
            sendMail(interview, "CANCEL INTERVIEW SCHEDULE");
            List<ScheduledInterview> oldSchedules = interview.getScheduledInterviews();
            oldSchedules.forEach(o -> o.setIsAvailable(true));
            scheduledInterviewRepository.saveAll(oldSchedules);
        }
        interview.setUpdatedBy(loggedId());
        interview.setUpdatedAt(LocalDateTime.now());
        interviewRepository.save(interview);
        candidateRepository.save(candidate);
        return InterviewMapper.toResponse(interview);
    }

    @Override
    public InterviewResponse remindInterview(Long id) {
        Interview interview = interviewRepository.findById(id).orElseThrow(() -> new ApiException(404, "Interview schedule not found!"));
        interview.setStatus(InterviewStatus.INVITED.getCode());
        interview.setUpdatedBy(loggedId());
        interview.setUpdatedAt(LocalDateTime.now());
        interviewRepository.save(interview);
        return InterviewMapper.toResponse(interview);
    }

    @Override
    public PageResponse<InterviewResponse> getList(SearchRequest searchRequest, Integer page, Integer limit) {
        if (loggedRole().equals("INTERVIEWER")) return getListByInterviewer(searchRequest, page, limit, loggedId());
        if (page < 1 || limit < 1) throw new ApiException(400, "bad request!");
        Specification<Interview> specification = PageUtil.buildSpecification(Interview.class,
                        searchRequest.setStatusCodes(InterviewStatus.findContain(searchRequest.getFieldValue())))
                .or(PageUtil.byNestedField("candidate", "fullName", searchRequest.getFieldValue()))
                .or(PageUtil.byNestedField("job", "title", searchRequest.getFieldValue()))
                .or(PageUtil.byListInterviewers(searchRequest.getFieldValue()))
                .and(PageUtil.byStatus(searchRequest.getStatusCode()))
                .and(PageUtil.isNotDeleted());
        Pageable pageable = PageUtil.sortedMultiple(page, limit, List.of("status", "createdAt"));

        Page<Interview> pages = interviewRepository.findAll(specification, pageable);
        return PageUtil.toPageResponse(pages, page, limit,
                pages.map(InterviewMapper::toResponse).toList());
    }

    @Override
    public List<InterviewResponse> getListByCandidateId(Long candidateId) {
        List<Interview> interviews = interviewRepository.findByCandidate(candidateId, InterviewStatus.INTERVIEWED.getCode(), Result.PASSED);
        return interviews.stream()
                .map(InterviewMapper::toResponse)
                .toList();
    }

    @Override
    public PageResponse<InterviewResponse> getListByInterviewer(SearchRequest searchRequest, Integer page, Integer limit, Long interviewerId) {
        if (page < 1 || limit < 1) throw new ApiException(400, "bad request!");
        Specification<Interview> specification = PageUtil.buildSpecification(Interview.class,
                        searchRequest.setStatusCodes(InterviewStatus.findContain(searchRequest.getFieldValue())))
                .and(PageUtil.byStatus(searchRequest.getStatusCode()))
                .and(PageUtil.byInterviewer(interviewerId))
                .and(PageUtil.isNotDeleted());
        Pageable pageable = PageUtil.sortedMultiple(page, limit, List.of("status", "createdAt"));

        Page<Interview> pages = interviewRepository.findAll(specification, pageable);
        return PageUtil.toPageResponse(pages, page, limit,
                pages.map(InterviewMapper::toResponse).toList());
    }
}
