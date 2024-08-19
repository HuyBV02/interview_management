package com.example.interviewback.service.offer;

import com.example.interviewback.commons.constant.attributes.Result;
import com.example.interviewback.commons.constant.status.CandidateStatus;
import com.example.interviewback.commons.constant.status.InterviewStatus;
import com.example.interviewback.commons.constant.status.OfferStatus;
import com.example.interviewback.commons.entity.candidate.Candidate;
import com.example.interviewback.commons.entity.interview.Interview;
import com.example.interviewback.commons.entity.offer.Offer;
import com.example.interviewback.commons.entity.user.User;
import com.example.interviewback.commons.request.SearchRequest;
import com.example.interviewback.commons.request.offer.OfferRequest;
import com.example.interviewback.commons.request.offer.SimpleOfferRequest;
import com.example.interviewback.commons.response.PageResponse;
import com.example.interviewback.commons.response.mail.OfferMail;
import com.example.interviewback.commons.response.offer.OfferResponse;
import com.example.interviewback.config.exception.ApiException;
import com.example.interviewback.repository.candidate.CandidateRepository;
import com.example.interviewback.repository.interview.InterviewRepository;
import com.example.interviewback.repository.offer.OfferRepository;
import com.example.interviewback.repository.user.UserRepository;
import com.example.interviewback.service.mail.MailService;
import com.example.interviewback.util.OfferMapper;
import com.example.interviewback.util.PageUtil;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Stream;

import static com.example.interviewback.util.AuthUtil.loggedId;
import static com.example.interviewback.util.AuthUtil.loggedRole;
import static com.example.interviewback.util.TimeUtil.dateToDateString;

@Service
@RequiredArgsConstructor
public class OfferServiceImpl implements OfferService {

    private final OfferRepository offerRepository;

    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;
    private final InterviewRepository interviewRepository;
    private final MailService mailService;

    @Override
    public OfferResponse create(OfferRequest offerRequest) {
        Offer offer = OfferMapper.toEntity(offerRequest);
        offer.setStatus(OfferStatus.WAITING_FOR_APPROVAL.getCode());
        offer.setCreatedBy(loggedId());
        offer.setCreatedAt(LocalDateTime.now());

        Candidate candidate = candidateRepository.findById(offer.getCandidate().getCandidateId())
                .orElseThrow(() -> new ApiException(404, "Candidate not found"));
        Interview interview = interviewRepository.findById(offer.getInterview().getInterviewId())
                .orElseThrow(() -> new ApiException(404, "Interview not found"));
        List<Offer> offers = offerRepository.findByInterviewId(interview.getInterviewId());
        if (!offers.isEmpty()) {
            throw new ApiException(400, "This interview already has an offer!");
        }

        if (!Objects.equals(candidate.getStatus(), CandidateStatus.PASSED_INTERVIEW.getCode())
                && !Objects.equals(candidate.getStatus(), CandidateStatus.REJECTED_OFFER.getCode()))
            throw new ApiException(400, "Candidate does not pass interview!");
        if (!Objects.equals(interview.getStatus(), InterviewStatus.INTERVIEWED.getCode()))
            throw new ApiException(400, "Interview has not been submitted!");
        if (interview.getResult() == null || !interview.getResult().getValue().equals(Result.PASSED.getValue())) {
            throw new ApiException(400, "Candidate does not pass interview!");
        }

        candidate.setStatus(CandidateStatus.WAITING_FOR_APPROVAL.getCode());
        candidateRepository.save(candidate);
        offerRepository.save(offer);

        return OfferMapper.toSimpleResponse(offer);
    }

    @Override
    public OfferResponse getById(Long id) {
        Offer offer = offerRepository.findById(id).orElseThrow(() -> new ApiException(404, "Offer not found!"));
        return OfferMapper.toResponse(offer);
    }

