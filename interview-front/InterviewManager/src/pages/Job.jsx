import { SearchOutlined } from "@ant-design/icons";
import React from 'react';
import { Card, Col, Collapse, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";

import { useEffect, useState } from "react";

import axios from 'axios';
import numeral from 'numeral';
import { Pagination } from 'react-bootstrap';
import { Helmet } from "react-helmet";
import api from "../api/api";
import { benefits, levels, skills } from "../data/fakedata";
import { ChangeFormateDate, formatDate, parseDate } from "../utils/formatDate";
import { handleShowToast } from "../utils/handleShowToast";

const Job = () => {

  const token = localStorage.getItem("token");
  const roleId = localStorage.getItem("roleId");

  const [errors, setErrors] = useState({});
  const [displayValueFrom, setDisplayValueFrom] = useState('0');
  const [displayValueTo, setDisplayValueTo] = useState('0');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditlModal, setShowEditModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleCloseDelete = () => setShowDeleteModal(false);
  const handleShowDelete = () => setShowDeleteModal(true);
  //search
  const [searchParams, setSearchParams] = useState({
    fieldValue: "",
    statusCode: "-1",
    roleId: `${roleId}`,
  });
  const [dataListJob, setDataListJob] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [listDepartment, setListDepartment] = useState([]);
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isValidateFile, setIsValidateFile] = useState(false);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);

  };

  const handleValidateFile = async (event) => {
    event.preventDefault();

    const url = 'http://localhost:8082/api/job/validate-import?=null';


    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await axios.post(url, formData, config);

      if (response.data.code == 200) {
        setIsValidateFile(true);
      }
    } catch (error) {
      console.error('Error validating import:', error);
      // console.log(error.response.data.message);
      handleShowToast("error", error.response.data.message)
    }
  };
  const handleImportFile = async (event) => {
    event.preventDefault();

    const url = 'http://localhost:8082/api/job/import';


    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await axios.post(url, formData, config);
      // console.log(response.data);
      if (response.data.code == 200) {
        setIsValidateFile(false);
        setShowImportModal(false);
        handleShowToast("success", "Import successfully")
      }

    } catch (error) {
      console.error('Error import:', error);
      // console.log(error.response.data.message)
    }
  };
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [reRender, setReRender] = useState(false);
  const [openSkill, setOpenSkill] = useState(false);
  const [openLevel, setOpenLevel] = useState(false);
  const [openBenefit, setOpenBenefit] = useState(false);

  const [skillsItem, setSkillsItem] = useState({
    JAVA: false,
    NODEJS: false,
    DOTNET: false,
    CPP: false,
    BA: false,
    COMMUNICATION: false,
  });

  const [benefitsItem, setBenefitsItem] = useState({
    LUNCH: false,
    LEAVE: false,
    HEALTH: false,
    WORKING: false,
    TRAVEL: false,
  });

  const [levelsItem, setLevelsItem] = useState({
    FRESHER: false,
    JUNIOR: false,
    SENIOR: false,
    LEADER: false,
    MANAGER: false,
    VICE_HEAD: false,
  });


  const handleCloseAdd = () => {
    setShowAddModal(false);
    setErrors({});
  }
  const handleShowAdd = () => setShowAddModal(true);

  const handleCloseImport = () => setShowImportModal(false);
  const handleShowImport = () => {
    setShowImportModal(true);
    setSelectedFile("");
  }

  const handleCloseDetail = () => {
    setShowDetailModal(false)
    resetForm();
  };
  const handleShowDetail = () => {
    setShowDetailModal(true);
  };

  const handleCloseEdit = () => {
    resetForm();
    setShowEditModal(false);
    setErrors({});
  };
  const handleShowEdit = () => {
    setFormData(selectedItem);
    setShowDetailModal(false);
    setShowEditModal(true);
    if (selectedItem.skills != null) {
      selectedItem.skills.forEach((skill) => {
        skillsItem[skill.toUpperCase()] = true;
      });
    }
    if (selectedItem.benefits != null) {
      selectedItem.benefits.forEach((benefit) => {
        benefitsItem[benefit.toUpperCase()] = true;
      });
    }
    if (selectedItem.benefits != null) {
      selectedItem.levels.forEach((level) => {
        levelsItem[level.toUpperCase()] = true;
      });
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    salaryFrom: "",
    salaryTo: "",
    workingAddress: "",
    department: "",
    description: "",
    skills: [],
    benefits: [],
    levels: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'salaryFrom') {
      const numericValue = value.replace(/,/g, '');
      const formattedValue = numeral(numericValue).format('0,0');
      setDisplayValueFrom(formattedValue);
      console.log(parseFloat(numericValue))
      setFormData({
        ...formData,
        [name]: parseFloat(numericValue) || 0,
      });


    } else if (name === 'salaryTo') {
      const numericValue = value.replace(/,/g, '');
      const formattedValue = numeral(numericValue).format('0,0');
      setDisplayValueTo(formattedValue);
      setFormData({
        ...formData,
        [name]: parseFloat(numericValue) || 0,
      });

    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    // console.log(formData);
  };
  const handleSearchInputChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
    // console.log(searchParams);
  };

  const validateField = (form, field) => {
    if (!form[field]) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: "Please enter this field." }));
      return false;
    } else if (typeof form[field] === 'string' && form[field].trim() == '') {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: "Please enter this field." }));
      return false;
    }
    else setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    return true;
  }
  const validateArr = (arr, field) => {
    if (Object.keys(arr).filter((item) => arr[item]).length === 0) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: "Please select at least one items" }));
      return false;
    } else setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    return true;
  }


  const handleSubmit = async () => {

    // Validate job title
    let isOk = true;
    if (!validateField(formData, 'title')) isOk = false;

    // Validate job department
    if (!validateField(formData, 'department')) isOk = false;

    // Validate start date and end date
    const today = new Date();
    const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000));

    if (!validateField(formData, 'startDate')) isOk = false;
    if (!validateField(formData, 'endDate')) isOk = false;

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      setErrors((prevErrors) => ({ ...prevErrors, ["endDate"]: "End date must be greater than start date." }));
      isOk = false;
    }
    if (formData.startDate && formData.startDate <= yesterday.toISOString().slice(0, 10)) {
      setErrors((prevErrors) => ({ ...prevErrors, ["startDate"]: "Start date cannot be in the past." }));
      isOk = false;
    }

    if (formData.endDate && formData.endDate <= yesterday.toISOString().slice(0, 10)) {
      setErrors((prevErrors) => ({ ...prevErrors, ["endDate"]: "End date cannot be in the past." }));
      isOk = false;
    }
    if (formData.endDate && formData.endDate <= today.toISOString().slice(0, 10)) {
      setErrors((prevErrors) => ({ ...prevErrors, ["endDate"]: "End date must be in the future." }));
      isOk = false;
    }

    if (!validateField(formData, 'salaryFrom')) isOk = false;
    if (!validateField(formData, 'salaryTo')) isOk = false;


    // Validate salary range
    if (formData.salaryFrom && formData.salaryTo) {
      if (formData.salaryFrom < 0 || formData.salaryTo < 0) {
        setErrors((prevErrors) => ({ ...prevErrors, ["salaryFrom"]: "Please enter a valid salary range." }));
        isOk = false;
      }
      if (parseFloat(formData.salaryFrom) >= parseFloat(formData.salaryTo)) {
        setErrors((prevErrors) => ({ ...prevErrors, ["salaryTo"]: "Salary to must be greater than salary from." }));
        isOk = false;
      }
    }

    // Validate skills
    if (!validateArr(skillsItem, "skills")) isOk = false;

    // Validate benefits
    if (!validateArr(benefitsItem, "benefits")) isOk = false;

    // Validate levels
    if (!validateArr(levelsItem, "levels")) isOk = false;

    if (!isOk) return;

    const dataToSend = {
      title: formData.title,
      startDate: formatDate(formData.startDate),
      endDate: formatDate(formData.endDate),
      salaryFrom: parseFloat(formData.salaryFrom),
      salaryTo: parseFloat(formData.salaryTo),
      workingAddress: formData.workingAddress,
      description: formData.description,
      department: formData.department,
      skills: Object.keys(skillsItem).filter((skill) => skillsItem[skill]),
      benefits: Object.keys(benefitsItem).filter(
        (benefit) => benefitsItem[benefit]
      ),
      levels: Object.keys(levelsItem).filter((level) => levelsItem[level]),
    };

    try {
      const response = await api.post("/job", dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReRender(!reRender);
      setOpenSkill(false);
      setOpenBenefit(false);
      setOpenLevel(false);
      // console.log("Response:", response.data);
      handleShowToast("success", "Add job successfully");
      resetForm();
      handleCloseAdd();

    } catch (error) {
      console.error("Error:", error);
      handleShowToast("error", error.response.data.data);
    }
  };
  const handleSubmitEdit = async () => {
    // setFormData(selectedItem);

    const dataToSend = {
      title: formData.title,
      startDate: ChangeFormateDate(formData.startDate),
      endDate: ChangeFormateDate(formData.endDate),
      salaryFrom: parseFloat(formData.salaryFrom),
      salaryTo: parseFloat(formData.salaryTo),
      workingAddress: formData.workingAddress,
      department: formData.department,
      description: formData.description,
      skills: Object.keys(skillsItem).filter((skill) => skillsItem[skill]),
      benefits: Object.keys(benefitsItem).filter(
        (benefit) => benefitsItem[benefit]
      ),
      levels: Object.keys(levelsItem).filter((level) => levelsItem[level]),
    };

    console.log(dataToSend);
    let isOk = true;
    // Validate job title
    if (!validateField(dataToSend, 'title')) isOk = false;

    // Validate job department
    if (!validateField(dataToSend, 'department')) isOk = false;

    // Validate start date and end date
    const today = new Date();
    const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000));
    const tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
    const startDate = new Date(dataToSend.startDate.split('-').reverse().join('-'));
    const endDate = new Date(dataToSend.endDate.split('-').reverse().join('-'));
    // console.log(startDate + "----" + endDate)

    if (!validateField(dataToSend, 'startDate')) isOk = false;

    if (!validateField(dataToSend, 'endDate')) isOk = false;

    if (startDate && endDate && startDate > endDate) {
      setErrors((prevErrors) => ({ ...prevErrors, ["endDate"]: "End date must be greater than start date." }));
      isOk = false;
    }
    if (startDate && startDate < today) {
      setErrors((prevErrors) => ({ ...prevErrors, ["startDate"]: "Start date cannot be in the past." }));
      isOk = false;
    }
    if (endDate && endDate <= yesterday) {
      setErrors((prevErrors) => ({ ...prevErrors, ["endDate"]: "End date cannot be in the past." }));
      isOk = false;
    }
    if (endDate && endDate <= today) {
      setErrors((prevErrors) => ({ ...prevErrors, ["endDate"]: "End date must be in the future." }));
      isOk = false;
    }

    // Validate salary
    if (!validateField(dataToSend, 'salaryFrom')) isOk = false;
    if (!validateField(dataToSend, 'salaryTo')) isOk = false;

    // Validate salary range
    if (dataToSend.salaryFrom && dataToSend.salaryTo) {
      if (dataToSend.salaryFrom < 0 || dataToSend.salaryTo < 0) {
        setErrors((prevErrors) => ({ ...prevErrors, ["salaryFrom"]: "Please enter a valid salary range." }));
        isOk = false;
      }
      if (parseFloat(dataToSend.salaryFrom) >= parseFloat(dataToSend.salaryTo)) {
        setErrors((prevErrors) => ({ ...prevErrors, ["salaryTo"]: "Salary to must be greater than salary from." }));
        isOk = false;
      }
    }

    // Validate skills
    if (!validateArr(skillsItem, 'skills')) isOk = false;

    // Validate benefits
    if (!validateArr(benefitsItem, 'benefits')) isOk = false;

    // Validate levels
    if (!validateArr(levelsItem, 'levels')) isOk = false;

    if (!isOk) return;

    try {
      const response = await api.put(`/job/${selectedItem.jobId}`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOpenSkill(false);
      setOpenBenefit(false);
      setOpenLevel(false);
      setReRender(!reRender);
      // console.log("Response:", response.data);
      handleShowToast("success", "Edit job successfully");
      resetForm();
      setShowDetailModal(false);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error:", error);
      handleShowToast("error", error.response.data.message)
    }
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    try {
      const response = await api.post(`/job/list?page=${currentPage}&limit=${itemsPerPage}`, searchParams, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTotalItems(response.data.data.total);
      setDataListJob(response.data.data.items);

    } catch (error) {
      console.error(error);
    }
  };
  const handleSearchReset = async () => {
    setCurrentPage(1);
    setSearchParams({
      fieldValue: "",
      statusCode: "-1",
      roleId: `${roleId}`,
    });
    try {
      const response = await api.post(`/job/list?page=${currentPage}&limit=${itemsPerPage}`, searchParams, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTotalItems(response.data.data.total);
      setDataListJob(response.data.data.items);
      setReRender(!reRender);
    } catch (error) {
      console.error(error);
    }
  }

  const handleCheckboxSkillChange = (event) => {
    const { name, checked } = event.target;
    setSkillsItem((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleCheckboxBenefitChange = (event) => {
    const { name, checked } = event.target;
    setBenefitsItem((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };
  const handleCheckboxLevelChange = (event) => {
    const { name, checked } = event.target;
    setLevelsItem((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };
  const resetForm = () => {
    setErrors({});
    setDisplayValueFrom('0')
    setDisplayValueTo('0')
    setFormData("");
    setSkillsItem((prevState) => {
      return Object.keys(prevState).reduce((newState, skill) => {
        newState[skill] = false;
        return newState;
      }, {});
    });
    setLevelsItem((prevState) => {
      return Object.keys(prevState).reduce((newState, skill) => {
        newState[skill] = false;
        return newState;
      }, {});
    });
    setBenefitsItem((prevState) => {
      return Object.keys(prevState).reduce((newState, skill) => {
        newState[skill] = false;
        return newState;
      }, {});
    });
  }
  const getListJob = async () => {
    try {
      const response = await api.post(
        `/job/list?page=${currentPage}&limit=${itemsPerPage}`,
        {
          fieldValue: "",
          statusCode: "-1",
          roleId: "-1",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDataListJob(response.data.data.items);


      setTotalItems(response.data.data.total);
    } catch (error) {
      console.error(error);
    }
  };
  const getListDepartment = async () => {
    try {
      const response = await api.get("/attributes/department", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setListDepartment(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const deleteJob = async () => {
    // console.log(selectedItem);
    try {
      const response = await api.delete(
        `/job/${selectedItem.jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log(response);
      resetForm();
      setReRender(!reRender);
      handleShowToast("success", "Delete job successfully")
    } catch (error) {
      console.error(error);
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxVisiblePages = 3;
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);


  useEffect(() => {
    getListJob();
    getListDepartment();
  }, [reRender, currentPage]);

  return (
    <>
      <Helmet>
        <title>Jobs</title>
      </Helmet>
      <Row className="my-3">
        <strong className="text-[16px]">Jobs</strong>


        {/* Search */}
        <div className="flex justify-between">
          <div className="shadow-sm py-3 px-3 flex justify-between mb-3 mt-3 bg-white rounded-xl w-[60%]">
            <div className="w-[100%]">
              <div className="flex justify-between items-center">
                <div>
                  <InputGroup size="sm" style={{ width: "400px" }}>
                    <Form.Control
                      aria-label=""
                      name="fieldValue"
                      value={searchParams.fieldValue}
                      onChange={handleSearchInputChange}
                      placeholder="Enter search field"
                    />
                    <InputGroup.Text>
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
                  </InputGroup>
                </div>
                <div>
                  <Form.Select
                    size="sm"
                    aria-label="Select the status of job"
                    name="statusCode"
                    value={searchParams.statusCode}
                    onChange={handleSearchInputChange}
                  >
                    <option value="-1">All</option>
                    <option value="2">Drafted</option>
                    <option value="1">Opened</option>
                    <option value="3">Closed</option>
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
          <div>

            {roleId === "1" || roleId === "2" || roleId === "3" ? (
              <div className="shadow-sm gap-5 py-3 px-3 flex justify-between mb-3 mt-3 bg-white rounded-xl">
                <div className="flex justify-center items-center">
                  <Row className="">
                    <Col lg="12">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="tooltip-reset">Import</Tooltip>}
                      >
                        <i
                          onClick={handleShowImport}
                          className="fa-solid fa-arrow-up-from-bracket fa-xl hover:text-cyan-500 cursor-pointer"
                        ></i>
                      </OverlayTrigger>
                    </Col>
                  </Row>
                </div>
                <div className="flex justify-center items-center">
                  <Row className="">
                    <Col lg="12">
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id="tooltip-reset">Add new job</Tooltip>
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

        <Col lg="2">
          {/* Modal add job */}
          <Modal show={showAddModal} onHide={handleCloseAdd} size="xl">
            <Modal.Header closeButton>
              <Modal.Title>Add New Job</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col className="mb-2" lg="6">
                  <Form.Group
                    className="mb-3"
                    controlId="addJobForm.ControlInput1"
                  >
                    <Form.Label className="fw-semibold">Job Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Job Title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      isInvalid={!!errors.title}
                    />
                    {errors.title && (
                      <div className="text-red-600">{errors.title}</div>
                    )}
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="addJobForm.ControlInput1"
                  >
                    <Row className="mb-3">
                      <Col>
                        <Form.Label className="fw-semibold">
                          Start Date
                        </Form.Label>
                        <Form.Control
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          isInvalid={!!errors.startDate}
                        />
                        {errors.startDate && (
                          <div className="text-red-600">{errors.startDate}</div>
                        )}
                      </Col>
                      <Col>
                        <Form.Label className="fw-semibold">
                          End Date
                        </Form.Label>
                        <Form.Control
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                          isInvalid={!!errors.endDate}
                        />
                        {errors.endDate && (
                          <div className="text-red-600">{errors.endDate}</div>
                        )}
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col>
                        <Form.Label className="fw-semibold">
                          Salary Range
                        </Form.Label>
                      </Col>
                      <Col>
                        <Form.Label className="fw-semibold">From</Form.Label>
                        <Form.Control
                          type="text"
                          name="salaryFrom"
                          value={displayValueFrom}
                          onChange={handleChange}
                          isInvalid={!!errors.salaryFrom}
                        />
                        {errors.salaryFrom && (
                          <div className="text-red-600">{errors.salaryFrom}</div>
                        )}
                      </Col>
                      <Col>
                        <Form.Label className="fw-semibold">To</Form.Label>
                        <Form.Control
                          type="text"
                          name="salaryTo"
                          value={displayValueTo}
                          onChange={handleChange}
                          isInvalid={!!errors.salaryTo}
                        />
                        {errors.salaryTo && (
                          <div className="text-red-600">{errors.salaryTo}</div>
                        )}
                      </Col>
                    </Row>
                    <Form.Group
                      className="mb-3"
                      controlId="addJobForm.ControlInput1"
                    >
                      <Form.Label className="fw-semibold">
                        Working Place
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="HN, HCM,..."
                        name="workingAddress"
                        value={formData.workingAddress}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="addJobForm.ControlInput1">
                      <Form.Label className="fw-semibold">Department</Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        name="department"
                        onChange={handleChange}
                        required
                        isInvalid={!!errors.department}
                      >
                        <option value="">Select a Department</option>
                        {listDepartment.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </Form.Select>
                      {errors.department && (
                        <div className="text-red-600">{errors.department}</div>
                      )}
                    </Form.Group>
                  </Form.Group>
                </Col>
                <Col className="mb-2" lg="6">
                  <Form.Label className="fw-semibold">Skills</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      aria-label="Add Skill"
                      aria-describedby="basic-addon1"
                      type="text"
                      value={Object.keys(skillsItem)
                        .filter((item) => skillsItem[item])
                        .join(", ")}
                      readOnly
                      isInvalid={!!errors.skills}
                    />

                    <Button
                      onClick={() => setOpenSkill(!openSkill)}
                      aria-controls="checkbox-skill-collapse"
                      aria-expanded={openSkill}
                      variant="secondary"
                    >
                      Add Skill
                    </Button>
                  </InputGroup>
                  {errors.skills && (
                    <div className="text-red-600">{errors.skills}</div>
                  )}

                  <Collapse in={openSkill}>
                    <div id="checkbox-skill-collapse">
                      <Card body>
                        {skills.map((item) => (
                          <div key={item.name}>
                            <label>
                              <input
                                type="checkbox"
                                name={item.name}
                                checked={skillsItem[item.name]}
                                onChange={handleCheckboxSkillChange}
                                className="px-4"
                              />
                              {item.label}
                            </label>
                          </div>
                        ))}
                      </Card>
                    </div>
                  </Collapse>

                  {/* Benefits */}
                  <Form.Label className="fw-semibold">Benefits</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      aria-label="Add Benefit"
                      aria-describedby="basic-addon1"
                      type="text"
                      value={Object.keys(benefitsItem)
                        .filter((item) => benefitsItem[item])
                        .join(", ")}
                      readOnly
                      isInvalid={!!errors.benefits}
                    />
                    <Button
                      onClick={() => setOpenBenefit(!openBenefit)}
                      aria-controls="checkbox-benefit-collapse"
                      aria-expanded={openBenefit}
                      variant="secondary"
                    >
                      Add Benefit
                    </Button>
                  </InputGroup>
                  {errors.benefits && (
                    <div className="text-red-600">{errors.benefits}</div>
                  )}

                  <Collapse in={openBenefit}>
                    <div id="checkbox-benefit-collapse">
                      <Card body>
                        {benefits.map((item) => (
                          <div key={item.name}>
                            <label>
                              <input
                                type="checkbox"
                                name={item.name}
                                checked={benefitsItem[item.name]}
                                onChange={handleCheckboxBenefitChange}
                                className="px-4"
                              />
                              {item.label}
                            </label>
                          </div>
                        ))}
                      </Card>
                    </div>
                  </Collapse>

                  {/* Levels */}
                  <Form.Label className="fw-semibold">Levels</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      aria-label="Add Levels"
                      aria-describedby="basic-addon1"
                      type="text"
                      value={Object.keys(levelsItem)
                        .filter((item) => levelsItem[item])
                        .join(", ")}
                      readOnly
                      isInvalid={!!errors.levels}
                    />
                    <Button
                      onClick={() => setOpenLevel(!openLevel)}
                      aria-controls="checkbox-level-collapse"
                      aria-expanded={openLevel}
                      variant="secondary"
                    >
                      Add level
                    </Button>
                  </InputGroup>
                  {errors.levels && (
                    <div className="text-red-600">{errors.levels}</div>
                  )}

                  <Collapse in={openLevel}>
                    <div id="checkbox-level-collapse">
                      <Card body>
                        {levels.map((item) => (
                          <div key={item.name}>
                            <label>
                              <input
                                type="checkbox"
                                name={item.name}
                                checked={levelsItem[item.name]}
                                onChange={handleCheckboxLevelChange}
                                className="px-4"
                              />
                              {item.label}
                            </label>
                          </div>
                        ))}
                      </Card>
                    </div>
                  </Collapse>

                  <Form.Label className="fw-semibold">Description: </Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Decription here"
                    rows="4.5"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseAdd}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleSubmit();

                }}
              >
                Add New Job
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal import job */}

          <Modal show={showImportModal} onHide={handleCloseImport}>
            <Modal.Header closeButton>
              <Modal.Title>Import Job</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group controlId="formFileSm" className="mb-3">
                <Form.Label>Sau khi chọn file click vào validate để kiểm tra file hợp lệ (.xlsx)</Form.Label>
                <Form.Control
                  type="file"
                  size="sm"
                  accept=".xlsx"
                  onChange={handleFileChange}
                />
                {selectedFile && <p>Selected file: {selectedFile.name}</p>}
                <Button className="my-3" variant="secondary" size="sm" onClick={handleValidateFile}>
                  Validate File
                </Button>
                {isValidateFile && (<p className="text-success">Validate file thành công, có thể import  </p>)}
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseImport}>
                Close
              </Button>

              {isValidateFile && (
                <Button variant="success" onClick={handleImportFile}>
                  Import Job
                </Button>
              )}
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>

      {/* Table */}
      <div className="shadow-sm px-2 py-2 rounded-xl bg-white">
        <table className="table table-striped ">
          <thead className="table-dark">
            <tr>
              <th scope="col span-2">Job Title</th>
              <th scope="col">Required Skills</th>
              <th scope="col">Start Date</th>
              <th scope="col">End Date</th>
              <th scope="col">Level</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody className="fs-8">
            {dataListJob &&
              dataListJob.map((item) => (
                <>
                  <tr key={item.jobId}>
                    <td scope="row">{item.title}</td>
                    <td>
                      {item.skills.map((item) => (
                        <span className="p-1" key={item}>
                          {item}
                        </span>
                      ))}
                    </td>
                    <td>{item.startDate}</td>
                    <td>{item.endDate}</td>
                    <td>
                      {item.levels.map((item) => (
                        <span className="p-1" key={item}>
                          {item}
                        </span>
                      ))}
                    </td>
                    <td>{item.status}</td>
                    <td>
                      <i
                        onClick={() => {
                          let from = numeral(item.salaryFrom).format('0,0');
                          let to = numeral(item.salaryTo).format('0,0')
                          setDisplayValueFrom(from)
                          setDisplayValueTo(to)

                          console.log(from, to)

                          setSelectedItem({ ...item });
                          setFormData(item);
                          handleShowDetail();
                        }}
                        className="bi bi-eye p-1"
                      ></i>
                    </td>
                  </tr>
                </>
              ))}
          </tbody>
        </table>

        {/* pagination */}
        <Row>
          <Col>
          </Col>

          <Col xs="auto" className="d-flex align-items-center">
            <Pagination>
              {currentPage > 1 && (
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
              )}
              {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                <Pagination.Item
                  key={page}
                  active={page === currentPage}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Pagination.Item>
              ))}
              {currentPage < totalPages && (
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
              )}
            </Pagination>
          </Col>
        </Row>
      </div>

      {/* Modal details job */}

      <Modal show={showDetailModal} onHide={handleCloseDetail} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Detail Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col className="mb-2" lg="6">
              <Form.Group className="mb-3" controlId="addJobForm.ControlInput1">
                <Form.Label className="fw-semibold">Job Title:</Form.Label>
                {" "}{selectedItem.title}
              </Form.Group>
              <Form.Group className="mb-3" controlId="addJobForm.ControlInput1">
                <Row className="mb-3">
                  <Col>
                    <Form.Label className="fw-semibold">Start Date: </Form.Label>
                    {" "}{selectedItem.startDate}
                  </Col>
                  <Col>
                    <Form.Label className="fw-semibold">End Date:</Form.Label>
                    {" "}{selectedItem.endDate}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <Form.Label className="fw-semibold">
                      Salary Range:
                    </Form.Label>
                    {" "}{displayValueFrom}{"-"}{displayValueTo} VND
                  </Col>
                </Row>
                <Form.Group
                  className="mb-3"
                  controlId="addJobForm.ControlInput1"
                >
                  <Form.Label className="fw-semibold">Working Place:</Form.Label>
                  {" "}{selectedItem.workingAddress}
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="addJobForm.ControlInput1"
                >
                  <Form.Label className="fw-semibold">Status: </Form.Label>
                  {" "}{selectedItem.status}
                </Form.Group>
              </Form.Group>
            </Col>
            <Col className="mb-2" lg="6">
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Skills:</Form.Label>
                {" "}{selectedItem.skills &&
                  selectedItem.skills.map((item, index) => (
                    <React.Fragment key={item}>
                      <span className="p-1">{item}</span>
                      {index < selectedItem.skills.length - 1 && <span>&nbsp;</span>}
                    </React.Fragment>
                  ))}
              </Form.Group>
              {/* Benefits */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Benefits:</Form.Label>
                {" "}{selectedItem.benefits &&
                  selectedItem.benefits.map((item) => (
                    <span className="p-1" key={item}>
                      {item}
                    </span>
                  ))}
              </Form.Group>
              {/* Levels */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Levels:</Form.Label>
                {" "}{selectedItem.levels &&
                  selectedItem.levels.map((item) => (
                    <span className="p-1" key={item}>
                      {item}
                    </span>
                  ))}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Department:</Form.Label>
                {" "}{selectedItem.department}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Description:</Form.Label>
                {" "}{selectedItem.description}
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetail}>
            Close
          </Button>
          {roleId === "1" || roleId === "2" || roleId === "3" ? (
            <>
            {console.log(selectedItem.status)}
              {selectedItem.status === 'DRAFT' &&
                <Button variant="primary" onClick={
                  () => {
                    handleShowEdit();
                  }
                }>
                  Edit Job
                </Button>}
              <Button variant="warning" onClick={
                () => {
                  handleCloseDetail();
                  handleShowDelete();
                }
              }>
                Delete Job
              </Button>


            </>
          ) : null}

        </Modal.Footer>
      </Modal>


      {/* Confirm Delete Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Close
          </Button>
          <Button variant="danger" onClick={() => {
            deleteJob();
            handleCloseDelete();
          }}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>



      {/* Modal edit job */}
      <Modal show={showEditlModal} onHide={handleCloseEdit} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Edit Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col className="mb-2" lg="6">
              <Form.Group className="mb-3" controlId="addJobForm.ControlInput1">
                <Form.Label className="fw-semibold">Job Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Job Title"
                  name="title"
                  value={selectedItem.title}
                  onChange={(e) => {
                    setSelectedItem({ ...selectedItem, title: e.target.value });
                    handleChange(e);
                  }}
                  isInvalid={!!errors.title}
                />
                {errors.title && (
                  <div className="text-red-600">{errors.title}</div>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="addJobForm.ControlInput1">
                <Form.Label className="fw-semibold">Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={parseDate(selectedItem.startDate)}
                  onChange={(e) => {
                    setSelectedItem({
                      ...selectedItem,
                      startDate: formatDate(e.target.value),
                    });
                    handleChange(e);
                  }}
                  isInvalid={!!errors.startDate}
                />
                {errors.startDate && (
                  <div className="text-red-600">{errors.startDate}</div>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="addJobForm.ControlInput1">
                <Form.Label className="fw-semibold">End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={parseDate(selectedItem.endDate)}
                  onChange={(e) => {
                    setSelectedItem({
                      ...selectedItem,
                      endDate: formatDate(e.target.value),
                    });
                    handleChange(e);
                  }}
                  isInvalid={!!errors.endDate}
                />
                {errors.endDate && (
                  <div className="text-red-600">{errors.endDate}</div>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="addJobForm.ControlInput1">
                <Form.Label className="fw-semibold">Salary From</Form.Label>
                <Form.Control
                  type="text"
                  name="salaryFrom"
                  value={displayValueFrom}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  isInvalid={!!errors.salaryFrom}
                />
                {errors.salaryFrom && (
                  <div className="text-red-600">{errors.salaryFrom}</div>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="addJobForm.ControlInput1">
                <Form.Label className="fw-semibold">Salary To</Form.Label>
                <Form.Control
                  type="text"
                  name="salaryTo"
                  value={displayValueTo}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  isInvalid={!!errors.salaryTo}
                />
                {errors.salaryTo && (
                  <div className="text-red-600">{errors.salaryTo}</div>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="addJobForm.ControlInput1">
                <Form.Label className="fw-semibold">Working Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="HN, HCM,..."
                  name="workingAddress"
                  value={selectedItem.workingAddress}
                  onChange={(e) => {
                    setSelectedItem({
                      ...selectedItem,
                      workingAddress: e.target.value,
                    });
                    handleChange(e);
                  }}
                />
              </Form.Group>
            </Col>

            <Col className="mb-2" lg="6">
              <Form.Label className="fw-semibold">Skills</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  aria-label="Add Skill"
                  aria-describedby="basic-addon1"
                  type="text"
                  value={Object.keys(skillsItem)
                    .filter((item) => skillsItem[item])
                    .join(", ")}
                  readOnly
                  isInvalid={!!errors.skills}
                />

                <Button
                  onClick={() => setOpenSkill(!openSkill)}
                  aria-controls="checkbox-skill-collapse"
                  aria-expanded={openSkill}
                  variant="secondary"
                >
                  Add Skill
                </Button>
              </InputGroup>
              {errors.skills && (
                <div className="text-red-600">{errors.skills}</div>
              )}

              <Collapse in={openSkill}>
                <div id="checkbox-skill-collapse">
                  <Card body>
                    {skills.map((item) => (
                      <div key={item.name}>
                        <label>
                          <input
                            type="checkbox"
                            name={item.name}
                            checked={skillsItem[item.name]}
                            onChange={handleCheckboxSkillChange}
                            className="px-4"
                          />
                          {item.label}
                        </label>
                      </div>
                    ))}
                  </Card>
                </div>
              </Collapse>

              {/* Benefits */}
              <Form.Label className="fw-semibold">Benefits</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  aria-label="Add Benefit"
                  aria-describedby="basic-addon1"
                  type="text"
                  value={Object.keys(benefitsItem)
                    .filter((item) => benefitsItem[item])
                    .join(", ")}
                  readOnly
                  isInvalid={!!errors.benefits}
                />
                <Button
                  onClick={() => setOpenBenefit(!openBenefit)}
                  aria-controls="checkbox-benefit-collapse"
                  aria-expanded={openBenefit}
                  variant="secondary"
                >
                  Add Benefit
                </Button>
              </InputGroup>
              {errors.benefits && (
                <div className="text-red-600">{errors.benefits}</div>
              )}

              <Collapse in={openBenefit}>
                <div id="checkbox-benefit-collapse">
                  <Card body>
                    {benefits.map((item) => (
                      <div key={item.name}>
                        <label>
                          <input
                            type="checkbox"
                            name={item.name}
                            checked={benefitsItem[item.name]}
                            onChange={handleCheckboxBenefitChange}
                            className="px-4"
                          />
                          {item.label}
                        </label>
                      </div>
                    ))}
                  </Card>
                </div>
              </Collapse>

              {/* Levels */}
              <Form.Label className="fw-semibold">Levels</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  aria-label="Add Levels"
                  aria-describedby="basic-addon1"
                  type="text"
                  value={Object.keys(levelsItem)
                    .filter((item) => levelsItem[item])
                    .join(", ")}
                  readOnly
                  isInvalid={!!errors.levels}
                />
                <Button
                  onClick={() => setOpenLevel(!openLevel)}
                  aria-controls="checkbox-level-collapse"
                  aria-expanded={openLevel}
                  variant="secondary"
                >
                  Add level
                </Button>
              </InputGroup>
              {errors.levels && (
                <div className="text-red-600">{errors.levels}</div>
              )}

              <Collapse in={openLevel}>
                <div id="checkbox-level-collapse">
                  <Card body>
                    {levels.map((item) => (
                      <div key={item.name}>
                        <label>
                          <input
                            type="checkbox"
                            name={item.name}
                            checked={levelsItem[item.name]}
                            onChange={handleCheckboxLevelChange}
                            className="px-4"
                          />
                          {item.label}
                        </label>
                      </div>
                    ))}
                  </Card>
                </div>
              </Collapse>

              <Form.Group
                className="mb-3"
                controlId="addJobForm.ControlInput1"
              >
                <Form.Label className="fw-semibold">Department</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  name="department"
                  onChange={handleChange}
                  required
                  defaultValue={selectedItem.department}
                  isInvalid={!!errors.department}
                >
                  {listDepartment.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Form.Select>
                {errors.department && (
                  <div className="text-red-600">{errors.department}</div>
                )}
              </Form.Group>

              <Form.Label className="fw-semibold">Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Decription here"
                rows="4.5"
                name="description"
                value={selectedItem.description}
                onChange={(e) => {
                  setSelectedItem({
                    ...selectedItem,
                    description: e.target.value,
                  });
                  handleChange(e);
                }}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleSubmitEdit();

            }}
          >
            Edit Job
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Job;
