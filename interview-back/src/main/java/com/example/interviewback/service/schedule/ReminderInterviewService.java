package com.example.interviewback.service.schedule;

import com.example.interviewback.commons.entity.interview.Interview;
import com.example.interviewback.repository.interview.InterviewRepository;
import com.example.interviewback.service.interview.InterviewService;
import lombok.RequiredArgsConstructor;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

@RequiredArgsConstructor
public class ReminderInterviewService implements Job {
    private final InterviewRepository interviewRepository;
    private final InterviewService interviewService;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        JobDataMap jobDataMap = context.getJobDetail().getJobDataMap();
        Long interviewId = jobDataMap.getLong("interviewId");
        Interview interview = interviewRepository.findByIdWithScheduledInterviews(interviewId);
        interviewService.sendMail(interview, "INTERVIEW TODAY");
    }
}