    @Override
    public OfferResponse update(Long id, OfferRequest offerRequest) {
        Offer offer = offerRepository.findById(id).orElseThrow(() -> new ApiException(404, "Offer not found!"));
        if (offer.getStatus() != OfferStatus.WAITING_FOR_APPROVAL.getCode() && offer.getStatus() != OfferStatus.REJECTED.getCode())
            throw new ApiException(406, "Cannot edit offer!");
//        if (offer.getStatus() == OfferStatus.APPROVED.getCode() || offer.getStatus() == OfferStatus.CANCELLED.getCode())
//            throw new ApiException(406, "Can not edit Approved or Cancelled offer!");
        offer = OfferMapper.toEntity(offer, offerRequest);
        if (offer.getStatus() == OfferStatus.REJECTED.getCode())
            offer.setStatus(OfferStatus.WAITING_FOR_APPROVAL.getCode());
        offer.setUpdatedBy(loggedId());
        offer.setUpdatedAt(LocalDateTime.now());

        Candidate candidate = candidateRepository.findById(offer.getCandidate().getCandidateId())
                .orElseThrow(() -> new ApiException(404, "Candidate not found"));
        Interview interview = interviewRepository.findById(offer.getInterview().getInterviewId())
                .orElseThrow(() -> new ApiException(404, "Interview not found"));
//        if (!Objects.equals(candidate.getStatus(), CandidateStatus.PASSED_INTERVIEW.getCode())
//                && !Objects.equals(candidate.getStatus(), CandidateStatus.REJECTED_OFFER.getCode()))
//            throw new ApiException(400, "Candidate does not pass interview!");
        if (!Objects.equals(interview.getStatus(), InterviewStatus.INTERVIEWED.getCode()))
            throw new ApiException(400, "Interview has not been submitted!");
        if (interview.getResult() == null || !interview.getResult().getValue().equals(Result.PASSED.getValue())) {
            throw new ApiException(400, "Candidate does not pass interview!");
        }

        candidate.setStatus(CandidateStatus.WAITING_FOR_APPROVAL.getCode());
        candidateRepository.save(candidate);
        offerRepository.save(offer);
        return OfferMapper.toSimpleResponse(offer);
    }

    @Override
    public OfferResponse updateStatus(Long id, OfferStatus status, SimpleOfferRequest simpleOfferRequest) {
        Offer offer = offerRepository.findById(id).orElseThrow(() -> new ApiException(404, "Offer not found!"));
        Candidate candidate = candidateRepository.findById(offer.getCandidate()
                        .getCandidateId())
                .orElseThrow(() -> new ApiException(404, "Candidate not found!"));
        if (simpleOfferRequest != null && !simpleOfferRequest.getNote().equals(""))
            offer.setNote(simpleOfferRequest.getNote());
        // Approve/Reject offer
        if (status == OfferStatus.APPROVED || status == OfferStatus.REJECTED) {
            User user = userRepository.findById(offer.getRecruiter().getUserId())
                    .orElseThrow(() -> new ApiException(404, "User not found!"));
            if (offer.getStatus() != OfferStatus.WAITING_FOR_APPROVAL.getCode())
                throw new ApiException(406, "Offer is not in Waiting for approval status!");
            if (status == OfferStatus.APPROVED) {
                candidate.setStatus(CandidateStatus.APPROVED_OFFER.getCode());
                sendMail(offer, "APPROVE OFFER", Stream.of(user.getEmail()).toArray(String[]::new), "approved_offer");
                //offer.setNote("Approved");
            } else {
                candidate.setStatus(CandidateStatus.REJECTED_OFFER.getCode());
                sendMail(offer, "REJECT OFFER", Stream.of(user.getEmail()).toArray(String[]::new), "rejected_offer");
                //offer.setNote("Rejected");
            }
        }

        // Update offer from candidate
        if (status == OfferStatus.ACCEPTED_OFFER || status == OfferStatus.DECLINED_OFFER) {
            if (offer.getStatus() != OfferStatus.WAITING_FOR_RESPONSE.getCode())
                throw new ApiException(406, "Offer is not in Waiting for response status!");
            if (status == OfferStatus.ACCEPTED_OFFER) {
                candidate.setStatus(CandidateStatus.ACCEPT_OFFER.getCode());
                //offer.setNote("Accepted");
            } else {
                candidate.setStatus(CandidateStatus.DECLINED_OFFER.getCode());
                //offer.setNote("Declined");
            }
        }

        // cancel offer
        if (status == OfferStatus.CANCELLED) {
            candidate.setStatus(CandidateStatus.CANCELLED_OFFER.getCode());
            User user = userRepository.findById(offer.getApprover().getUserId())
                    .orElseThrow(() -> new ApiException(404, "User not found!"));
            sendMail(offer, "CANCEL OFFER", Stream.of(user.getEmail()).toArray(String[]::new), "cancel_offer");
            sendMail(offer, "CANCEL OFFER", Stream.of(candidate.getEmail()).toArray(String[]::new), "cancel_offer_candidate");
            //offer.setNote("Cancelled");
        }

        offer.setStatus(status.getCode());
        offer.setUpdatedBy(loggedId());
        offer.setUpdatedAt(LocalDateTime.now());
        offerRepository.save(offer);
        candidateRepository.save(candidate);
        return OfferMapper.toSimpleResponse(offer);
    }


