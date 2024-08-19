import React, { useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse, isAfter } from "date-fns";
import axios from "axios";
import { Row, Col, Form, Button } from "react-bootstrap";
import Alert from "../Alert";

const AddCandidateForm = ({
  candidate,
  setCandidate,
  skillsOptions,
  genderOptions,
  yearOfExpOptions,
  highestLevelOptions,
  positionOptions,
  recruiters,
  submitted,
  jobOptions,
  handleCloseAdd,
  setData,
  data,
  setReRender,
  reRender,
  setAlert,
}) => {
  const [errors, setErrors] = useState({});
  const [jobCvPairs, setJobCvPairs] = useState(candidate.jobs || []);
  const [alertAdd, setAlertAdd] = useState(null);

  const handleAlertClose = () => {
    setAlertAdd(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCandidate({ ...candidate, [name]: value });
  };

  const handleInputBlur = (event) => {
    const { name, value } = event.target;
    validateField(name, value);
  };

  const recruiterOptions = recruiters.map((user) => ({
    value: user.userId,
    label: user.fullName,
  }));

  const jobOption = jobOptions?.map((job) => ({
    value: job.jobId,
    label: job.title,
  }));

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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const cvResponse = response.data.data;

      if (field === "cv") {
        setCandidate({ ...candidate, cv: cvResponse });
      } else {
        setJobCvPairs((prev) => {
          const updatedPairs = prev.map((pair) =>
            pair.jobId === field ? { ...pair, cv: cvResponse } : pair
          );

          if (!updatedPairs.find((pair) => pair.jobId === field)) {
            updatedPairs.push({ jobId: field, cv: cvResponse });
          }
          return updatedPairs;
        });
        setCandidate((prev) => {
          const updatedJobs = prev.jobs.map((job) =>
            job.jobId === field ? { ...job, cv: cvResponse } : job
          );

          if (!updatedJobs.find((job) => job.jobId === field)) {
            updatedJobs.push({ jobId: field, cv: cvResponse });
          }
          return { ...prev, jobs: updatedJobs };
        });
      }
      console.log("CV upload response:", cvResponse);
    } catch (error) {
      console.error("Error uploading CV:", error);
    }
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setCandidate({ ...candidate, [name]: selectedOption.value });
    validateField(name, selectedOption.value);
  };

  const handleSkillsChange = (selectedOptions) => {
    const skills = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setCandidate({ ...candidate, skills });
    validateField("skills", skills);
  };

  const handleJobsChange = (selectedOptions) => {
    const jobIds = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    const newJobCvPairs = jobIds.map((jobId) => ({
      jobId,
      cv: jobCvPairs.find((pair) => pair.jobId === jobId)?.cv || null,
    }));
    setJobCvPairs(newJobCvPairs);
    setCandidate({ ...candidate, jobs: newJobCvPairs });
    validateField("jobs", jobIds);
  };

  const handleDateChange = (date) => {
    const formattedDate = format(date, "dd-MM-yyyy");
    setCandidate({ ...candidate, dob: formattedDate });
    validateField("dob", formattedDate);
  };

  const createSelectOptions = (options) => {
    return options?.map((option) => ({ value: option, label: option }));
  };

  const handleSelectChangeSingle = (selectedOption, type) => {
    setCandidate({
      ...candidate,
      [type]: selectedOption ? selectedOption.value : "",
    });
    validateField(type, selectedOption ? selectedOption.value : "");
  };

  const token = localStorage.getItem("token");

  const validateField = (name, value) => {
    let error = "";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const namePattern = /^[a-zA-Z\s]+$/;
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
        // else if (!namePattern.test(value)) {
        //   error = "Full name should not contain numbers";
        // }
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
      case "address":
      case "position":
      case "jobs":
      case "gender":
      case "recruiterId":
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
      "recruiterId",
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
  const handleAddCandidate = async () => {
    if (!validateForm()) return;
    if (validateForm()) {
      await axios
        .post("http://localhost:8082/api/candidate", candidate, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response);

          setData([...data, response.data.data]);
          handleCloseAdd();
          setReRender(!reRender);
          setAlert({
            type: "success",
            title: "Success",
            message: "Create new candidate successfully",
          });
          setTimeout(() => {
            setAlert(null);
          }, 3000);
        })
        .catch((error) => {
          console.error("There was an error adding the candidate!", error);
          if (error.response.data.code === 400) {
            setAlertAdd({
              type: "error",
              title: "Failed",
              message: error.response.data.message,
            });
            setTimeout(() => setAlert(null), 3000);
          }
        });
    } else {
      setAlert({
        type: "error",
        title: "Failed",
        message: "Please fill out all required fields",
      });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  return (
    <div>
      {alertAdd && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-1000">
          <Alert
            type={alertAdd.type}
            title={alertAdd.title}
            message={alertAdd.message}
            onClose={handleAlertClose}
          />
        </div>
      )}
      <Form>
        <Row>
          <Col lg={6}>
            <Form.Group className="mb-1">
              <Form.Label>
                Full name <span className="text-red-600">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Type a name..."
                name="fullName"
                value={candidate.fullName}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                isInvalid={!!errors.fullName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.fullName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label>D.O.B</Form.Label>
              <div>
                <DatePicker
                  className="border"
                  selected={
                    candidate.dob
                      ? parse(candidate.dob, "dd-MM-yyyy", new Date())
                      : null
                  }
                  onChange={handleDateChange}
                  dateFormat="dd-MM-yyyy"
                />
              </div>
              {errors.dob && <div className="text-red-600">{errors.dob}</div>}
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label>
                Phone Number<span className="text-red-600">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Type a phone number..."
                name="phoneNumber"
                value={candidate.phoneNumber}
                onChange={handleInputChange}
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
                name="skills"
                options={createSelectOptions(skillsOptions)}
                value={createSelectOptions(skillsOptions).filter((option) =>
                  candidate.skills.includes(option.value)
                )}
                onChange={handleSkillsChange}
                isMulti
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
                name="jobs"
                options={jobOption}
                value={jobOption.filter((option) =>
                  jobCvPairs.some((pair) => pair.jobId === option.value)
                )}
                onChange={handleJobsChange}
                isMulti
              />
              {errors.jobs && <div className="text-red-600">{errors.jobs}</div>}
            </Form.Group>
            {jobCvPairs.map((pair, index) => (
              <Form.Group className="mb-1" key={index}>
                <Form.Label>
                  Upload CV for{" "}
                  {jobOption.find((job) => job.value === pair.jobId)?.label}
                </Form.Label>
                <Form.Control
                  type="file"
                  onChange={(event) => handleFileChange(event, pair.jobId)}
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
                type="email"
                placeholder="Type an email..."
                name="email"
                value={candidate.email}
                onChange={handleInputChange}
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
                onBlur={handleInputBlur}
                isInvalid={!!errors.address}
              />
              <Form.Control.Feedback type="invalid">
                {errors.address}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label>
                Gender<span className="text-red-600">*</span>
              </Form.Label>
              <Select
                name="gender"
                options={createSelectOptions(genderOptions)}
                value={createSelectOptions(genderOptions).find(
                  (option) => option.value === candidate.gender
                )}
                onChange={handleSelectChange}
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
                options={recruiterOptions}
                value={recruiterOptions?.find(
                  (option) => option.value === candidate.recruiterId
                )}
                onChange={(selectedOption) =>
                  handleSelectChangeSingle(selectedOption, "recruiterId")
                }
                isInvalid={!!errors.recruiterId}
              />
              {errors.recruiterId && (
                <div className="text-red-600">{errors.recruiterId}</div>
              )}
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label>Year of Experience</Form.Label>
              <Select
                name="yearOfExp"
                options={createSelectOptions(yearOfExpOptions)}
                value={createSelectOptions(yearOfExpOptions).find(
                  (option) => option.value === candidate.yearOfExp
                )}
                onChange={handleSelectChange}
              />
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label>
                Highest Level
                <span className="text-red-600">*</span>
              </Form.Label>
              <Select
                name="highestLevel"
                options={createSelectOptions(highestLevelOptions)}
                value={createSelectOptions(highestLevelOptions).find(
                  (option) => option.value === candidate.highestLevel
                )}
                onChange={handleSelectChange}
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
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="note"
                value={candidate.note}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <div className="flex mt-5 gap-2 justify-end">
            <Button variant="primary" onClick={handleAddCandidate}>
              Create Candidate
            </Button>
          </div>
        </Row>
      </Form>
    </div>
  );
};

export default AddCandidateForm;
