import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Row, Col, Form, Button } from "react-bootstrap";
import moment from "moment";
import axios from "axios";
import Alert from "../Alert";

const AddInterviewSchedule = ({
  formData,
  recruiters,
  candidates,
  jobs,
  setFormData,
  selectedInterviewers,
  setSelectedInterviewers,
  jobFromCandidate,
  candidateFromCandidate,
  handleCloseModalAdd,
  setAlert,
  setInterviews,
  interviews,
}) => {
  const [candidateWithJob, setCandidateWithJob] = useState([]);
  const [interviewersByJob, setInterviewersByJob] = useState([]);
  const [interByJob, setInterByJob] = useState([]);
  const [errors, setErrors] = useState({});

  const [alertUpdate, setAlertUpdate] = useState(null);
  const handleAlertClose = () => {
    setAlertUpdate(null);
  };

  console.log(selectedInterviewers);

  // Handle generic input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "candidateId" || name === "jobId" || name === "recruiterId"
          ? parseInt(value, 10)
          : value,
    });
    validateField(name, value);
  };

  // Handle select change for single select
  const handleSelectChangeSingle = (selectedOption, type) => {
    setFormData({
      ...formData,
      [type]: selectedOption ? selectedOption.value : "",
    });

    if (type === "candidateId" && selectedOption) {
      const choice = selectedOption.value;
      console.log(choice);
      setCandidateWithJob(
        candidates?.find((candidate) => candidate.candidateId === choice)
      );
    }

    if (type === "jobId" && selectedOption) {
      const choice = selectedOption.value;
      console.log(choice);
      setInterByJob(jobs?.find((job) => job.jobId === choice));
    }
    validateField(type, selectedOption ? selectedOption.value : "");
  };

  // Handle date changes
  const handleDateChange = (e, type) => {
    const date = moment(e.target.value, "YYYY-MM-DD").format("DD-MM-YYYY");
    if (type === "start") {
      setFormData({
        ...formData,
        startTime: `${date} ${formData.startTime.split(" ")[1] || "00:00"}`,
        endTime: `${date} ${formData.endTime.split(" ")[1] || "00:00"}`,
      });
    } else if (type === "end") {
      setFormData({
        ...formData,
        endTime: `${date} ${formData.endTime.split(" ")[1] || "00:00"}`,
      });
    }
    validateDateTime();
  };

  // Handle time changes
  const handleTimeChange = (e, type) => {
    const time = e.target.value;
    if (type === "start") {
      setFormData({
        ...formData,
        startTime: `${formData.startTime.split(" ")[0] || ""} ${time}`,
      });
    } else if (type === "end") {
      setFormData({
        ...formData,
        endTime: `${formData.startTime.split(" ")[0] || ""} ${time}`,
      });
    }
    validateDateTime();
  };

  // Handle select changes for interviewers
  const handleSelectChange = (selectedOptions, type) => {
    if (type === "interviewer") {
      setSelectedInterviewers(selectedOptions);
      const ids = selectedOptions.map((option) => option.value);
      setFormData({
        ...formData,
        interviewerIds: ids,
      });
      validateField(type, ids);
    }
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    if (!value) {
      newErrors[name] = `${name.replace("Id", "")} is required`;
    } else {
      delete newErrors[name];
    }

    setErrors(newErrors);
  };
  const validateDateTime = () => {
    const newErrors = { ...errors };
    const now = moment();
    const startDateTime = moment(formData.startTime, "DD-MM-YYYY HH:mm");
    const endDateTime = moment(formData.endTime, "DD-MM-YYYY HH:mm");

    if (startDateTime.isBefore(now)) {
      newErrors.startTime = "Start time must be in the future";
    } else {
      delete newErrors.startTime;
    }

    if (endDateTime.isBefore(startDateTime)) {
      newErrors.endTime = "End time must be after start time";
    } else {
      delete newErrors.endTime;
    }

    setErrors(newErrors);
  };

  const token = localStorage.getItem("token");
  const getInterviewer = async () => {
    await axios
      .post(
        `http://localhost:8082/api/user/interviewers?search`,
        { skills: interByJob.skills },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setInterviewersByJob(response.data.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (interByJob && interByJob.jobId) {
      getInterviewer();
    }
  }, [interByJob]);

  // Fetch interviewers when candidateFromCandidate is provided
  useEffect(() => {
    if (candidateFromCandidate && jobFromCandidate) {
      // getInterviewer(jobFromCandidate.skills);
      setCandidateWithJob(
        candidates?.find(
          (candidate) =>
            candidate.candidateId === candidateFromCandidate.candidateId
        )
      );
      setInterByJob(jobs?.find((job) => job.jobId === jobFromCandidate.jobId));
    }
  }, [candidateFromCandidate, jobFromCandidate, candidates, jobs]);

  // Prepare options for Select components
  const interviewerOptions = interviewersByJob?.map((user) => ({
    value: user.userId,
    label: user.fullName,
  }));
  const recruiterOptions = recruiters?.map((user) => ({
    value: user.userId,
    label: user.fullName,
  }));
  const candidateOptions = candidates?.map((candidate) => ({
    value: candidate.candidateId,
    label: candidate.fullName,
  }));

  const jobOptions = candidateWithJob?.jobs?.map((job) => ({
    value: job.jobId,
    label: job.title,
  }));

  // Set default values if candidateFromCandidate is not null
  useEffect(() => {
    if (candidateFromCandidate) {
      setFormData((prevData) => ({
        ...prevData,
        candidateId: candidateFromCandidate.candidateId,
        jobId: jobFromCandidate.jobId,
      }));
      setCandidateWithJob(
        candidates?.find(
          (candidate) =>
            candidate.candidateId === candidateFromCandidate.candidateId
        )
      );
      setInterByJob(jobs?.find((job) => job.jobId === jobFromCandidate.jobId));
    }
  }, [candidateFromCandidate, jobFromCandidate, candidates, jobs, setFormData]);

  const handleSubmit = async () => {
    // Validation logic
    const newErrors = {};
    const now = moment();
    const startDateTime = moment(formData.startTime, "DD-MM-YYYY HH:mm");
    const endDateTime = moment(formData.endTime, "DD-MM-YYYY HH:mm");

    if (!formData.title) newErrors.title = "Schedule title is required";
    if (!formData.candidateId)
      newErrors.candidateId = "Candidate name is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";
    if (!formData.jobId) newErrors.jobId = "Job is required";
    if (!formData.interviewerIds || formData.interviewerIds.length === 0)
      newErrors.interviewerIds = "At least one interviewer is required";
    if (!formData.recruiterId) newErrors.recruiterId = "Recruiter is required";
    if (startDateTime.isBefore(now))
      newErrors.startTime = "Start time must be in the future";
    if (endDateTime.isBefore(startDateTime))
      newErrors.endTime = "End time must be after start time";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dataAdd = {
      title: formData.title,
      startTime: formData.startTime,
      endTime: formData.endTime,
      note: formData.note,
      location: formData.location,
      meetingId: formData.meetingId,
      candidateId: formData.candidateId,
      jobId: formData.jobId,
      recruiterId: formData.recruiterId,
      interviewerIds: formData.interviewerIds,
    };

    await axios
      .post("http://localhost:8082/api/interview", dataAdd, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        handleCloseModalAdd();
        setInterviews([...interviews, response.data.data]);
        setAlert({
          type: "success",
          title: "Success",
          message: "Create new Interview successfully",
        });
        setTimeout(() => {
          setAlert(null);
        }, 2000);
      })
      .catch((error) => {
        console.error("There was an error submitting the form!", error);
        if (error.response.data.code === 409) {
          setAlertUpdate({
            type: "error",
            title: "Failed",
            message: error.response.data.message,
          });
          setTimeout(() => setAlert(null), 4000);
        } else {
          setAlert({
            type: "error",
            title: "Failed",
            message: "Create new Interview failed",
          });
          setTimeout(() => setAlert(null), 3000);
        }
      });
  };

  return (
    <div>
      {alertUpdate && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-1000">
          <Alert
            type={alertUpdate.type}
            title={alertUpdate.title}
            message={alertUpdate.message}
            onClose={handleAlertClose}
          />
        </div>
      )}
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>
                Schedule title
                <span className="text-red-600">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Type a title..."
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                isInvalid={!!errors.title}
              />
              <Form.Control.Feedback type="invalid">
                {errors.title}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>
                Candidate name
                <span className="text-red-600">*</span>
              </Form.Label>
              <Select
                options={candidateOptions}
                value={candidateOptions?.find(
                  (option) => option.value === formData.candidateId
                )}
                onChange={(selectedOption) => {
                  handleSelectChangeSingle(selectedOption, "candidateId");
                }}
                isDisabled={!!candidateFromCandidate}
              />
              {errors.candidateId && (
                <div className="text-danger">{errors.candidateId}</div>
              )}
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>
                Schedule Time
                <span className="text-red-600">*</span>
              </Form.Label>

              <Form.Control
                type="date"
                name="startTime"
                value={moment(formData.startTime, "DD-MM-YYYY").format(
                  "YYYY-MM-DD"
                )}
                onChange={(e) => handleDateChange(e, "start")}
                isInvalid={!!errors.startTime}
              />
              <Form.Control.Feedback type="invalid">
                {errors.startTime}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>
                <span>From</span>
              </Form.Label>
              <Form.Control
                type="time"
                value={moment(formData.startTime, "DD-MM-YYYY HH:mm").format(
                  "HH:mm"
                )}
                onChange={(e) => handleTimeChange(e, "start")}
                isInvalid={!!errors.startTime}
              />
              <Form.Control.Feedback type="invalid">
                {errors.startTime}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>To</Form.Label>
              <Form.Control
                type="time"
                value={moment(formData.endTime, "DD-MM-YYYY HH:mm").format(
                  "HH:mm"
                )}
                onChange={(e) => handleTimeChange(e, "end")}
                isInvalid={!!errors.endTime}
              />
              <Form.Control.Feedback type="invalid">
                {errors.endTime}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>
                Job<span className="text-red-600">*</span>
              </Form.Label>
              <Select
                isDisabled={!!candidateFromCandidate}
                options={jobOptions}
                value={jobOptions?.find(
                  (option) => option.value === formData.jobId
                )}
                onChange={(selectedOption) =>
                  handleSelectChangeSingle(selectedOption, "jobId")
                }
              />
              {errors.jobId && (
                <div className="text-danger">{errors.jobId}</div>
              )}
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>
                Interviewer
                <span className="text-red-600">*</span>
              </Form.Label>
              <Select
                isMulti
                options={interviewerOptions}
                value={selectedInterviewers}
                onChange={(selectedOptions) =>
                  handleSelectChange(selectedOptions, "interviewer")
                }
              />
              {errors.interviewerIds && (
                <div className="text-danger">{errors.interviewerIds}</div>
              )}
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>
                Recruiter<span className="text-red-600">*</span>
              </Form.Label>
              <Select
                options={recruiterOptions}
                value={recruiterOptions?.find(
                  (option) => option.value === formData.recruiterId
                )}
                onChange={(selectedOption) =>
                  handleSelectChangeSingle(selectedOption, "recruiterId")
                }
              />
              {errors.recruiterId && (
                <div className="text-danger">{errors.recruiterId}</div>
              )}
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Type a location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Meeting ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="meet.google.com/xyz-123"
                name="meetingId"
                value={formData.meetingId}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Form.Group className="mt-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Type schedule notes..."
              name="note"
              value={formData.note}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Row>
        <Row>
          <div className="flex justify-end mt-5">
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </Row>
      </Form>
    </div>
  );
};

export default AddInterviewSchedule;
