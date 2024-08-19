package com.example.interviewback.controller.user;

import com.example.interviewback.commons.constant.status.UserStatus;
import com.example.interviewback.commons.request.SearchRequest;
import com.example.interviewback.commons.request.interview.ScheduleRequest;
import com.example.interviewback.commons.request.user.LoginUserRequest;
import com.example.interviewback.commons.request.user.UserRequest;
import com.example.interviewback.commons.response.DfResponse;
import com.example.interviewback.commons.response.PageResponse;
import com.example.interviewback.commons.response.interview.ScheduledInterviewResponse;
import com.example.interviewback.commons.response.user.LoginUserResponse;
import com.example.interviewback.commons.response.user.SimpleUserResponse;
import com.example.interviewback.commons.response.user.UserResponse;
import com.example.interviewback.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("")
    public DfResponse<UserResponse> register(@Valid @RequestBody UserRequest userRequest) {
        return DfResponse.ok(userService.create(userRequest));
    }

    @GetMapping("/{id}")
    public DfResponse<UserResponse> getDetail(@PathVariable Long id) {
        return DfResponse.ok(userService.getById(id));
    }

    @PutMapping("/{id}")
    public DfResponse<UserResponse> update(@PathVariable Long id, @Valid @RequestBody UserRequest userRequest) {
        return DfResponse.ok(userService.update(id, userRequest));
    }

    @PostMapping("/list")
    public DfResponse<PageResponse<UserResponse>> getList(@RequestParam("page") Integer page,
                                                          @RequestParam("limit") Integer limit,
                                                          @RequestBody SearchRequest searchRequest) {
        return DfResponse.ok(userService.getList(
                searchRequest.setFieldValue(searchRequest.getFieldValue().trim()), page, limit));
    }

    @PostMapping("/login")
    public DfResponse<LoginUserResponse> login(@Valid @RequestBody LoginUserRequest loginUserRequest) {
        return DfResponse.ok(userService.login(loginUserRequest));
    }

    @PutMapping("/{id}/active")
    public DfResponse<UserResponse> active(@PathVariable Long id) {
        return DfResponse.ok(userService.updateStatus(id, UserStatus.ACTIVE));
    }

    @PutMapping("/{id}/deactivate")
    public DfResponse<UserResponse> deactivate(@PathVariable Long id) {
        return DfResponse.ok(userService.updateStatus(id, UserStatus.INACTIVE));
    }

    @GetMapping("/list/{roleId}/tempt")
    public DfResponse<List<SimpleUserResponse>> getListByRole(@PathVariable Long roleId) {
        return DfResponse.ok(userService.getListByRole(roleId));
    }

    @GetMapping("/list/{roleId}")
    public DfResponse<List<SimpleUserResponse>> searchByRole(@PathVariable Long roleId,
                                                             @RequestParam("search") String searchValue) {
        return DfResponse.ok(userService.searchByRoleAndName(roleId, searchValue.trim()));
    }

    @PostMapping("/interviewers")
    public DfResponse<List<SimpleUserResponse>> searchInterviews(@RequestBody UserRequest userRequest,
                                                                 @RequestParam("search") String searchValue) {
        return DfResponse.ok(userService.searchInterviewersBySkills(userRequest.getSkills(), searchValue.trim()));
    }

    @PostMapping("/{id}/schedule")
    public DfResponse<ScheduledInterviewResponse> getSchedulesByInterviewer(@PathVariable Long id,
                                                                          @Valid @RequestBody ScheduleRequest scheduleRequest) {
        return DfResponse.ok(userService.getListSchedulesByInterviewer(id, scheduleRequest.getDate()));
    }
}
