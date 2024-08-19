package com.example.interviewback.commons.response.interview;

import com.example.interviewback.commons.response.user.SimpleUserResponse;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class ScheduledInterviewResponse {
    private SimpleUserResponse user;
    private List<SimpleInterviewResponse> interviews;
//    private List<TimeRangeResponse> times;
}