    @Override
    public PageResponse<OfferResponse> getList(SearchRequest searchRequest, Integer page, Integer limit) {
        if (loggedRole().equals("MANAGER")) return getListByManager(searchRequest, page, limit, loggedId());
        if (page < 1 || limit < 1) throw new ApiException(400, "bad request!");
        Specification<Offer> specification = PageUtil.buildSpecification(Offer.class,
                        searchRequest.setStatusCodes(OfferStatus.findContain(searchRequest.getFieldValue())))
                .or(PageUtil.byNestedField("approver", "fullName", searchRequest.getFieldValue()))
                .or(PageUtil.byCandidate(searchRequest.getFieldValue()))
                .and(PageUtil.byStatus(searchRequest.getStatusCode()))
                .and(PageUtil.isNotDeleted());
        Pageable pageable = PageUtil.sortedMultiple(page, limit, List.of("status", "createdAt"));

        Page<Offer> pages = offerRepository.findAll(specification, pageable);

        return PageUtil.toPageResponse(pages, page, limit, pages.map(OfferMapper::toResponse).toList());
    }

    @Override
    public OfferResponse remindOffer(Long id) {
        Offer offer = offerRepository.findById(id).orElseThrow(() -> new ApiException(404, "Offer not found!"));
        User user = userRepository.findById(offer.getApprover().getUserId())
                .orElseThrow(() -> new ApiException(404, "User not found!"));

        offer.setStatus(OfferStatus.WAITING_FOR_APPROVAL.getCode());
        offerRepository.save(offer);

        sendMail(offer, "REVIEW OFFER", Stream.of(user.getEmail()).toArray(String[]::new), "offer");
        return OfferMapper.toSimpleResponse(offer);
    }

    @Override
    public OfferResponse remindCandidate(Long id) {
        Offer offer = offerRepository.findById(id).orElseThrow(() -> new ApiException(404, "Offer not found!"));
        Candidate candidate = candidateRepository.findById(offer.getCandidate().getCandidateId())
                .orElseThrow(() -> new ApiException(404, "Candidate not found!"));

        offer.setStatus(OfferStatus.WAITING_FOR_RESPONSE.getCode());
        offerRepository.save(offer);

        sendMail(offer, "REVIEW OFFER", Stream.of(candidate.getEmail()).toArray(String[]::new), "offer_candidate");
        return OfferMapper.toSimpleResponse(offer);
    }

    @Override
    public PageResponse<OfferResponse> getListByManager(SearchRequest searchRequest, Integer page, Integer limit, Long managerId) {
        if (page < 1 || limit < 1) throw new ApiException(400, "bad request!");
        Specification<Offer> specification = PageUtil.buildSpecification(Offer.class,
                        searchRequest.setStatusCodes(OfferStatus.findContain(searchRequest.getFieldValue())))
                .and(PageUtil.byStatus(searchRequest.getStatusCode()))
                .and(PageUtil.byManager(managerId))
                .and(PageUtil.isNotDeleted());
        Pageable pageable = PageUtil.sortedMultiple(page, limit, List.of("status", "createdAt"));

        Page<Offer> pages = offerRepository.findAll(specification, pageable);

        return PageUtil.toPageResponse(pages, page, limit, pages.map(OfferMapper::toResponse).toList());
    }

