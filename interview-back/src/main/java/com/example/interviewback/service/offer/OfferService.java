package com.example.interviewback.service.offer;

import com.example.interviewback.commons.constant.status.OfferStatus;
import com.example.interviewback.commons.request.SearchRequest;
import com.example.interviewback.commons.request.offer.OfferRequest;
import com.example.interviewback.commons.request.offer.SimpleOfferRequest;
import com.example.interviewback.commons.response.PageResponse;
import com.example.interviewback.commons.response.offer.OfferResponse;
import com.example.interviewback.config.exception.ApiException;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;

public interface OfferService {
    OfferResponse create(OfferRequest offerRequest);

    OfferResponse getById(Long id);

    OfferResponse update(Long id, OfferRequest offerRequest);

    OfferResponse updateStatus(Long id, OfferStatus status, SimpleOfferRequest simpleOfferRequest);

    PageResponse<OfferResponse> getList(SearchRequest searchRequest, Integer page, Integer limit);

    OfferResponse remindOffer(Long id);

    OfferResponse remindCandidate(Long id);

    PageResponse<OfferResponse> getListByManager(SearchRequest searchRequest, Integer page, Integer limit, Long managerId);

    ByteArrayInputStream exportOffers(LocalDate startDate, LocalDate endDate) throws ApiException;
}
