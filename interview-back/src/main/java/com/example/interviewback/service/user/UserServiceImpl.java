package com.example.interviewback.service.user;

import com.example.interviewback.commons.constant.attributes.Skill;
import com.example.interviewback.commons.constant.status.UserStatus;
import com.example.interviewback.commons.entity.interview.ScheduledInterview;
import com.example.interviewback.commons.entity.role.Role;
import com.example.interviewback.commons.entity.user.ResetPassToken;
import com.example.interviewback.commons.entity.user.User;
import com.example.interviewback.commons.request.SearchRequest;
import com.example.interviewback.commons.request.user.LoginUserRequest;
import com.example.interviewback.commons.request.user.ResetPasswordRequest;
import com.example.interviewback.commons.request.user.UserEmailRequest;
import com.example.interviewback.commons.request.user.UserRequest;
import com.example.interviewback.commons.response.PageResponse;
import com.example.interviewback.commons.response.interview.ScheduledInterviewResponse;
import com.example.interviewback.commons.response.interview.SimpleInterviewResponse;
import com.example.interviewback.commons.response.mail.AccountMail;
import com.example.interviewback.commons.response.mail.ForgotPasswordMail;
import com.example.interviewback.commons.response.role.SimpleRoleResponse;
import com.example.interviewback.commons.response.user.LoginUserResponse;
import com.example.interviewback.commons.response.user.SimpleUserResponse;
import com.example.interviewback.commons.response.user.UserResponse;
import com.example.interviewback.config.exception.ApiException;
import com.example.interviewback.config.jwt.AuthUser;
import com.example.interviewback.config.jwt.JwtService;
import com.example.interviewback.repository.interview.ScheduledInterviewRepository;
import com.example.interviewback.repository.token.ResetPassTokenRepository;
import com.example.interviewback.repository.user.UserRepository;
import com.example.interviewback.service.mail.MailService;
import com.example.interviewback.util.PageUtil;
import com.example.interviewback.util.TimeUtil;
import com.example.interviewback.util.UserMapper;
import com.example.interviewback.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.example.interviewback.util.AuthUtil.loggedId;
import static com.example.interviewback.util.ValidationUtil.generateUsername;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final MailService mailService;

    private final ResetPassTokenRepository resetPassTokenRepository;
    private final ScheduledInterviewRepository scheduledInterviewRepository;
    @Value("${spring.security.reset-password.expired-in}")
    private Long expiredIn;

    @Override
    public UserResponse create(UserRequest userRequest) {
        User user = UserMapper.toEntity(userRequest);
        String username = generateUsername(user.getFullName());
        String password = ValidationUtil.generatePassword();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setStatus(UserStatus.ACTIVE.getCode());
        user.setCreatedBy(loggedId());
        user.setCreatedAt(LocalDateTime.now());
        try {
            userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new ApiException(400, "Email already exists!");
        }

        user.setUsername(username + user.getUserId());
        userRepository.save(user);

        user.setPassword(password);
        sendMail(user, "ACCOUNT INFO", Stream.of(user.getEmail()).toArray(String[]::new));
        return UserMapper.toResponse(user);
    }

    private void sendMail(User user, String subject, String[] emails) {
        User admin = userRepository.findById(user.getCreatedBy()).orElseThrow(() -> new ApiException(404, "User not found!"));
        AccountMail mail = AccountMail.builder()
                .fullName(user.getFullName())
                .username(user.getUsername())
                .password(user.getPassword())
                .recruiter(admin.getEmail())
                .build();

        Context context = new Context();
        context.setVariable("data", mail);
        mailService.sendEmail(emails, subject, "account", context);
    }

    @Override
    public UserResponse getById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ApiException(404, "User not found!"));
        return UserMapper.toResponse(user);
    }

    @Override
    public UserResponse update(Long id, UserRequest userRequest) {
        User user = userRepository.findById(id).orElseThrow(() -> new ApiException(404, "User not found!"));
        user = UserMapper.toEntity(user, userRequest);
        user.setUsername(generateUsername(user.getFullName()) + user.getUserId());
        user.setUpdatedBy(loggedId());
        user.setUpdatedAt(LocalDateTime.now());
        try {
            userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new ApiException(400, "Email already exists!");
        }
        return UserMapper.toResponse(user);
    }

    @Override
    public UserResponse updateStatus(Long id, UserStatus status) {
        User user = userRepository.findById(id).orElseThrow(() -> new ApiException(404, "User not found!"));
        user.setStatus(status.getCode());
        user.setUpdatedBy(loggedId());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return UserMapper.toResponse(user);
    }

    @Override
    public PageResponse<UserResponse> getList(SearchRequest searchRequest, Integer page, Integer limit) {
        if (page < 1 || limit < 1) throw new ApiException(400, "bad request!");
        Specification<User> specification = PageUtil.buildSpecification(User.class,
                        searchRequest.setStatusCodes(UserStatus.findContain(searchRequest.getFieldValue())))
                .or(PageUtil.byNestedField("role", "roleName", searchRequest.getFieldValue()))
                .and(PageUtil.byRole(searchRequest.getRoleId()));
        Pageable pageable = PageUtil.sortedMultiple(page, limit, List.of("role", "createdAt"));

        Page<User> pages = userRepository.findAll(specification, pageable);
        return PageUtil.toPageResponse(pages, page, limit,
                pages.map(UserMapper::toResponse).toList());
    }

    @Override
    public LoginUserResponse login(LoginUserRequest loginUserRequest) {
        User user = userRepository.findByUsername(loginUserRequest.getUsername());
        if (user == null || !passwordEncoder.matches(loginUserRequest.getPassword(), user.getPassword()))
            throw new ApiException(401, "UNAUTHORIZED");
        return LoginUserResponse.builder()
                .token(jwtService.generateToken(
                        AuthUser.builder()
                                .userId(user.getUserId())
                                .role(user.getRole())
                                .build()))
                .userId(user.getUserId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(SimpleRoleResponse.builder()
                        .roleId(user.getRole().getRoleId())
                        .roleName(user.getRole().getRoleName())
                        .build())
                .build();
    }

    @Override
    public List<SimpleUserResponse> getListByRole(Long roleId) {
        List<User> users = userRepository.findByRoleRoleIdAndStatus(roleId, UserStatus.ACTIVE.getCode());
        return users.stream().map(u -> SimpleUserResponse.builder()
                .userId(u.getUserId())
                .fullName(u.getFullName())
                .username(u.getUsername())
                .build()).toList();
    }

    @Override
    public String forgotPassword(UserEmailRequest request) {
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) throw new ApiException(404, "User not found!");
        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime expiredAt = createdAt.plusHours(expiredIn);
        ResetPassToken reset = ResetPassToken.builder()
                .token(UUID.randomUUID().toString())
                .createdAt(createdAt)
                .expiredAt(expiredAt)
                .isValid(true)
                .user(user)
                .build();
        resetPassTokenRepository.save(reset);

        sendMailReset(ForgotPasswordMail.builder()
                        .fullName(user.getFullName())
                        .link("http://localhost:8082/api/forgot-password/reset/" + reset.getToken())
                        .email(user.getEmail())
                        .build(),
                "RESET PASSWORD",
                Stream.of(user.getEmail()).toArray(String[]::new));
        return "SUCCESS";
    }

    private void sendMailReset(ForgotPasswordMail mail, String subject, String[] emails) {

        Context context = new Context();
        context.setVariable("data", mail);
        mailService.sendEmail(emails, subject, "forgot_password", context);
    }

    @Override
    public SimpleUserResponse checkToken(String token) {
        ResetPassToken resetPassToken = resetPassTokenRepository.findByToken(token);
        if (resetPassToken.getExpiredAt().isBefore(LocalDateTime.now())) {
            resetPassToken.setValid(false);
            resetPassTokenRepository.save(resetPassToken);
        }
        return resetPassToken.isValid()
                ? SimpleUserResponse.builder().username(resetPassToken.getUser().getUsername()).build()
                : null;
    }

    @Override
    public UserResponse resetPassword(String token, ResetPasswordRequest request) {
        ResetPassToken resetPassToken = resetPassTokenRepository.findByToken(token);
        User user = resetPassToken.getUser();

        if (!request.getPassword().equals(request.getConfirmPassword())
                || !ValidationUtil.validatePassword(request.getPassword())) return null;
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        resetPassToken.setValid(false);

        userRepository.save(user);
        resetPassTokenRepository.save(resetPassToken);
        return UserMapper.toResponse(user);
    }

    @Override
    public List<SimpleUserResponse> searchByRoleAndName(Long roleId, String searchValue) {
        List<User> users = userRepository.findAllByRoleAndSearchValue(Role.builder()
                .roleId(roleId).build(), searchValue);
        return users.stream().map(u -> SimpleUserResponse.builder()
                .userId(u.getUserId())
                .fullName(u.getFullName())
                .username(u.getUsername())
                .build()).toList();
    }

    @Override
    public List<SimpleUserResponse> searchInterviewersBySkills(List<String> skills, String searchValue) {
        Set<User> users = new HashSet<>();
        for (String skill : skills) {
            users.addAll(userRepository.findByRoleIdAndSkill(4L,
                    Skill.valueOf(skill.toUpperCase()).getValue(), searchValue));
        }
        return users.stream().map(u -> SimpleUserResponse.builder()
                .userId(u.getUserId())
                .fullName(u.getFullName())
                .username(u.getUsername())
                .build()).toList();
    }

    @Override
    public ScheduledInterviewResponse getListSchedulesByInterviewer(Long interviewerId, LocalDate date) {
        if(date == null) date = LocalDate.now();
        LocalDate previousSunday = TimeUtil.getPreviousSunday(date);
        LocalDate nextSaturday = TimeUtil.getNextSaturday(date);
        LocalDateTime startOfWeek = previousSunday.atStartOfDay();
        LocalDateTime endOfWeek = nextSaturday.atTime(LocalTime.MAX);
        List<ScheduledInterview> scheduledInterviews = scheduledInterviewRepository.findByUserIdAndDate(interviewerId, startOfWeek, endOfWeek);
        User interviewer = userRepository.findById(interviewerId).orElseThrow(() -> new ApiException(404, "User not found!"));
        return ScheduledInterviewResponse.builder()
                .user(SimpleUserResponse.builder()
                        .userId(interviewer.getUserId())
                        .username(interviewer.getUsername())
                        .fullName(interviewer.getFullName())
                        .build())
                .interviews(scheduledInterviews.stream()
                        .map(s -> SimpleInterviewResponse.builder()
                                .interviewId(s.getInterview().getInterviewId())
                                .title(s.getInterview().getTitle())
                                .startTime(s.getStartTime())
                                .endTime(s.getEndTime())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}
