package com.example.interviewback.commons.entity.interview;

import com.example.interviewback.commons.entity.key.InterviewKey;
import com.example.interviewback.commons.entity.user.User;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class ScheduledInterview {
    @EmbeddedId
    private InterviewKey id;

    @ManyToOne
    @JoinColumn(name = "interview_id", insertable = false, updatable = false)
    private Interview interview;
    @ManyToOne
    @JoinColumn(name = "interviewer_id", insertable = false, updatable = false)
    private User interviewer;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Boolean isAvailable;
}
