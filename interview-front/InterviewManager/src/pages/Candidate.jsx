import {
  Row,
  Col,
  Form,
  InputGroup,
  Modal,
  Tooltip,
  OverlayTrigger,
  Table,
  Card,
  Popover,
  Overlay,
  Button,
} from "react-bootstrap";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { SearchOutlined } from "@ant-design/icons";

import AddCandidateForm from "../components/candidateForm/AddCandidateForm";
import UpdateCandidateForm from "../components/candidateForm/UpdateCandidateForm";
import ViewDetailCandidate from "../components/candidateForm/ViewDetailCandidate";
import Alert from "../components/Alert";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const Candidate = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showConfirmBanModal, setShowConfirmBanModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [blurBackground, setBlurBackground] = useState(false);
  const [data, setData] = useState([]);
  const [reRender, setReRender] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [highestLevelOptions, setHighestLevelOptions] = useState([]);
  const [positionOptions, setPositionOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [jobOptions, setJobOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [alert, setAlert] = useState(null);
  const [recruiters, setRecruiters] = useState([]);
  const [jobCvPairs, setJobCvPairs] = useState([]);

  const [noteBan, setNoteBan] = useState("");

  const [candidate, setCandidate] = useState({
    fullName: "",
    dob: "",
    phoneNumber: "",
    email: "",
    address: "",
    gender: "",
    note: "",
    yearOfExp: 0,
    highestLevel: "",
    cv: "",
    position: "",
    skills: [],
    jobs: [
      {
        jobId: 0,
        cv: "",
      },
    ],
    recruiterId: selectedCandidate?.recruiter?.userId,
  });

  const [searchInput, setSearchInput] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(-1);

  const handleCloseAdd = () => setShowAddModal(false);
  const handleShowAdd = () => {
    setShowAddModal(true);
    setCandidate({
      fullName: "",
      dob: "",
      phoneNumber: "",
      email: "",
      address: "",
      gender: "",
      note: "",
      yearOfExp: 0,
      highestLevel: "",
      cv: "",
      position: "",
      jobIds: [],
      skills: [],
      recruiterId: 0,
    });
  };

  const handleShowViewModal = (candidate) => {
    setSelectedCandidate(candidate);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setReRender(!reRender);
  };

  const handleShowUpdateModal = (candidate) => {
    setSelectedCandidate(candidate);
    setCandidate(candidate);
    setShowUpdateModal(true);
  };

  //ban confirmation
  const handleShowConfirmBanModal = (candidate) => {
    setSelectedCandidate(candidate);
    setShowConfirmBanModal(true);
    setBlurBackground(true);
  };

  const handleShowConfirmDeleteModal = (item) => {
    setSelectedCandidate(item);
    setShowConfirmDeleteModal(true);
    setBlurBackground(true);
  };

  const handleCloseConfirmBanModal = () => {
    setShowConfirmBanModal(false);
    setReRender(!reRender);
    setBlurBackground(false);
  };

  const handleCloseConfirmDeleteModal = () => {
    setShowConfirmDeleteModal(false);
    setReRender(!reRender);
    setBlurBackground(false);
  };

  const handleAlertClose = () => {
    setAlert(null);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setIsEditing(false);
    setCandidate({
      fullName: "",
      dob: "",
      phoneNumber: "",
      email: "",
      address: "",
      gender: "",
      note: "",
      yearOfExp: 0,
      highestLevel: "",
      cv: "",
      position: "",
      skills: [],
      recruiterId: 0,
    });
  };

  const token = localStorage.getItem("token");

  const handleClickPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const fetchData = async (page, search = "", status = -1) => {
    const requestBody = {
      fieldValue: search,
      statusCode: status === 0 ? -1 : Number(status),
    };

    await axios
      .post(
        `http://localhost:8082/api/candidate/list?page=${page}&limit=${itemsPerPage}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const total = response.data.data.total;
        setData(response.data.data.items);
        setTotalPages(Math.ceil(total / itemsPerPage));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const yearOfExpOptions = [0, 1, 1.5, 2, 2.3, 3];

  const fetchOptions = async (endpoint, setState) => {
    try {
      const response = await axios.get(
        `http://localhost:8082/api/${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState(response.data.data);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    }
  };

  useEffect(() => {
    if (roleId === "1" || roleId === "2" || roleId === "3") {
      fetchData(currentPage, searchInput, selectedStatus);
      fetchOptions("job/list/open", setJobOptions);
      fetchOptions("user/list/3/tempt", setRecruiters);
      fetchOptions("attributes/skill", setSkillsOptions);
      fetchOptions("attributes/gender", setGenderOptions);
      fetchOptions("attributes/highest_level", setHighestLevelOptions);
      fetchOptions("attributes/position", setPositionOptions);
      fetchOptions("status/candidate_status", (data) => {
        const statusArray = Object.values(data);
        setStatusOptions(
          statusArray.sort((a, b) => a.code - b.code).map((item) => item.status)
        );
      });
    }
  }, [isEditing, reRender, currentPage]);

  const handleDeleteCandidate = async () => {
    await axios
      .delete(
        `http://localhost:8082/api/candidate/${selectedCandidate.candidateId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const updatedData = data.filter(
          (item) => item.candidateId !== selectedCandidate.candidateId
        );
        setReRender(!reRender);
        setData(updatedData);
        handleCloseConfirmDeleteModal();
        handleCloseViewModal();
        setAlert({
          type: "success",
          title: "Success",
          message: "Delete candidate successfully",
        });
        setTimeout(() => {
          setAlert(null);
        }, 2000);
      })
      .catch((error) => {
        console.error("There was an error deleting the candidate!", error);
        setAlert({
          type: "error",
          title: "Failed",
          message: "Delete candidate failed",
        });
        setTimeout(() => setAlert(null), 3000);
      });
  };

  const handleBanCandidate = async () => {
    await axios
      .put(
        `http://localhost:8082/api/candidate/${selectedCandidate.candidateId}/ban`,
        { note: noteBan },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const updatedData = data.map((item) =>
          item.candidateId === selectedCandidate.candidateId
            ? { ...item, status: "Banned" }
            : item
        );
        setData(updatedData);
        handleCloseConfirmBanModal();
        handleCloseViewModal();
        setAlert({
          type: "success",
          title: "Success",
          message: "Ban new candidate successfully",
        });
      })
      .catch((error) => {
        console.error("There was an error banning the candidate!", error);
        setAlert({
          type: "error",
          title: "Failed",
          message: "Ban new candidate failed",
        });
        setTimeout(() => setAlert(null), 3000);
      });
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleSearch = () => {
    fetchData(1, searchInput, selectedStatus);
    setCurrentPage(1);
  };

  const handleSearchReset = () => {
    fetchData(1, "", -1);
    setCurrentPage(1);
    setSearchInput("");
    setSelectedStatus(-1);
  };

  const roleId = localStorage.getItem("roleId");

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
  ////////////// Show
  const [show, setShow] = useState(false);
  const [selectedCandidate1, setSelectedCandidate1] = useState(null);
  const ref = useRef(null);
  const [isArrow, setIsArrow] = useState(false);

  const handleClick = (e, candidate) => {
    if (
      selectedCandidate1 &&
      selectedCandidate1.candidateId === candidate.candidateId
    ) {
      setSelectedCandidate1(null);
    } else {
      setSelectedCandidate1(candidate);
    }
  };

  console.log(selectedCandidate1);

  const handleCloseArrow = () => {
    setIsArrow(!isArrow);
  };

  const handleCreateInterview = (job) => {
    if (
      selectedCandidate1.status !== "OPEN" &&
      selectedCandidate1.status !== "WAITING_FOR_INTERVIEW" &&
      selectedCandidate1.status !== "FAILED_INTERVIEW" &&
      selectedCandidate1.status !== "CANCEL_INTERVIEW"
    ) {
      setAlert({
        type: "error",
        title: "Failed",
        message:
          "Cannot create interview for a candidate with a status other than OPEN",
      });
      setTimeout(() => {
        setAlert(null);
      }, 3000);
      return;
    } else {
      const dataC = {
        job: job,
        candidate: selectedCandidate1,
        showModalAdd: true,
      };
      setShow(false);
      setSelectedCandidate1(null);
      navigate("/interview", { state: dataC });
    }
  };

  const handleViewCV = (item) => {
    window.open(item.cv, "_blank");
  };

  return (
    <>
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
      <Helmet>
        <title>Candidate</title>
      </Helmet>
      <div className="mt-3">
        <strong className="text-[16px]">Candidate</strong>
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
                    <option value="-1">Status</option>
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
                        <Tooltip id="tooltip-reset">Add new candidate</Tooltip>
                      }
                    >
                      <i
                        onClick={handleShowAdd}
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
          <div className="candidate-table-container relative">
            <table className="table table-striped table-auto w-full text-left border-collapse">
              <thead className="table-dark">
                <tr>
                  <th>Full name</th>
                  <th>Phone number</th>
                  <th>Email</th>
                  <th>Position</th>
                  <th>Owner HR</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Don't have any candidates!!
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>
                          <div className="flex justify-between">
                            {item.fullName}
                            {isArrow &&
                            selectedCandidate1.candidateId ==
                              item.candidateId ? (
                              <i
                                onClick={(e) => {
                                  handleClick(e, item);
                                  handleCloseArrow();
                                }}
                                class="bi bi-caret-up"
                              ></i>
                            ) : (
                              <i
                                onClick={(e) => {
                                  handleClick(e, item);
                                  handleCloseArrow();
                                }}
                                class="bi bi-caret-down"
                              ></i>
                            )}
                          </div>
                        </td>
                        <td>{item.phoneNumber}</td>
                        <td>{item.email}</td>
                        <td>{item.position}</td>
                        <td>{item.recruiter.username}</td>
                        <td>{item.status}</td>
                        <td>
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id="tooltip-search">View detail</Tooltip>
                            }
                          >
                            <i
                              className="bi bi-eye"
                              onClick={() => handleShowViewModal(item)}
                            ></i>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="">Edit candidate</Tooltip>}
                          >
                            <i
                              className="bi bi-pencil-square mx-2"
                              onClick={() => handleShowUpdateModal(item)}
                            ></i>
                          </OverlayTrigger>
                          {roleId === "1" ||
                          roleId === "2" ||
                          roleId === "3" ? (
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Delete candidate</Tooltip>}
                            >
                              <i
                                onClick={() =>
                                  handleShowConfirmDeleteModal(item)
                                }
                                className="bi bi-trash"
                              ></i>
                            </OverlayTrigger>
                          ) : null}
                        </td>
                      </tr>
                      {selectedCandidate1 &&
                        selectedCandidate1.candidateId === item.candidateId && (
                          <tr>
                            <td colSpan="7">
                              <table className="table table-bordered w-[60%] text-left mt-2 ml-10 rounded-md">
                                <thead>
                                  <tr>
                                    <th
                                      style={{
                                        backgroundColor: "#e9ecef",
                                        borderColor: "#dee2e6",
                                      }}
                                    >
                                      Job's Name
                                    </th>
                                    <th
                                      style={{
                                        backgroundColor: "#e9ecef",
                                        borderColor: "#dee2e6",
                                      }}
                                    >
                                      Working Address
                                    </th>
                                    <th
                                      style={{
                                        backgroundColor: "#e9ecef",
                                        borderColor: "#dee2e6",
                                      }}
                                    >
                                      Skills
                                    </th>
                                    <th
                                      style={{
                                        backgroundColor: "#e9ecef",
                                        borderColor: "#dee2e6",
                                      }}
                                    >
                                      Level
                                    </th>
                                    <th
                                      style={{
                                        backgroundColor: "#e9ecef",
                                        borderColor: "#dee2e6",
                                      }}
                                    ></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {item.jobs.map((job, idx) => (
                                    <tr key={idx}>
                                      <td>{job.title}</td>
                                      <td>{job.workingAddress}</td>
                                      <td>
                                        {job.skills?.map((skill, index) => (
                                          <span key={index}>{skill} </span>
                                        ))}
                                      </td>
                                      <td>
                                        {job.levels.map((level, index) => (
                                          <span key={index}>{level} </span>
                                        ))}
                                      </td>
                                      <td>
                                        <div className="flex gap-2 justify-center">
                                          <OverlayTrigger
                                            placement="top"
                                            overlay={
                                              <Tooltip id="tooltip-reset">
                                                View CV
                                              </Tooltip>
                                            }
                                          >
                                            <i
                                              class="bi bi-file-earmark-person"
                                              onClick={() => {
                                                handleViewCV(job);
                                              }}
                                            ></i>
                                          </OverlayTrigger>
                                          <OverlayTrigger
                                            placement="top"
                                            overlay={
                                              <Tooltip id="tooltip-reset">
                                                Create Interview
                                              </Tooltip>
                                            }
                                          >
                                            <i
                                              onClick={() => {
                                                handleCreateInterview(job);
                                              }}
                                              className="bi bi-cast"
                                            ></i>
                                          </OverlayTrigger>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
        </div>

        {/* Modal confirm ban */}
        <Modal show={showConfirmBanModal} onHide={handleCloseConfirmBanModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Ban</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to ban this candidate?
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
                onChange={(e) => setNoteBan(e.target.value)}
              ></textarea>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleBanCandidate}>
              Ban
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal confirm delete */}
        <Modal
          show={showConfirmDeleteModal}
          onHide={handleCloseConfirmDeleteModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this candidate?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleDeleteCandidate}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal add candidate */}
        <Modal
          className={blurBackground ? "blur" : ""}
          show={showAddModal}
          onHide={handleCloseAdd}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Add New Candidate</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddCandidateForm
              candidate={candidate}
              setCandidate={setCandidate}
              skillsOptions={skillsOptions}
              genderOptions={genderOptions}
              yearOfExpOptions={yearOfExpOptions}
              highestLevelOptions={highestLevelOptions}
              positionOptions={positionOptions}
              recruiters={recruiters}
              jobOptions={jobOptions}
              jobCvPairs={jobCvPairs}
              setJobCvPairs={setJobCvPairs}
              handleCloseAdd={handleCloseAdd}
              setData={setData}
              data={data}
              setReRender={setReRender}
              setAlert={setAlert}
              reRender={reRender}
            />
          </Modal.Body>
        </Modal>

        {/* Modal view candidate */}
        <Modal
          className={blurBackground ? "blur" : ""}
          show={showViewModal}
          onHide={handleCloseViewModal}
          size="xl"
        >
          <Modal.Header>
            <Modal.Title>Candidate Information</Modal.Title>
            {roleId === "1" || roleId === "2" || roleId === "3" ? (
              selectedCandidate.status !== "BANNED" ? (
                <Button
                  variant="danger"
                  onClick={() => handleShowConfirmBanModal(selectedCandidate)}
                  className="ms-auto"
                >
                  Ban Candidate
                </Button>
              ) : null
            ) : null}
          </Modal.Header>
          <Modal.Body>
            <ViewDetailCandidate selectedCandidate={selectedCandidate} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseViewModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal update candidate */}
        <Modal
          className={blurBackground ? "blur" : ""}
          show={showUpdateModal}
          onHide={handleCloseUpdateModal}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Update Candidate</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <UpdateCandidateForm
              candidate={candidate}
              setCandidate={setCandidate}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              skillsOptions={skillsOptions}
              genderOptions={genderOptions}
              jobOptions={jobOptions}
              yearOfExpOptions={yearOfExpOptions}
              highestLevelOptions={highestLevelOptions}
              positionOptions={positionOptions}
              recruiters={recruiters}
              handleCloseUpdateModal={handleCloseUpdateModal}
              setAlert={setAlert}
              data={data}
              setData={setData}
            />
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default Candidate;
