package com.example.interviewback.controller.constant.attributes;

import com.example.interviewback.commons.constant.attributes.*;
import com.example.interviewback.commons.response.DfResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/attributes")
public class AttributesController {

    @GetMapping("/benefit")
    public DfResponse<List<Benefit>> getListBenefit() {
        return DfResponse.ok(Benefit.getAll());
    }

    @GetMapping("/contract_type")
    public DfResponse<List<ContractType>> getListContractType() {
        return DfResponse.ok(ContractType.getAll());
    }

    @GetMapping("/department")
    public DfResponse<List<Department>> getListDepartment() {
        return DfResponse.ok(Department.getAll());
    }

    @GetMapping("/gender")
    public DfResponse<List<Gender>> getListGender() {
        return DfResponse.ok(Gender.getAll());
    }

    @GetMapping("highest_level")
    public DfResponse<List<HighestLevel>> getListHighestLevel() {
        return DfResponse.ok(HighestLevel.getAll());
    }

    @GetMapping("/level")
    public DfResponse<List<Level>> getListLevel() {
        return DfResponse.ok(Level.getAll());
    }

    @GetMapping("/position")
    public DfResponse<List<Position>> getListPosition() {
        return DfResponse.ok(Position.getAll());
    }

    @GetMapping("/result")
    public DfResponse<List<Result>> getListResult() {
        return DfResponse.ok(Result.getAll());
    }

    @GetMapping("/skill")
    public DfResponse<List<Skill>> getListSkill() {
        return DfResponse.ok(Skill.getAll());
    }
}