    private void sendMail(Offer offer, String subject, String[] emails, String template) {
        Candidate candidate = candidateRepository.findById(offer.getCandidate().getCandidateId()).orElseThrow(() -> new ApiException(404, "Candidate not found!"));
        User recruiter = userRepository.findById(offer.getRecruiter().getUserId()).orElseThrow(() -> new ApiException(404, "Recruiter not found!"));
        NumberFormat numberFormat = NumberFormat.getNumberInstance(Locale.US);
        OfferMail mail = OfferMail.builder()
                .offerId(offer.getOfferId())
                .dueDate(dateToDateString(offer.getDueDate()))
                .startContract(dateToDateString(offer.getStartContract()))
                .endContract(dateToDateString(offer.getEndContract()))
                .basicSalary(numberFormat.format(offer.getBasicSalary()))
                .note(offer.getNote())
                .contractType(offer.getContractType())
                .department(offer.getDepartment())
                .position(offer.getPosition())
                .level(offer.getLevel())
                .candidateName(candidate.getFullName())
                .recruiter(recruiter.getEmail())
                .build();
        Context context = new Context();
        context.setVariable("data", mail);
        mailService.sendEmail(emails, subject, template, context);
    }

    @Override
    public ByteArrayInputStream exportOffers(LocalDate startDate, LocalDate endDate) throws ApiException {
        List<Offer> offers = offerRepository.findOffersBetweenDates(startDate, endDate);
        List<OfferResponse> offerResponses = new ArrayList<>();
        for (Offer offer : offers) {
            offerResponses.add(OfferMapper.toResponse(offer));
        }

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Offers");
            createHeaderRow(sheet);

            int rowNum = 1;
            for (OfferResponse offerResponse : offerResponses) {
                Row row = sheet.createRow(rowNum++);
                createOfferRow(offerResponse, row);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return new ByteArrayInputStream(outputStream.toByteArray());
        } catch (IOException e) {
            throw new ApiException(461, "Error creating Excel file: ");
        }
    }

    private void createHeaderRow(Sheet sheet) {
        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("Start contact");
        headerRow.createCell(1).setCellValue("End contact");
        headerRow.createCell(2).setCellValue("Due date");
        headerRow.createCell(3).setCellValue("Basic salary");
        headerRow.createCell(4).setCellValue("Note");
        headerRow.createCell(5).setCellValue("Contract type");
        headerRow.createCell(6).setCellValue("Department");
        headerRow.createCell(7).setCellValue("Position");
        headerRow.createCell(8).setCellValue("Level");
        headerRow.createCell(9).setCellValue("Status");
        headerRow.createCell(10).setCellValue("Interview Note");
        headerRow.createCell(11).setCellValue("Interview Result");
    }

    private void createOfferRow(OfferResponse offerResponse, Row row) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        row.createCell(0).setCellValue(offerResponse.getStartContract().format(formatter));
        row.createCell(1).setCellValue(offerResponse.getEndContract().format(formatter));
        row.createCell(2).setCellValue(offerResponse.getDueDate().format(formatter));
        row.createCell(3).setCellValue(offerResponse.getBasicSalary());
        row.createCell(4).setCellValue(offerResponse.getNote());
        row.createCell(5).setCellValue(offerResponse.getContractType().getValue());
        row.createCell(6).setCellValue(offerResponse.getDepartment().getValue());
        row.createCell(7).setCellValue(offerResponse.getPosition().getValue());
        row.createCell(8).setCellValue(offerResponse.getLevel().getValue());
        row.createCell(9).setCellValue(offerResponse.getStatus().getValue());
        row.createCell(10).setCellValue(offerResponse.getInterview().getNote());
        row.createCell(11).setCellValue(offerResponse.getInterview().getFileNote());
    }
}
