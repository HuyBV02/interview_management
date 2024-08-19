import { Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import { SearchOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";
import api from "../api/api";
import axios from "axios";
import { Helmet } from "react-helmet";

const Users = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [reRender, setReRender] = useState(false);
  const [errors, setErrors] = useState({});

  //pagnigation
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);

  const handleClickPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Detail User
  const [users, setUsers] = useState([]);

  const roleId = localStorage.getItem("roleId");

  // User data
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleCloseAdd = () => setShowAddModal(false);
  const handleShowAdd = () => setShowAddModal(true);

  const handleCloseDetail = () => setShowDetailModal(false);
  const handleCloseUpdate = () => setShowUpdateModal(false);

  const handleShowDetail = () => {
    setShowDetailModal(true);
    getDetailUser();
  };

  // console.log(users);
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    phoneNumber: "",
    roleId: 0,
    email: "",
    address: "",
    gender: "",
    department: "",
    skills: [],
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const token = localStorage.getItem("token");

  const [searchInput, setSearchInput] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(-1);

  const fetchDataUser = async (page, search = "", status = -1) => {
    const requestBody = {
      fieldValue: search,
      roleId: status === 0 ? -1 : Number(status),
    };
    await axios
      .post(
        `http://localhost:8082/api/user/list?page=${page}&limit=${itemsPerPage}`,

        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const total = response.data.data.total;
        // console.log(response.data.data.items);
        setUserData(response.data.data.items);
        setTotalPages(Math.ceil(total / itemsPerPage));
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    fetchDataUser(currentPage, searchInput, selectedStatus);
    fetchOptions("attributes/skill", setSkillsOptions);
  }, [reRender, currentPage]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleSearch = () => {
    fetchDataUser(1, searchInput, selectedStatus);
    setCurrentPage(1);
  };

  const handleSearchReset = () => {
    fetchDataUser(1, "", -1);
    setCurrentPage(1);
    setSearchInput("");
    setSelectedStatus(-1);
  };

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
      // setReRender(!reRender);
      setState(response.data.data);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    }
  };

  const handleViewUser = (userId) => {
    getDetailUser(userId);
  };
  // console.log(userData);

  const getDetailUser = async (userId) => {
    await axios
      .get(`http://localhost:8082/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        handleShowDetail(true);
        setReRender(!reRender);
        setUsers(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // console.log(userData);

  const handleSubmit = async () => {
    if (!validateForm1()) {
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8082/api/user",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReRender(!reRender);
      handleCloseAdd();
      console.log("Response:", response.data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleShowUpdate = (user) => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    if (name === "role") {
      setSelectedUser((prevUser) => ({
        ...prevUser,
        role: {
          ...prevUser.role,
          roleId: value,
        },
      }));
    } else {
      setSelectedUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
  };

  const handleAddChangedob = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: formatDateForInput(value),
    });
  };

  const handleUpdateChangedob = (e) => {
    const { name, value } = e.target;
    setSelectedUser({
      ...selectedUser,
      [name]: formatDateForInput(value),
    });
  };

  const handleUpdateSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    const data = {
      fullName: selectedUser.fullName,
      dob: selectedUser.dob,
      phoneNumber: selectedUser.phoneNumber,
      email: selectedUser.email,
      skills: selectedUser.skills,
      address: selectedUser.address,
      gender: selectedUser.gender,
      department: selectedUser.department,
      note: selectedUser.note,
      roleId: selectedUser.role.roleId,
    };
    console.log(data);
    try {
      const response = await api.put(`/user/${selectedUser.userId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response:", response.data);
      fetchDataUser();
      setReRender(!reRender);
      handleCloseUpdate();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const createSelectOptions = (options) => {
    return options.map((option) => ({ value: option, label: option }));
  };

  const handleSkillsChange = (selectedOptions) => {
    const skills = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setSelectedUser({ ...selectedUser, skills });
  };
  const handleSkillsChangeadd = (selectedOptions) => {
    const skills = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setFormData({ ...formData, skills });
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

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const toggleUserStatus = async () => {
    const newStatus = users.status === "ACTIVE" ? "deactivate" : "active";
    await axios
      .put(
        `http://localhost:8082/api/user/${users.userId}/${newStatus}`,
        {},
        config
      )
      .then((response) => {
        setShowDetailModal(false);
        setReRender(!reRender);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error updating user status:", error);
      });
  };

  //validate update

  const validateForm = () => {
    const newErrors = {};
    if (!selectedUser.fullName) {
      newErrors.fullName = "Full Name is required";
    }
    if (!selectedUser.role?.roleId) {
      newErrors.role = "Role is required";
    }
    if (!selectedUser.skills || selectedUser.skills.length === 0) {
      newErrors.skills = "At least one skill is required";
    }
    if (!selectedUser.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(selectedUser.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!selectedUser.gender) {
      newErrors.gender = "Gender is required";
    }
    if (!selectedUser.department) {
      newErrors.department = "Department is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //validate add

  const validateForm1 = () => {
    const newErrors = {};
    if (!formData.fullName) {
      newErrors.fullName = "Full Name is required";
    }
    if (!formData.roleId) {
      newErrors.role = "Role is required";
    }
    if (!formData.skills || formData.skills.length === 0) {
      newErrors.skills = "At least one skill is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }
    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // console.log(selectedUser);

  return (
    <>
      <Helmet>
        <title>User</title>
      </Helmet>
      <div className="my-3">
        <strong className="text-[16px]">User</strong>
        <div className="flex justify-between">
          <div className="shadow-sm py-3 px-3 flex justify-between mb-3 mt-3 bg-white rounded-xl w-[70%]">
            <div className="w-[100%]">
              <div className="flex justify-between items-center">
                <div>
                  <InputGroup size="sm" style={{ width: "400px" }}>
                    <Form.Control
                      placeholder=""
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
                    aria-label="Select status"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                  >
                    <option value="-1">Roles</option>
                    <option value="1">ADMIN</option>
                    <option value="2">MANAGER</option>
                    <option value="3">RECRUITER</option>
                    <option value="4">INTERVIWER</option>
                  </Form.Select>
                </div>

                <div>
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
                </div>
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
                        <Tooltip id="tooltip-reset">Add new user</Tooltip>
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
      </div>

      {/* Modal add user */}
      <Modal show={showAddModal} onHide={handleCloseAdd} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col lg="6">
              <Form.Group className="mb-3">
                <Form.Label>
                  Full Name <span className="text-red-600">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  isInvalid={!!errors.fullName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.fullName}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>D.O.B</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  value={formatDateForInput(formData.dob)}
                  onChange={handleAddChangedob}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  Role <span className="text-red-600">*</span>
                </Form.Label>
                <Form.Select
                  name="roleId"
                  value={formData.role}
                  onChange={handleChange}
                  isInvalid={!!errors.role}
                >
                  <option value="">Select Role</option>
                  <option value="1">Admin</option>
                  <option value="2">Manager</option>
                  <option value="3">Recruiter</option>
                  <option value="4">Interviewer</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.role}
                </Form.Control.Feedback>
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
                    formData.skills?.includes(option.value)
                  )}
                  onChange={handleSkillsChangeadd}
                  className={errors.skills ? "is-invalid" : ""}
                />
                {errors.skills && (
                  <div className="invalid-feedback d-block">
                    {errors.skills}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col lg="6">
              <Form.Group className="mb-3">
                <Form.Label>
                  Email <span className="text-red-600">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  Gender <span className="text-red-600">*</span>
                </Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  isInvalid={!!errors.gender}
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.gender}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  Department <span className="text-red-600">*</span>
                </Form.Label>
                <Form.Select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  isInvalid={!!errors.department}
                >
                  <option value="">Select Department</option>
                  <option value="HR">HR</option>
                  <option value="IT">IT</option>
                  <option value="Finance">Finance</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.department}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAdd}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
                
          >
            Add User
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Table */}
      <div className="shadow-sm px-2 py-2 rounded-xl bg-white">
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user) => (
              <tr key={user.userId}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.role.roleName}</td>
                <td>{user.status}</td>
                <td>
                  <i size="sm" onClick={() => handleViewUser(user.userId)}>
                    <i className="bi bi-eye"></i>
                  </i>
                  {roleId === "1" ? (
                    <>
                      <i size="sm" className="mx-2"></i>
                      <i
                        onClick={() => {
                          handleShowUpdate(user);
                        }}
                        className="bi bi-pencil"
                      ></i>
                    </>
                  ) : null}
                </td>
              </tr>
            ))}
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

      {/* Modal details user */}
      <Modal show={showDetailModal} size="xl">
        <Modal.Header>
          <div className="flex">
            <Modal.Title>User Details</Modal.Title>
            <div>
              {users.status === "INACTIVE" ? (
                <Button
                  className="mx-3"
                  variant="success"
                  onClick={toggleUserStatus}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                  }}
                >
                  ACTIVE
                </Button>
              ) : (
                <Button
                  className="mx-3"
                  variant="danger"
                  onClick={toggleUserStatus}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                  }}
                >
                  DEACTIVE
                </Button>
              )}
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col lg="6">
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="text" readOnly value={users.fullName} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>D.O.B</Form.Label>
                <Form.Control type="text" readOnly value={users.dob} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="text" readOnly value={users.phoneNumber} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  type="text"
                  readOnly
                  value={users.role?.roleName}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Skill</Form.Label>
                <Form.Control type="text" readOnly value={users.skills} />
              </Form.Group>
            </Col>
            <Col lg="6">
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" readOnly value={users.email} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" readOnly value={users.address} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Control type="text" readOnly value={users.gender} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Control type="text" readOnly value={users.department} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  readOnly
                  value={users.note}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetail}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Update User */}
      <Modal show={showUpdateModal} onHide={handleCloseUpdate} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col lg="6">
              <Form.Group className="mb-3">
                <Form.Label>
                  Full Name <span className="text-red-600">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={selectedUser?.fullName || ""}
                  onChange={handleUpdateChange}
                  isInvalid={!!errors.fullName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.fullName}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>D.O.B</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  onChange={handleUpdateChangedob}
                  value={formatDateForInput(selectedUser?.dob)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  value={selectedUser?.phoneNumber || ""}
                  onChange={handleUpdateChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  Role <span className="text-red-600">*</span>
                </Form.Label>
                <Form.Select
                  name="role"
                  value={selectedUser?.role?.roleId}
                  onChange={handleUpdateChange}
                  isInvalid={!!errors.role}
                >
                  <option value="">Select Role</option>
                  <option value="1">Admin</option>
                  <option value="2">Manager</option>
                  <option value="3">Recruiter</option>
                  <option value="4">Interviewer</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.role}
                </Form.Control.Feedback>
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
                    selectedUser?.skills?.includes(option.value)
                  )}
                  onChange={handleSkillsChange}
                  className={errors.skills ? "is-invalid" : ""}
                />
                {errors.skills && (
                  <div className="invalid-feedback d-block">
                    {errors.skills}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col lg="6">
              <Form.Group className="mb-3">
                <Form.Label>
                  Email <span className="text-red-600">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={selectedUser?.email || ""}
                  onChange={handleUpdateChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={selectedUser?.address || ""}
                  onChange={handleUpdateChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  Gender <span className="text-red-600">*</span>
                </Form.Label>
                <Form.Select
                  name="gender"
                  value={selectedUser?.gender || ""}
                  onChange={handleUpdateChange}
                  isInvalid={!!errors.gender}
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.gender}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  Department <span className="text-red-600">*</span>
                </Form.Label>
                <Form.Select
                  name="department"
                  value={selectedUser?.department || ""}
                  onChange={handleUpdateChange}
                  isInvalid={!!errors.department}
                >
                  <option value="">Select Department</option>
                  <option value="HR">HR</option>
                  <option value="IT">IT</option>
                  <option value="FINACE">Finance</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.department}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="note"
                  value={selectedUser?.note || ""}
                  onChange={handleUpdateChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpdate}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateSubmit}>
            Update User
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Users;
