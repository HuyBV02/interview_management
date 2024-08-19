package com.example.interviewback.controller.role;

import com.example.interviewback.commons.entity.role.Role;
import com.example.interviewback.commons.response.DfResponse;
import com.example.interviewback.service.role.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin
public class RoleController {

    private final RoleService roleService;

    @GetMapping("/roles")
    public DfResponse<List<Role>> getAllRoles() {
        return DfResponse.ok(roleService.getAllRoles());
    }

    @GetMapping("/role_names")
    public DfResponse<List<String>> getAllRoleNames() {
        return DfResponse.ok(roleService.getAllRoleNames());
    }
}
