package com.example.interviewback.service.schedule;

import com.example.interviewback.commons.constant.status.JobStatus;
import com.example.interviewback.commons.entity.interview.Interview;
import com.example.interviewback.config.exception.ApiException;
import com.example.interviewback.repository.interview.InterviewRepository;
import com.example.interviewback.repository.job.JobRepository;
import lombok.RequiredArgsConstructor;
import org.quartz.*;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@EnableScheduling
public class ScheduleService {
    private final JobRepository jobRepository;
    private final InterviewRepository interviewRepository;
    private final Scheduler scheduler;

    @Scheduled(cron = "0 0 0 * * *") // 0h every day
    public void execute() {
        jobRepository.updateJobStatusByStartDate(LocalDate.now(), JobStatus.OPEN.getCode());
        jobRepository.updateJobStatusByEndDate(LocalDate.now(), JobStatus.CLOSED.getCode());
        List<Interview> interviews = interviewRepository.findInterviewsForToday(LocalDate.now());
        interviews.forEach(i -> {
            try {
                notifyBeforeInterview(i);
            } catch (SchedulerException e) {
                throw new ApiException(400, "schedule failed!");
            }
        });
    }

    public void notifyBeforeInterview(Interview interview) throws SchedulerException {
        long current = System.currentTimeMillis();
        LocalDateTime startTime = interview.getStartTime();
        LocalDateTime reminderTime = startTime.minusHours(1);

        JobKey jobKey = new JobKey("reminderJob_" + interview.getInterviewId());
        if (scheduler.checkExists(jobKey)) {
            scheduler.deleteJob(jobKey);
        }

        JobDetail jobDetail = JobBuilder.newJob(ReminderInterviewService.class)
                .withIdentity(jobKey)
                .usingJobData("interviewId", interview.getInterviewId())
                .build();

        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("trigger_" + interview.getInterviewId() + System.currentTimeMillis() + current)
                .startAt(Date.from(reminderTime.atZone(ZoneId.systemDefault()).toInstant()))
                .forJob(jobDetail)
                .build();

        scheduler.scheduleJob(jobDetail, trigger);
    }
}
