package com.example.interviewback.service.user;

import com.example.interviewback.commons.constant.attributes.Skill;
import com.example.interviewback.commons.constant.status.UserStatus;
import com.example.interviewback.commons.request.SearchRequest;
import com.example.interviewback.commons.request.user.LoginUserRequest;
import com.example.interviewback.commons.request.user.ResetPasswordRequest;
import com.example.interviewback.commons.request.user.UserEmailRequest;
import com.example.interviewback.commons.request.user.UserRequest;
import com.example.interviewback.commons.response.PageResponse;
import com.example.interviewback.commons.response.interview.ScheduledInterviewResponse;
import com.example.interviewback.commons.response.user.LoginUserResponse;
import com.example.interviewback.commons.response.user.SimpleUserResponse;
import com.example.interviewback.commons.response.user.UserResponse;

import java.time.LocalDate;
import java.util.List;

public interface UserService {
    UserResponse create(UserRequest userRequest);

    UserResponse getById(Long id);

    UserResponse update(Long id, UserRequest userRequest);

    UserResponse updateStatus(Long id, UserStatus status);

    PageResponse<UserResponse> getList(SearchRequest searchRequest, Integer page, Integer limit);

    LoginUserResponse login(LoginUserRequest loginUserRequest);

    List<SimpleUserResponse> getListByRole(Long roleId);

    String forgotPassword(UserEmailRequest userEmailRequest);

    SimpleUserResponse checkToken(String token);

    UserResponse resetPassword(String token, ResetPasswordRequest request);

    List<SimpleUserResponse> searchByRoleAndName(Long roleId, String searchValue);

    List<SimpleUserResponse> searchInterviewersBySkills(List<String> skills, String searchValue);
    ScheduledInterviewResponse getListSchedulesByInterviewer(Long interviewerId, LocalDate date);
}
