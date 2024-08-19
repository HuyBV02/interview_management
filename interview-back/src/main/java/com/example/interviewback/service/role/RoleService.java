package com.example.interviewback.service.role;

import com.example.interviewback.commons.entity.role.Role;

import java.util.List;

public interface RoleService {
    List<Role> getAllRoles();
    List<String> getAllRoleNames();
}
