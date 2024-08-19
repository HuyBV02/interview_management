package com.example.interviewback.controller.user;

import com.example.interviewback.commons.request.user.ResetPasswordRequest;
import com.example.interviewback.commons.request.user.UserEmailRequest;
import com.example.interviewback.commons.response.DfResponse;
import com.example.interviewback.commons.response.user.SimpleUserResponse;
import com.example.interviewback.commons.response.user.UserResponse;
import com.example.interviewback.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/forgot-password")
public class ForgotPasswordController {
    private final UserService userService;

    @PostMapping("")
    @ResponseBody
    public DfResponse<String> forgotPassword(@Valid @RequestBody UserEmailRequest userEmailRequest) {
        return DfResponse.ok(userService.forgotPassword(userEmailRequest));
    }

    @GetMapping(value = "/reset/{token}")
    public String resetView(@PathVariable String token, Model model, @RequestParam(name = "status", required = false) String status) {
        model.addAttribute("status", status);
        SimpleUserResponse userResponse = userService.checkToken(token);
        if (userResponse == null) return "not_found";
        model.addAttribute("token", token);
        model.addAttribute("passReset", new ResetPasswordRequest());
        return "reset_password";
    }

    @PostMapping("/reset/{token}")
    public String resetPassword(@PathVariable String token,
                                @Valid @ModelAttribute("passReset") ResetPasswordRequest request,
                                RedirectAttributes redirectAttributes) {
        UserResponse userResponse = userService.resetPassword(token, request);
        if (userResponse == null) {
            redirectAttributes.addAttribute("status", "error");
        } else {
            redirectAttributes.addAttribute("status", "success");
        }
        return "redirect:/api/forgot-password/reset/" + token;
    }
}
