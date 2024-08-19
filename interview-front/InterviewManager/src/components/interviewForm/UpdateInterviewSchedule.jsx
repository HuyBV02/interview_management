import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Row, Col, Form, Button } from "react-bootstrap";
import moment from "moment";
import axios from "axios";
import Alert from "../Alert";

const UpdateInterviewSchedule = ({
  formData,
  jobs,
  setFormData,
  interviews,
  setAlert,
  setInterviews,
  handleCloseModalUpdate,
}) => {

  const [interviewersByJob, setInterviewersByJob] = useState([]);
  const [errors, setErrors] = useState({});
  const [alertUpdate, setAlertUpdate] = useState(null);

  const handleAlertClose = () => {
    setAlertUpdate(null);
  };

  const interByJob = jobs.find((job) => job.jobId === formData.job.jobId);

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
  const interviewerOptions = interviewersByJob.map((user) => ({
    value: user.userId,
    label: user.fullName,
  }));

  const selectedInterviewersOptions = formData.interviewers.map(
    (interviewer) => ({
      value: interviewer.userId,
      label: interviewer.fullName,
    })
  );

  const handleSelectChange = (selectedOptions) => {
    const interviewers = selectedOptions
      ? selectedOptions.map((option) => ({
          userId: option.value,
          fullName: option.label,
        }))
      : [];
    setFormData({ ...formData, interviewers });
  };

  console.log(formData.interviewers.map((interviewer) => interviewer.userId));
  const handleInterviewUpdate = async () => {
    const newErrors = {};
    const now = moment();
    const startDateTime = moment(formData.startTime, "DD-MM-YYYY HH:mm");
    const endDateTime = moment(formData.endTime, "DD-MM-YYYY HH:mm");

    if (!formData.title) newErrors.title = "Schedule title is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";
    if (
      !Array.isArray(formData.interviewers) ||
      formData.interviewers.map((interviewer) => interviewer.userId).length ===
        0
    )
      newErrors.interviewerIds = "At least one interviewer is required";
    if (startDateTime.isBefore(now))
      newErrors.startTime = "Start time must be in the future";
    if (endDateTime.isBefore(startDateTime))
      newErrors.endTime = "End time must be after start time";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dataUpdate = {
      title: formData.title,
      startTime: formData.startTime,
      endTime: formData.endTime,
      note: formData.note,
      location: formData.location,
      meetingId: formData.meetingId,
      candidateId: formData.candidate.candidateId,
      jobId: formData.job.jobId,
      recruiterId: formData.recruit.userId,
      interviewerIds: formData.interviewers.map(
        (interviewer) => interviewer.userId
      ),
    };

    await axios
      .put(
        `http://localhost:8082/api/interview/${formData.interviewId}`,
        dataUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const updatedCandidate = response.data.data;
        const updatedData = interviews.map((item) =>
          item.interviewId === updatedCandidate.interviewId
            ? updatedCandidate
            : item
        );
        setInterviews(updatedData);
        handleCloseModalUpdate();

        setAlert({
          type: "success",
          title: "Success",
          message: "Update new candidate successfully",
        });
        setTimeout(() => {
          setAlert(null);
        }, 2000);
      })
      .catch((error) => {
        // console.error("There was an error updating the candidate!", error);
        if (error.response.data.code === 409) {
          setAlertUpdate({
            type: "error",
            title: "Failed",
            message: error.response.data.message,
          });
          setTimeout(() => setAlert(null), 4000);
        } else {
          setAlertUpdate({
            type: "error",
            title: "Failed",
            message: "Update new candidate failed",
          });
          setTimeout(() => setAlert(null), 3000);
        }
      });
  };
  console.log(formData);

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
                Schedule title<span className="text-red-600">*</span>
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
                Candidate name<span className="text-red-600">*</span>
              </Form.Label>
              <Form.Control
                readOnly
                value={formData.candidate.fullName}
                isDisabled={true}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>
                Schedule Time<span className="text-red-600">*</span>
              </Form.Label>
              <Row>
                <Col>
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
                </Col>

                <Row className="mt-3">
                  <Form.Group>
                    <Form.Label>
                      From<span className="text-red-600">*</span>
                    </Form.Label>
                    <Form.Control
                      type="time"
                      value={moment(
                        formData.startTime,
                        "DD-MM-YYYY HH:mm"
                      ).format("HH:mm")}
                      onChange={(e) => handleTimeChange(e, "start")}
                      isInvalid={!!errors.startTime}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.startTime}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <Form.Label>
                      To<span className="text-red-600">*</span>
                    </Form.Label>
                    <Form.Control
                      type="time"
                      value={moment(
                        formData.endTime,
                        "DD-MM-YYYY HH:mm"
                      ).format("HH:mm")}
                      onChange={(e) => handleTimeChange(e, "end")}
                      isInvalid={!!errors.endTime}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.endTime}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
              </Row>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="">
              <Form.Label>
                Job<span className="text-red-600">*</span>
              </Form.Label>
              <Form.Control isDisabled={true} value={formData.job.title} />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>
                Interviewer<span className="text-red-600">*</span>
              </Form.Label>
              <Select
                isMulti
                options={interviewerOptions}
                value={selectedInterviewersOptions}
                onChange={(selectedOptions) =>
                  handleSelectChange(selectedOptions, "interviewers")
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
              <Form.Control
                isDisabled={true}
                value={formData.recruit.fullName}
              />
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
            <Button variant="primary" onClick={handleInterviewUpdate}>
              Submit
            </Button>
          </div>
        </Row>
      </Form>
    </div>
  );
};

export default UpdateInterviewSchedule;
