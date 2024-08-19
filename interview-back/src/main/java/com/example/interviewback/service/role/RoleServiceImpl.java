package com.example.interviewback.service.role;

import com.example.interviewback.commons.entity.role.Role;
import com.example.interviewback.repository.role.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService{

    private final RoleRepository roleRepository;

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public List<String> getAllRoleNames() {
        return roleRepository.findAll()
                .stream()
                .map(Role::getRoleName)
                .collect(Collectors.toList());
    }


}
