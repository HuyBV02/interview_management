import {
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Modal,
  Table,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { SearchOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import axios from "axios";
import AddInterviewSchedule from "../components/interviewForm/AddInterviewSchedule";
import ViewDetailInterview from "../components/interviewForm/ViewDetailInterview";
import Alert from "../components/Alert";
import { Helmet } from "react-helmet";
import SubmitResultInterview from "../components/interviewForm/SubmitResultInterview";
import UpdateInterviewSchedule from "../components/interviewForm/UpdateInterviewSchedule";
import { useLocation, useNavigate } from "react-router-dom";

const Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalView, setShowModalView] = useState(false);
  const [showConfirmCancelModal, setShowConfirmCancelModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showModalSubmit, setShowModalSubmit] = useState(false);
  const [interviewData, setInterviewData] = useState(null);

  const [roles, setRoles] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [interviewer, setInterviewer] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [blurBackground, setBlurBackground] = useState(false);
  const [selectedInterviewDetail, setSelectedInterviewDetail] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [statusOptions, setStatusOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(-1);

  const roleId = localStorage.getItem("roleId");
  const [alert, setAlert] = useState(null);

  const [reRender, setReRender] = useState(false);

  const [noteCancel, setNoteCancel] = useState("");

  const [formData, setFormData] = useState({
    interviewId: 0,
    title: "",
    startTime: "",
    endTime: "",
    note: "",
    location: "",
    meetingId: "",
    candidateId: 0,
    jobId: 0,
    recruiterId: 0,
    interviewerIds: [],
  });

  const [formData1, setFormData1] = useState({
    interviewId: 0,
    title: "",
    startTime: "",
    endTime: "",
    note: "",
    location: "",
    meetingId: "",
    candidateId: 0,
    jobId: 0,
    result: "N/A",
    recruiterId: 0,
    interviewerIds: [],
  });
  const [selectedInterviewers, setSelectedInterviewers] = useState([]);

  const [interviews, setInterviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [totalPages, setTotalPages] = useState(0);

  const handleCreateOffer = (interview) => {
    const dataFromInterview = {
      interview: interview,
      showModalAdd: true,
    };
    navigate("/offer", { state: dataFromInterview });
  };

  // console.log(interviews);
  const token = localStorage.getItem("token");

  const fetchInterviews = async (page, search = "", status = -1) => {
    const requestBody = {
      fieldValue: search,
      statusCode: status === 0 ? -1 : Number(status),
    };
    await axios
      .post(
        `http://localhost:8082/api/interview/list?page=${page}&limit=${itemsPerPage}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (roleId === "4") {
          response.data.data.items = response.data.data.items.filter(
            (interview) => {
              return interview.interviewers.some(
                (int) => int.username === localStorage.getItem("username")
              );
            }
          );
          const total =
            response.data.data.total - response.data.data.items.length;
          setInterviews(response.data.data.items);
        } else {
          setInterviews(response.data.data.items);
          const total = response.data.data.total;
          setTotalPages(Math.ceil(total / itemsPerPage));
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the interviews!", error);
      });
  };

  // console.log(currentPage);

  const fetchData = async (url, setState) => {
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setState(response.data.data);
    } catch (error) {
      console.error(`There was an error fetching data from ${url}!`, error);
    }
  };
  useEffect(() => {
    if (roleId === "1" || roleId === "2" || roleId === "3") {
      fetchData("http://localhost:8082/api/roles", setRoles);
      fetchData("http://localhost:8082/api/attributes/skill", setSkills);
      fetchData("http://localhost:8082/api/user/list/3/tempt", setRecruiters);
      fetchData(
        "http://localhost:8082/api/candidate/list?search",
        setCandidates
      );
      fetchData("http://localhost:8082/api/user/list/4?search", setInterviewer);
      fetchData("http://localhost:8082/api/job/list/open", setJobs);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchData("http://localhost:8082/api/status/interview_status", (data) => {
      const statusArray = Object.values(data);
      setStatusOptions(
        statusArray.sort((a, b) => a.code - b.code).map((item) => item.status)
      );
    });
    fetchInterviews(currentPage, searchInput, selectedStatus);
  }, [currentPage, reRender]);

  const handleShowModalAdd = () => {
    setShowModalAdd(true);
  };

  const [candidateFromCandidate, setCandidateFromCandidate] = useState();
  const [jobFromCandidate, setJobFromCandidate] = useState();

  useEffect(() => {
    if (location.state?.showModalAdd) {
      setShowModalAdd(true);
    }
    setCandidateFromCandidate(location.state?.candidate);
    setJobFromCandidate(location.state?.job);
  }, [location.state]);

  const handleShowModalUpdate = (interview) => {
    setFormData(interview);
    setSelectedInterviewers(
      interview.interviewers.map((user) => ({
        value: user.userId,
        label: user.fullName,
      }))
    );
    setShowModalUpdate(true);
  };

  const handleShowConfirmCancelModal = () => {
    setShowConfirmCancelModal(true);
    setBlurBackground(true);
  };

  const handleCloseConfirmCancelModal = () => {
    setShowConfirmCancelModal(false);
    setReRender(!reRender);
    setBlurBackground(false);
  };

  const handleShowModalSubmitResult = (interview) => {
    setShowModalSubmit(true);
    setFormData1(interview);
  };
  const handleCloseModalAdd = () => {
    setShowModalAdd(false);
    setCandidateFromCandidate(null);
    setSelectedInterviewers(null);
    setReRender(!reRender);
    setFormData({
      interviewId: 0,
      title: "",
      startTime: "",
      endTime: "",
      note: "",
      location: "",
      meetingId: "",
      candidateId: 0,
      jobId: 0,
      recruiterId: 0,
      interviewerIds: [],
    });
  };
  const handleCloseModalUpdate = () => {
    setShowModalUpdate(false);
    setReRender(!reRender);
  };
  const handleCloseModalSubmitResult = () => {
    setShowModalSubmit(false);
    setReRender(!reRender);
  };
  const handleCloseModalView = () => {
    setShowModalView(false);
    setInterviewData(null);
  };

  const handleAlertClose = () => {
    setAlert(null);
  };

  const fetchInterviewData = async (interviewId) => {
    await axios
      .get(`http://localhost:8082/api/interview/${interviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setInterviewData(response.data.data);
        setShowModalView(true);
        setSelectedInterviewDetail(interviewId);
      })
      .catch((error) => {
        console.error("There was an error fetching the interview data!", error);
      });
  };

  const handleViewInterview = (interview) => {
    fetchInterviewData(interview.interviewId);
  };

  const handleInterviewSubmitResult = async () => {
    const dataSubmit = {
      result: formData1.result,
      note: formData1.note,
      fileNote: formData1.fileNote,
    };
    await axios
      .put(
        `http://localhost:8082/api/interview/${formData1.interviewId}/submit`,
        dataSubmit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const updatedCandidate = response?.data?.data;
        const updatedData = interviews.map((item) =>
          item.interviewId === updatedCandidate.interviewId
            ? updatedCandidate
            : item
        );
        setInterviews(updatedData);
        handleCloseModalSubmitResult();
        setAlert({
          type: "success",
          title: "Success",
          message: "Update new interview successfully",
        });
        setTimeout(() => {
          setAlert(null);
        }, 2000);
      })
      .catch((error) => {
        console.error("There was an error updating the interview!", error);
        handleCloseModalSubmitResult();
        setAlert({
          type: "error",
          title: "Failed",
          message: "Update new interview failed",
        });
        setTimeout(() => setAlert(null), 3000);
      });
  };

  const handleClickPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleSearch = () => {
    fetchInterviews(1, searchInput, selectedStatus);
    setCurrentPage(1);
  };

  const handleSearchReset = () => {
    fetchInterviews(1, "", -1);
    setCurrentPage(1);
    setSearchInput("");
    setSelectedStatus(-1);
  };

  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    if (currentPage === 1) {
      endPage = Math.min(totalPages, startPage + 2);
    } else if (currentPage === totalPages) {
      startPage = Math.max(1, endPage - 2);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  console.log(selectedInterviewDetail);
  const handleSubmitConfirmCancelModal = async () => {
    await axios
      .put(
        `http://localhost:8082/api/interview/${selectedInterviewDetail}/cancel`,
        { note: noteCancel },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const updatedData = interviews.map((item) =>
          item.interviewId === selectedInterviewDetail.interviewId
            ? { ...item, status: "CANCELLED" }
            : item
        );
        setInterviews(updatedData);
        handleCloseConfirmCancelModal();
        handleCloseModalView();
        setAlert({
          type: "success",
          title: "Success",
          message: "Cancel new interview successfully",
        });
        setTimeout(() => setAlert(null), 3000);
      })
      .catch((error) => {
        handleCloseConfirmCancelModal();
        handleCloseModalView();
        console.error("There was an error cancel the interview!", error);
        setAlert({
          type: "error",
          title: "Failed",
          message: "Cancel new interview failed",
        });
        setTimeout(() => setAlert(null), 3000);
      });
  };

  console.log(interviews);
  return (
    <>
      <Helmet>
        <title>Interview</title>
      </Helmet>
      <div className="mt-3">
        {alert && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-1000">
            <Alert
              type={alert.type}
              title={alert.title}
              message={alert.message}
              onClose={handleAlertClose}
            />
          </div>
        )}
        <strong className="text-[16px]">Interview</strong>
        <div className="flex justify-between">
          <div className="shadow-sm py-3 px-3 flex justify-between mb-3 mt-3 bg-white rounded-xl w-[70%]">
            <div className="w-[100%]">
              <div className="flex justify-between items-center">
                <div>
                  <InputGroup size="sm" style={{ width: "400px" }}>
                    <Form.Control
                      aria-label=""
                      value={searchInput}
                      onChange={handleSearchChange}
                    />
                    <InputGroup.Text>
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
                  </InputGroup>
                </div>
                <div>
                  <Form.Select
                    size="sm"
                    aria-label=""
                    value={selectedStatus}
                    onChange={handleStatusChange}
                  >
                    <option value="">Status</option>
                    {statusOptions.map((status, index) => (
                      <option key={index} value={index + 1}>
                        {status}
                      </option>
                    ))}
                  </Form.Select>
                </div>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="tooltip-search">Click to search</Tooltip>
                  }
                >
                  <Button
                    size="sm"
                    onClick={handleSearch}
                    className="bg-cyan-500 hover:bg-cyan-500"
                  >
                    <SearchOutlined /> Search
                  </Button>
                </OverlayTrigger>
                <div>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-reset">Reset search</Tooltip>}
                  >
                    <i
                      className="fa-solid fa-arrow-rotate-left ml-5 cursor-pointer"
                      onClick={handleSearchReset}
                    ></i>
                  </OverlayTrigger>
                </div>
              </div>
            </div>
          </div>

          {roleId === "1" || roleId === "2" || roleId === "3" ? (
            <div className="shadow-sm py-3 px-3 flex justify-between mb-3 mt-3 bg-white rounded-xl">
              <div className="flex justify-center items-center">
                <Row className="">
                  <Col lg="12">
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip-reset">Add new interview</Tooltip>
                      }
                    >
                      <i
                        onClick={handleShowModalAdd}
                        className="fa-solid fa-circle-plus fa-xl hover:text-cyan-500 cursor-pointer"
                      ></i>
                    </OverlayTrigger>
                  </Col>
                </Row>
              </div>
            </div>
          ) : null}
        </div>

        <div className="shadow-sm px-2 py-2 rounded-xl bg-white">
          <Row>
            <Table striped>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Candidate Name</th>
                  <th>Interviewer</th>
                  <th>Schedule</th>
                  <th>Result</th>
                  <th>Status</th>
                  <th>Job</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {interviews.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No item matches with your search data. Please try again
                    </td>
                  </tr>
                ) : (
                  interviews?.map((interview, index) => (
                    <tr key={index}>
                      <td>{interview.title}</td>
                      <td>{interview.candidate?.fullName}</td>
                      <td>
                        {interview.interviewers.map((int) => {
                          return <div key={int.id}>{int.fullName}</div>;
                        })}
                      </td>
                      <td>{interview.startTime}</td>
                      <td>
                        {interview.result !== null ? interview.result : "N/A"}
                      </td>
                      <td>{interview.status}</td>
                      <td>{interview.job.title}</td>
                      <td>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="tooltip-reset">
                              View detail interview
                            </Tooltip>
                          }
                        >
                          <i
                            className="bi bi-eye"
                            onClick={() => handleViewInterview(interview)}
                          ></i>
                        </OverlayTrigger>
                        {roleId === "1" || roleId === "2" || roleId === "3" ? (
                          interview.status === "INTERVIEWED" ? (
                            interview.result === "PASSED" ? (
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id="tooltip-reset">
                                    Create Offer
                                  </Tooltip>
                                }
                              >
                                <i
                                  onClick={() => {
                                    handleCreateOffer(interview);
                                  }}
                                  className="bi bi-cast mx-2"
                                ></i>
                              </OverlayTrigger>
                            ) : null
                          ) : (
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id="tooltip-reset">
                                  Edit Interview
                                </Tooltip>
                              }
                            >
                              <i
                                onClick={() => handleShowModalUpdate(interview)}
                                className="bi bi-pencil-square mx-2"
                              ></i>
                            </OverlayTrigger>
                          )
                        ) : interview.status === "CANCELLED" ? null : (
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id="tooltip-reset">
                                Submit Result Interview
                              </Tooltip>
                            }
                          >
                            <i
                              onClick={() =>
                                handleShowModalSubmitResult(interview)
                              }
                              class="bi bi-cast mx-2"
                            ></i>
                          </OverlayTrigger>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
            <div className="flex justify-end mt-3">
              <div className="d-flex align-items-center mx-2">
                <span>{`Page ${currentPage}/${totalPages}`}</span>
              </div>

              <Button
                variant="outline-primary"
                onClick={() => handleClickPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="me-2 ml-5"
              >
                Prev
              </Button>
              {getPageNumbers().map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "primary" : "outline-primary"}
                  onClick={() => handleClickPage(page)}
                  className="me-2"
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline-primary"
                onClick={() => handleClickPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </Row>
        </div>

        {/* Modal confirm ban */}
        <Modal
          show={showConfirmCancelModal}
          onHide={handleCloseConfirmCancelModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Ban</Modal.Title>
          </Modal.Header>
          <Modal.Body className="flex-row justify-center items-center">
            Are you sure you want to cancel this interview?
            <form
              data-mdb-input-init
              class="flex gap-3 justify-center items-center w-full"
            >
              <label class="form-label flex" for="typeEmail">
                Note<span className="text-red-500"> *</span>
              </label>
              <textarea
                type="text"
                // id="typeEmail"
                class="form-control my-3"
                onChange={(e) => setNoteCancel(e.target.value)}
              ></textarea>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseConfirmCancelModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleSubmitConfirmCancelModal}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Modal view */}
        <Modal
          className={blurBackground ? "blur" : ""}
          show={showModalView}
          onHide={handleCloseModalView}
          dialogClassName="custom-modal"
          size="xl"
        >
          <Modal.Header>
            <Modal.Title>Interview Details</Modal.Title>
            {roleId === "1" || roleId === "2" || roleId === "3" ? (
              interviewData?.status === "CANCELLED" ? null : (
                <Button
                  variant="danger"
                  onClick={() =>
                    handleShowConfirmCancelModal(
                      selectedInterviewDetail.interviewId
                    )
                  }
                  className="ms-auto"
                >
                  Cancel Interview
                </Button>
              )
            ) : null}
          </Modal.Header>
          <Modal.Body>
            <ViewDetailInterview interviewData={interviewData} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModalView}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal add */}
        {showModalAdd && (
          <Modal
            show={showModalAdd}
            onHide={handleCloseModalAdd}
            dialogClassName="custom-modal"
            size="xl"
          >
            <Modal.Header closeButton>
              <Modal.Title>Schedule Interview</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AddInterviewSchedule
                formData={formData}
                setFormData={setFormData}
                selectedInterviewers={selectedInterviewers}
                setSelectedInterviewers={setSelectedInterviewers}
                recruiters={recruiters}
                interviewer={interviewer}
                candidates={candidates}
                jobs={jobs}
                candidateFromCandidate={candidateFromCandidate}
                jobFromCandidate={jobFromCandidate}
                handleCloseModalAdd={handleCloseModalAdd}
                interviews={interviews}
                setInterviews={setInterviews}
                setAlert={setAlert}
              />
            </Modal.Body>
          </Modal>
        )}

        {/* Modal update */}
        <Modal
          show={showModalUpdate}
          onHide={handleCloseModalUpdate}
          dialogClassName="custom-modal"
          size="xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>Schedule Interview</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <UpdateInterviewSchedule
              formData={formData}
              setFormData={setFormData}
              selectedInterviewers={selectedInterviewers}
              setSelectedInterviewers={setSelectedInterviewers}
              recruiters={recruiters}
              interviewer={interviewer}
              candidates={candidates}
              jobs={jobs}
              skills={skills}
              handleCloseModalUpdate={handleCloseModalUpdate}
              interviews={interviews}
              setInterviews={setInterviews}
              setAlert={setAlert}
            />
          </Modal.Body>
        </Modal>

        {/* Modal submit result */}
        <Modal
          show={showModalSubmit}
          onHide={handleCloseModalSubmitResult}
          dialogClassName="custom-modal"
          size="xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>Interview Result</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SubmitResultInterview
              formData1={formData1}
              setFormData1={setFormData1}
              selectedInterviewers={selectedInterviewers}
              setSelectedInterviewers={setSelectedInterviewers}
              recruiters={recruiters}
              interviewer={interviewer}
              candidates={candidates}
              jobs={jobs}
              // onSubmit={handleInterviewSubmitResult} // Add this line
              // onClose={() => setShowModalSubmit(false)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleInterviewSubmitResult}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Interview;
