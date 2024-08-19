package com.example.interviewback.repository.user;

import com.example.interviewback.commons.entity.role.Role;
import com.example.interviewback.commons.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    @Query("select u from User u where u.username = :username and u.status = 1")
    User findByUsername(String username);

    List<User> findByRoleRoleIdAndStatus(Long roleId, Integer status);

    List<User> findByUserIdIn(List<Long> ids);

    User findByUsernameAndEmail(String username, String email);

    User findByEmail(String email);

    @Query("select u from User u where u.role = :role and (u.username like %:searchValue% or u.fullName like %:searchValue%) and u.status = 1")
    List<User> findAllByRoleAndSearchValue(Role role, String searchValue);

    @Query("select u from User u where u.role.roleId = :roleId and " +
            "u.skills like %:skill% and " +
            "u.status = 1 and " +
            "(u.fullName like %:searchValue% or u.username like %:searchValue%)")
    List<User> findByRoleIdAndSkill(Long roleId, String skill, String searchValue);
}
