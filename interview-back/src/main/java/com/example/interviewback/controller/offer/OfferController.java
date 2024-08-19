package com.example.interviewback.controller.offer;

import com.example.interviewback.commons.constant.status.OfferStatus;
import com.example.interviewback.commons.request.SearchRequest;
import com.example.interviewback.commons.request.offer.OfferRequest;
import com.example.interviewback.commons.request.offer.SimpleOfferRequest;
import com.example.interviewback.commons.response.DfResponse;
import com.example.interviewback.commons.response.PageResponse;
import com.example.interviewback.commons.response.offer.OfferResponse;
import com.example.interviewback.config.exception.ApiException;
import com.example.interviewback.service.offer.OfferService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@RestController
@RequestMapping("/api/offer")
@RequiredArgsConstructor
@CrossOrigin
public class OfferController {
    private final OfferService offerService;

    @PostMapping("")
    public DfResponse<OfferResponse> create(@Valid @RequestBody OfferRequest offerRequest) {
        return DfResponse.ok(offerService.create(offerRequest));
    }

    @GetMapping("/{id}")
    public DfResponse<OfferResponse> getDetail(@PathVariable Long id) {
        return DfResponse.ok(offerService.getById(id));
    }

    @PutMapping("/{id}")
    public DfResponse<OfferResponse> update(@PathVariable Long id, @Valid @RequestBody OfferRequest offerRequest) {
        return DfResponse.ok(offerService.update(id, offerRequest));
    }

    @PutMapping("/{id}/{status}")
    public DfResponse<OfferResponse> update(@PathVariable Long id, @PathVariable String status,
                                            @RequestBody(required = false) SimpleOfferRequest simpleOfferRequest) {
        OfferStatus offerStatus;
        try {
            offerStatus = OfferStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(400, "Invalid status value!");
        }
        return DfResponse.ok(offerService.updateStatus(id, offerStatus, simpleOfferRequest));
    }

    @PostMapping("/list")
    public DfResponse<PageResponse<OfferResponse>> getList(@RequestParam("page") Integer page,
                                                           @RequestParam("limit") Integer limit,
                                                           @RequestBody SearchRequest searchRequest) {
        return DfResponse.ok(offerService.getList(
                searchRequest.setFieldValue(searchRequest.getFieldValue().trim()), page, limit));
    }

    @GetMapping("/{id}/reminder")
    public DfResponse<OfferResponse> remindOffer(@PathVariable Long id) {
        return DfResponse.ok(offerService.remindOffer(id));
    }

    @GetMapping("/{id}/reminder/candidate")
    public DfResponse<OfferResponse> remindCandidateOffer(@PathVariable Long id) {
        return DfResponse.ok(offerService.remindCandidate(id));
    }

    @PostMapping("/list/{managerId}")
    public DfResponse<PageResponse<OfferResponse>> getListByManager(@RequestParam("page") Integer page,
                                                                    @RequestParam("limit") Integer limit,
                                                                    @RequestBody SearchRequest searchRequest,
                                                                    @PathVariable Long managerId) {
        return DfResponse.ok(offerService.getListByManager(
                searchRequest.setFieldValue(searchRequest.getFieldValue().trim()), page, limit, managerId));
    }

    @GetMapping("/export")
    public void exportOffers(
            @RequestParam("startDate") String startDateStr,
            @RequestParam("endDate") String endDateStr,
            HttpServletResponse response) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        try {
            LocalDate startDate = LocalDate.parse(startDateStr, formatter);
            LocalDate endDate = LocalDate.parse(endDateStr, formatter);

            ByteArrayInputStream inputStream = offerService.exportOffers(startDate, endDate);
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=offers.xlsx");
            org.apache.commons.io.IOUtils.copy(inputStream, response.getOutputStream());
            response.flushBuffer();
        } catch (DateTimeParseException e) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
        } catch (IOException e) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }
}
