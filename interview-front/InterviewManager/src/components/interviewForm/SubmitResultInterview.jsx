import React, { useEffect } from "react";
import Select from "react-select";
import { Row, Col, Form, Button } from "react-bootstrap"; // Import Button
import moment from "moment";
import axios from "axios";

const SubmitResultInterview = ({
  formData1,
  jobs,
  setFormData1,
  onSubmit,
  onClose,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData1({
      ...formData1,
      [name]: value,
    });
  };

  const handleSelectChange = (selectedOptions, type) => {
    if (type === "interviewer") {
      const ids = selectedOptions.map((option) => option.value);
      setFormData1({
        ...formData1,
        interviewerIds: ids,
      });
    }
  };

  // Handle select change for single select
  const handleSelectChangeSingle = (selectedOption, type) => {
    setFormData1({
      ...formData1,
      [type]: selectedOption ? selectedOption.value : "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData1);
    onClose();
  };

  const jobOptions = jobs.map((job) => ({
    value: job.jobId,
    label: job.title,
  }));

  const handleFileChange = async (event) => {
    const { files } = event.target;
    const file = files[0];

    try {
      const formDataF = new FormData();
      formDataF.append("file", file);

      const response = await axios.post(
        "http://localhost:8082/api/candidate/upload",
        formDataF,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const fileNote = response.data.data;
      setFormData1({
        ...formData1,
        fileNote: fileNote,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Schedule title</Form.Label>
              <Form.Control
                type="text"
                readOnly
                placeholder="Type a title..."
                name="title"
                value={formData1.title}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Candidate name</Form.Label>
              <Form.Control
                readOnly
                type="text"
                isDisabled={true}
                name="candidateId"
                value={formData1.candidate.fullName}
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Schedule Time</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    type="date"
                    readOnly
                    name="startTime"
                    value={moment(formData1.startTime, "DD-MM-YYYY").format(
                      "YYYY-MM-DD"
                    )}
                    // onChange={(e) => handleDateChange(e, "start")}
                  />
                </Col>

                <Form.Group>
                  <Form.Label>From</Form.Label>
                  <Form.Control
                    readOnly
                    type="time"
                    value={moment(
                      formData1.startTime,
                      "DD-MM-YYYY HH:mm"
                    ).format("HH:mm")}
                    // onChange={(e) => handleTimeChange(e, "start")}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>To</Form.Label>
                  <Form.Control
                    readOnly
                    type="time"
                    value={moment(formData1.endTime, "DD-MM-YYYY HH:mm").format(
                      "HH:mm"
                    )}
                    // onChange={(e) => handleTimeChange(e, "end")}
                  />
                </Form.Group>
              </Row>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Job</Form.Label>
              <Form.Control
                readOnly
                name="jobId"
                value={formData1.job.title}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Interviewer</Form.Label>
              <Form.Control
                isDisabled={true}
                readOnly
                name="interviewerId"
                value={formData1.interviewers?.map((inter) => inter.fullName)}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Recruiter</Form.Label>
              <Form.Control
                readOnly
                name="recruiterId"
                value={formData1.recruit.fullName}
                onChange={handleInputChange}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Type a location"
                readOnly
                name="location"
                value={formData1.location}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Meeting ID</Form.Label>
              <Form.Control
                readOnly
                type="text"
                placeholder="meet.google.com/xyz-123"
                name="meetingId"
                value={formData1.meetingId}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="border mt-3 mb-3"></Row>
        <strong>Submit Result</strong>
        <Row>
          <Col md={6}>
            <Form.Group className="mt-3">
              <Form.Label>Result</Form.Label>
              <Select
                name="result"
                options={[
                  { value: "PASSED", label: "PASSED" },
                  { value: "FAILED", label: "FAILED" },
                ]}
                onChange={(selectedOption) =>
                  handleSelectChangeSingle(selectedOption, "result")
                }
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mt-3">
              <Form.Label>Upload Detail Note</Form.Label>
              <Form.Control
                type="file"
                onChange={(event) => handleFileChange(event)}
              />
            </Form.Group>
          </Col>
          <Form.Group className="mt-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Type schedule notes..."
              name="note"
              value={formData1.note}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Row>
      </Form>
    </div>
  );
};

export default SubmitResultInterview;
