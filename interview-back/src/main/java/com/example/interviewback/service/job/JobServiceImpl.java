package com.example.interviewback.service.job;

import com.example.interviewback.commons.constant.attributes.Department;
import com.example.interviewback.commons.constant.status.JobStatus;
import com.example.interviewback.commons.entity.job.Job;
import com.example.interviewback.commons.request.SearchRequest;
import com.example.interviewback.commons.request.job.JobRequest;
import com.example.interviewback.commons.response.PageResponse;
import com.example.interviewback.commons.response.job.JobResponse;
import com.example.interviewback.config.exception.ApiException;
import com.example.interviewback.repository.interview.InterviewRepository;
import com.example.interviewback.repository.interview.ScheduledInterviewRepository;
import com.example.interviewback.repository.job.JobRepository;
import com.example.interviewback.repository.offer.OfferRepository;
import com.example.interviewback.util.JobMapper;
import com.example.interviewback.util.PageUtil;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static com.example.interviewback.util.AuthUtil.loggedId;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {
    private final JobRepository jobRepository;
    private final InterviewRepository interviewRepository;
    private final OfferRepository offerRepository;
    private final ScheduledInterviewRepository scheduledInterviewRepository;

    @Override
    public JobResponse create(JobRequest jobRequest) {
        Job job = JobMapper.toEntity(jobRequest);
        job.setStatus(JobStatus.DRAFT.getCode());
        if (job.getStartDate().isEqual(LocalDate.now()) || job.getStartDate().isBefore(LocalDate.now()))
            job.setStatus(JobStatus.OPEN.getCode());
        job.setCreatedBy(loggedId());
        job.setCreatedAt(LocalDateTime.now());
        jobRepository.save(job);
        return JobMapper.toResponse(job);
    }

    @Override
    public JobResponse findById(Long id) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new ApiException(404, "Job not found!"));
        return JobMapper.toResponse(job);
    }

    @Override
    public JobResponse update(Long id, JobRequest jobRequest) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new ApiException(404, "Job not found!"));
        job = JobMapper.toEntity(job, jobRequest);
        if (job.getStartDate().isEqual(LocalDate.now()) || job.getStartDate().isBefore(LocalDate.now()))
            job.setStatus(JobStatus.OPEN.getCode());
        else if (job.getEndDate().isEqual(LocalDate.now()) || job.getEndDate().isBefore(LocalDate.now()))
            job.setStatus(JobStatus.CLOSED.getCode());
        job.setUpdatedBy(loggedId());
        job.setUpdatedAt(LocalDateTime.now());
        jobRepository.save(job);
        return JobMapper.toResponse(job);
    }

    @Override
    public List<JobResponse> findAllOpenJobs() {
        return jobRepository.findByStatus(JobStatus.OPEN.getCode())
                .stream()
                .map(JobMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PageResponse<JobResponse> getList(SearchRequest searchRequest, Integer page, Integer limit) {
        if (page < 1 || limit < 1) throw new ApiException(400, "bad request!");
        Specification<Job> specification = PageUtil.buildSpecification(Job.class,
                        searchRequest.setStatusCodes(JobStatus.findContain(searchRequest.getFieldValue())))
                .and(PageUtil.byStatus(searchRequest.getStatusCode()))
                .and(PageUtil.isNotDeleted());
        Pageable pageable = PageUtil.sortedMultiple(page, limit, List.of("status", "createdAt"));

        Page<Job> pages = jobRepository.findAll(specification, pageable);

        return PageUtil.toPageResponse(pages, page, limit, pages.map(JobMapper::toResponse).toList());
    }

    @Override
    public PageResponse<JobResponse> getListOpeningPage(SearchRequest searchRequest, Integer page, Integer limit) {
        if (page < 1 || limit < 1) throw new ApiException(400, "bad request!");
        List<Integer> statusCodes = JobStatus.findContain(searchRequest.getFieldValue());
        searchRequest.setStatusCodes(statusCodes);
        searchRequest.setStatusCode(1);
        Specification<Job> specification = PageUtil.buildSpecification(Job.class, searchRequest)
                .and(PageUtil.byStatus(searchRequest.getStatusCode()))
                .and(PageUtil.isNotDeleted());
        Pageable pageable = PageUtil.sortedMultiple(page, limit, List.of("status", "createdAt"));

        Page<Job> pages = jobRepository.findAll(specification, pageable);

        return PageUtil.toPageResponse(pages, page, limit, pages.map(JobMapper::toResponse).toList());
    }

    @Override
    public JobResponse delete(Long id) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new ApiException(404, "Job not found!"));
        job.setIsDeleted(true);
        job.setUpdatedBy(loggedId());
        job.setUpdatedAt(LocalDateTime.now());

        jobRepository.save(job);
        interviewRepository.deleteByJob(id);
        scheduledInterviewRepository.setAvailableByJobId(id);
        offerRepository.deleteByJob(id);
        return JobMapper.toResponse(job);
    }

    public String importJobs(MultipartFile file, Boolean toValid) {
        List<Job> jobList = new ArrayList<>();
        LocalDate current = LocalDate.now();
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                Job job = new Job();
                job.setTitle(getCellValue(row, 0));
                job.setStartDate(parseDateCell(row, 1));
                job.setEndDate(parseDateCell(row, 2));
                job.setSalaryFrom(parseDoubleCell(row, 3));
                job.setSalaryTo(parseDoubleCell(row, 4));
                job.setWorkingAddress(getCellValue(row, 5));
                job.setDescription(getCellValue(row, 6));
                job.setSkills(getCellValue(row, 7));
                job.setBenefits(getCellValue(row, 8));
                job.setLevels(getCellValue(row, 9));
                job.setDepartment(Department.valueOf(getCellValue(row, 10)));
                job.setStatus(JobStatus.DRAFT.getCode());
                if (job.getStartDate().isEqual(current) || job.getStartDate().isBefore(current))
                    job.setStatus(JobStatus.OPEN.getCode());
                if (job.getEndDate().isEqual(current) || job.getEndDate().isBefore(current))
                    job.setStatus(JobStatus.CLOSED.getCode());
                job.setCreatedBy(loggedId());
                job.setCreatedAt(LocalDateTime.now());
//                jobRepository.save(job);
                jobList.add(job);
            }
            if (!toValid) {
                jobRepository.saveAll(jobList);
                return "Jobs imported successfully";
            }
            return "Validate successfully!";
        } catch (ApiException e) {
            throw new ApiException(e.getCode(), e.getMessage());
        } catch (Exception e) {
            throw new ApiException(406, "Error reading Excel file!");
        }
    }

    private String getCellValue(Row row, int cellNum) {
        try {
            Cell cell = row.getCell(cellNum);
            return cell.getStringCellValue();
        } catch (Exception e) {
            throw new ApiException(409, "Error reading cell " + (cellNum + 1) + " in row " + (row.getRowNum() + 1) + ": " + "cell must be in STRING format!");
        }
    }

    private LocalDate parseDateCell(Row row, int cellNum) {
        try {
            Cell cell = row.getCell(cellNum);
            return cell.getLocalDateTimeCellValue().toLocalDate();
        } catch (Exception e) {
            throw new ApiException(409, "Error reading cell " + (cellNum + 1) + " in row " + (row.getRowNum() + 1) + ": " + "cell must be in DATE format (m/d/yyyy)!");
        }
    }

    private double parseDoubleCell(Row row, int cellNum) {
        try {
            Cell cell = row.getCell(cellNum);
            return cell.getNumericCellValue();
        } catch (Exception e) {
            throw new ApiException(409, "Error reading cell " + (cellNum + 1) + " in row " + (row.getRowNum() + 1) + ": " + "cell must be in NUMERIC format!");
        }
    }
}