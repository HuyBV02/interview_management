import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse, isAfter } from "date-fns";
import axios from "axios";

const UpdateCandidateForm = ({
  candidate,
  setCandidate,
  skillsOptions,
  genderOptions,
  yearOfExpOptions,
  highestLevelOptions,
  positionOptions,
  isEditing,
  recruiters,
  jobOptions,
  handleCloseUpdateModal,
  setIsEditing,
  setAlert,
  setData,
  data,
}) => {
  const [jobCvPairs, setJobCvPairs] = useState(candidate.jobs || []);
  const [errors, setErrors] = useState({});

  const roleId = localStorage.getItem("roleId");
  const token = localStorage.getItem("token");

  const handleJobsChange = (selectedOptions) => {
    const jobIds = selectedOptions
      ? selectedOptions?.map((option) => option.value)
      : [];
    const newJobCvPairs = jobIds?.map((jobId) => ({
      jobId,
      cv: jobCvPairs.find((pair) => pair.jobId === jobId)?.cv || null,
    }));
    setJobCvPairs(newJobCvPairs);
    setCandidate({ ...candidate, jobs: newJobCvPairs });
    validateField("jobs", jobIds);
  };

  const handleFileChange = async (event, field) => {
    const { files } = event.target;
    const file = files[0];
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:8082/api/candidate/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const cvResponse = response.data.data;
      setJobCvPairs((prev) => {
        const updatedPairs = prev?.map((pair) =>
          pair.jobId === field ? { ...pair, cv: cvResponse } : pair
        );
        if (!updatedPairs.find((pair) => pair.jobId === field)) {
          updatedPairs.push({ jobId, cv: cvResponse });
        }
        return updatedPairs;
      });
      setCandidate((prev) => {
        const updatedJobs = prev.jobs?.map((job) =>
          job.jobId === field ? { ...job, cv: cvResponse } : job
        );
        if (!updatedJobs.find((job) => job.jobId === field)) {
          updatedJobs.push({ jobId, cv: cvResponse });
        }
        return { ...prev, jobs: updatedJobs };
      });
    } catch (error) {
      console.error("Error uploading CV:", error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCandidate({ ...candidate, [name]: value });
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setCandidate({ ...candidate, [name]: selectedOption.value });
    validateField(name, selectedOption.value);
  };

  const handleSkillsChange = (selectedOptions) => {
    const skills = selectedOptions
      ? selectedOptions?.map((option) => option.value)
      : [];
    setCandidate({ ...candidate, skills });
    validateField("skills", skills);
  };

  const handleDateChange = (date) => {
    const formattedDate = format(date, "dd-MM-yyyy");
    setCandidate({ ...candidate, dob: formattedDate });
    validateField("dob", formattedDate);
  };

  const handleInputBlur = (event) => {
    const { name, value } = event.target;
    validateField(name, value);
  };

  // Hàm xử lý thay đổi Select
  const handleSelectChangeSingle = (selectedOption, type) => {
    if (type === "recruiterId") {
      const selectedRecruiter = recruiters.find(
        (recruiter) => recruiter.userId === selectedOption.value
      );
      setCandidate((prev) => ({
        ...prev,
        recruiter: selectedRecruiter,
      }));
      validateField(type, selectedOption.value);
    } else {
      setCandidate((prev) => ({
        ...prev,
        [type]: selectedOption ? selectedOption.value : "",
      }));
      validateField(type, selectedOption ? selectedOption.value : "");
    }
  };

  const createSelectOptions = (options) => {
    return options?.map((option) => ({ value: option, label: option }));
  };

  const recruiterOptions = recruiters?.map((user) => ({
    value: user.userId,
    label: user.fullName,
  }));

  const jobOption = jobOptions?.map((job) => ({
    value: job.jobId,
    label: job.title,
  }));

  const validateField = (name, value) => {
    let error = "";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]+$/;

    switch (name) {
      case "skills":
        if (Array.isArray(value) && value.length < 1) {
          error = "At least one skill is required";
        }
        break;
      case "fullName":
        if (!value) {
          error = "This field is required";
        }
        break;
      case "phoneNumber":
        if (!value) {
          error = "This field is required";
        } else if (!phonePattern.test(value)) {
          error = "Phone number should contain only digits";
        }
        break;
      case "email":
        if (!value) {
          error = "This field is required";
        } else if (!emailPattern.test(value)) {
          error = "Invalid email format";
        }
        break;
      case "jobs":
        if (Array.isArray(value) && value.length < 1) {
          error = "At least one job is required";
        }
        break;
      case "recruiterId":
      case "address":
      case "position":
      case "gender":
      case "highestLevel":
        if (!value) {
          error = "This field is required";
        }
        break;
      case "dob":
        if (isAfter(parse(value, "dd-MM-yyyy", new Date()), new Date())) {
          error = "DOB cannot be in the future";
        }
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const validateForm = () => {
    const requiredFields = [
      "fullName",
      "dob",
      "phoneNumber",
      "email",
      "position",
      "skills",
      "jobs",
      "gender",
      // "recruiterId",
      "highestLevel",
    ];
    let valid = true;
    requiredFields.forEach((field) => {
      if (
        !candidate[field] ||
        (Array.isArray(candidate[field]) && candidate[field].length === 0) ||
        errors[field]
      ) {
        validateField(field, candidate[field]);
        valid = false;
      }
    });
    return valid;
  };

  console.log(candidate);

  const handleUpdateCandidate = async () => {
    const candidateUpdate = {
      fullName: candidate.fullName,
      dob: candidate.dob,
      phoneNumber: candidate.phoneNumber,
      email: candidate.email,
      address: candidate.address,
      gender: candidate.gender,
      note: candidate.note,
      yearOfExp: candidate.yearOfExp,
      highestLevel: candidate.highestLevel,
      cv: candidate.cv,
      position: candidate.position,
      skills: candidate.skills,
      recruiterId: candidate.recruiter.userId,
      jobs: candidate.jobs?.map((job) => ({ jobId: job.jobId, cv: job.cv })),
    };
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8082/api/candidate/${candidate.candidateId}`,
        candidateUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedCandidate = response.data.data;
      const updatedData = data?.map((item) =>
        item.candidateId === updatedCandidate.candidateId
          ? updatedCandidate
          : item
      );
      setData(updatedData);
      handleCloseUpdateModal();
      setAlert({
        type: "success",
        title: "Success",
        message: "Update new candidate successfully",
      });
      setTimeout(() => {
        setAlert(null);
      }, 2000);
    } catch (error) {
      console.error("There was an error updating the candidate!", error);
      setAlert({
        type: "error",
        title: "Failed",
        message: "Update new candidate failed",
      });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  return (
    <div>
      <Form>
        <Row>
          <Col lg={6}>
            <Form.Group className="mb-1">
              <Form.Label>
                Full name<span className="text-red-600">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Type a name..."
                name="fullName"
                value={candidate.fullName}
                onChange={handleInputChange}
                disabled={!isEditing}
                onBlur={handleInputBlur}
                isInvalid={!!errors.fullName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.fullName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label>D.O.B</Form.Label>
              <br />
              <DatePicker
                selected={
                  candidate.dob
                    ? parse(candidate.dob, "dd-MM-yyyy", new Date())
                    : null
                }
                onChange={handleDateChange}
                dateFormat="dd-MM-yyyy"
                className="form-control mx-5"
                disabled={!isEditing}
              />
              {errors.dob && <div className="text-red-600">{errors.dob}</div>}
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label>
                Phone number<span className="text-red-600">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Type a number..."
                name="phoneNumber"
                value={candidate.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                onBlur={handleInputBlur}
                isInvalid={!!errors.phoneNumber}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phoneNumber}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-1">
              <Form.Label>
                Position<span className="text-red-600">*</span>
              </Form.Label>
              <Select
                name="position"
                options={createSelectOptions(positionOptions)}
                value={createSelectOptions(positionOptions).find(
                  (option) => option.value === candidate.position
                )}
                onChange={handleSelectChange}
                isDisabled={!isEditing}
                onBlur={() => validateField("position", candidate.position)}
                isInvalid={!!errors.position}
              />
              {errors.position && (
                <div className="text-red-600">{errors.position}</div>
              )}
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label>
                Skills<span className="text-red-600">*</span>
              </Form.Label>
              <Select
                isMulti
                name="skills"
                options={createSelectOptions(skillsOptions)}
                value={createSelectOptions(skillsOptions).filter((option) =>
                  candidate.skills.includes(option.value)
                )}
                onChange={handleSkillsChange}
                isDisabled={!isEditing}
                onBlur={() => validateField("skills", candidate.skills)}
              />
              {errors.skills && (
                <Form.Text className="text-danger">{errors.skills}</Form.Text>
              )}
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label>
                Jobs<span className="text-red-600">*</span>
              </Form.Label>
              <Select
                isDisabled={!isEditing}
                name="jobs"
                options={jobOption}
                value={jobOption.filter((option) =>
                  jobCvPairs.some((pair) => pair.jobId === option.value)
                )}
                onBlur={() => validateField("jobs", candidate.jobs)}
                onChange={handleJobsChange}
                isMulti
              />
              {errors.jobs && <div className="text-red-600">{errors.jobs}</div>}
            </Form.Group>
            {jobCvPairs?.map((pair, index) => (
              <Form.Group className="mb-1" key={index}>
                <Form.Label>
                  Upload CV for{" "}
                  {jobOption.find((job) => job.value === pair.jobId)?.label}
                </Form.Label>
                <Form.Control
                  type="file"
                  onChange={(event) => handleFileChange(event, pair.jobId)}
                  disabled={!isEditing}
                />
                {pair.cv && (
                  <Form.Text className="text-success">
                    <a href={pair.cv}>View CV</a>
                  </Form.Text>
                )}
              </Form.Group>
            ))}
          </Col>
          <Col lg={6}>
            <Form.Group className="mb-1">
              <Form.Label>
                Email<span className="text-red-600">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Type an email..."
                name="email"
                value={candidate.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                onBlur={handleInputBlur}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Type an address..."
                name="address"
                value={candidate.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                onBlur={handleInputBlur}
                isInvalid={!!errors.address}
              />
              <Form.Control.Feedback type="invalid">
                {errors.address}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label>Gender</Form.Label>
              <Select
                name="gender"
                options={createSelectOptions(genderOptions)}
                value={createSelectOptions(genderOptions).find(
                  (option) => option.value === candidate.gender
                )}
                onChange={handleSelectChange}
                isDisabled={!isEditing}
                onBlur={() => validateField("gender", candidate.gender)}
                isInvalid={!!errors.gender}
              />
              {errors.gender && (
                <div className="text-red-600">{errors.gender}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-1">
              <Form.Label>
                Recruiter<span className="text-red-600">*</span>
              </Form.Label>
              <Select
                type="recruiterId"
                options={recruiterOptions}
                value={recruiterOptions?.find(
                  (option) => option.value === candidate?.recruiter?.userId
                )}
                onChange={(selectedOption) =>
                  handleSelectChangeSingle(selectedOption, "recruiterId")
                }
                isDisabled={!isEditing}
                isInvalid={!!errors.recruiterId}
              />
              {errors.recruiterId && (
                <div className="text-red-600">{errors.recruiterId}</div>
              )}
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label>Highest level</Form.Label>
              <Select
                name="highestLevel"
                options={createSelectOptions(highestLevelOptions)}
                value={createSelectOptions(highestLevelOptions).find(
                  (option) => option.value === candidate.highestLevel
                )}
                onChange={handleSelectChange}
                isDisabled={!isEditing}
                onBlur={() =>
                  validateField("highestLevel", candidate.highestLevel)
                }
                isInvalid={!!errors.highestLevel}
              />
              {errors.highestLevel && (
                <div className="text-red-600">{errors.highestLevel}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-1">
              <Form.Label>Year of experience</Form.Label>
              <Select
                name="yearOfExp"
                options={createSelectOptions(yearOfExpOptions)}
                value={createSelectOptions(yearOfExpOptions).find(
                  (option) => option.value === candidate.yearOfExp
                )}
                onChange={handleSelectChange}
                isDisabled={!isEditing}
              />
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Type a note..."
                name="note"
                value={candidate.note}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="flex justify-end mt-3">
          {!isEditing ? (
            <Button variant="primary" onClick={handleEditClick}>
              Edit
            </Button>
          ) : (
            <Button onClick={handleUpdateCandidate}>Save changes</Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default UpdateCandidateForm;
