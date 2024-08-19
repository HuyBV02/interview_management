import { Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import Form from "react-bootstrap/Form";

import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import { SearchOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";

import api from "../api/api";
import {
  ChangeFormateDate,
  formatDate,
  parseDate,
  convertDateApi,
} from "../utils/formatDate";
import { Helmet } from "react-helmet";
import { Pagination } from "react-bootstrap";
import "../assets/styles/style.css";
import axios from "axios";
import { saveAs } from "file-saver";
import { handleShowToast } from "../utils/handleShowToast";

import { useLocation } from "react-router-dom";
import numeral from 'numeral';

const Offer = () => {
  const roleId = localStorage.getItem("roleId");

  const [errors, setErrors] = useState({});
  const [displayValue, setDisplayValue] = useState('0');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditlModal, setShowEditModal] = useState(false);

  const [showNotelModal, setShowNoteModal] = useState(false);

  const [searchParams, setSearchParams] = useState({
    fieldValue: "",
    statusCode: "-1",
    roleId: `${roleId}`,
  });

  //money
  const formatMoney = (amount) => {
    return amount?.toLocaleString("en-US");
  };
  //get frm interview
  const location = useLocation();
  const [interviewFromInterview, setInterviewFromInterview] = useState(null);
  useEffect(() => {
    if (location.state?.showModalAdd) {
      setShowAddModal(true);
    }
    if (location.state) {
      setInterviewFromInterview(location.state.interview);
    }
  }, [location.state]);


  // Detail Offer
  const [listOffer, setListOffer] = useState([]);
  const [listCandidate, setListCandidate] = useState([]);
  const [listManager, setListManager] = useState([]);
  const [listInterview, setListInterview] = useState([]);
  const [listContract, setListContract] = useState([]);
  const [listLevel, setListLevel] = useState([]);
  const [listDepartment, setListDepartment] = useState([]);
  const [listRecuiter, setListRecuiter] = useState([]);
  const [listInterviewer, setListInterviewer] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState();
  const [selectedInterview, setSelectedInterview] = useState();

  const [selectedItem, setSelectedItem] = useState({});
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [status, setStatus] = useState("");
  const [noteOffer, setNoteOffer] = useState("");
  const [reRender, setReRender] = useState(false);

  const [startDate, setStartDate] = useState("01/01/2024");
  const [endDate, setEndDate] = useState("29/07/2024");

  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  const handleCloseAdd = () => {
    setShowAddModal(false);
    setInterviewFromInterview(null);
    window.history.replaceState(null, '', window.location.pathname);
    resetForm();
    setErrors({});
  }
  const handleShowAdd = () => {
    setShowAddModal(true);
  };

  const handleCloseImport = () => setShowImportModal(false);
  const handleShowImport = () => setShowImportModal(true);

  const handleCloseDetail = () => {
    setShowDetailModal(false);
  };
  const handleShowDetail = () => setShowDetailModal(true);

  const handleCloseEdit = () => {
    setShowEditModal(false);
    resetForm();
    setErrors({});
  }
  const handleShowEdit = () => {
    setFormData({
      ...formData,
      position: selectedCandidate?.position,
      "recruiterId":selectedItem?.approver?.userId
    });
    setShowEditModal(true);
    getInterviewDetail(selectedItem.interview.interviewId);
    getListInterview(selectedItem.candidate.candidateId);
    
  };

  const handleCloseNote = () => {
    setShowNoteModal(false);
    setNoteOffer("");
  };
  const handleShowNote = () => {
    setShowNoteModal(true);
    setShowDetailModal(false);
  };

  const [formData, setFormData] = useState({
    startContract: "",
    endContract: "",
    dueDate: "", //10-08-2024
    basicSalary: "",
    note: "", //note offer
    contractType: "", //TRIAL
    department: "", //IT
    position: "", //BE
    level: "", //FRESHER
    candidateId: "",
    approverId: "",
    recruiterId: "",
    interviewId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'basicSalary') {

      const numericValue = value.replace(/,/g, '');
      const formattedValue = numeral(numericValue).format('0,0');
      setDisplayValue(formattedValue);
      setFormData({
        ...formData,
        [name]: parseFloat(numericValue) || 0,
      });

    }
    else {
      setFormData({
        ...formData,
        position: selectedCandidate?.position,
        [name]: value,
      });
    }
  };
  const handleSearchInputChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    setCurrentPage(1);

    try {
      const response = await api.post(
        `/offer/list?page=${currentPage}&limit=${itemsPerPage}`,
        searchParams,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setListOffer(response.data.data.items);

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
      const response = await api.post(
        `/offer/list?page=${currentPage}&limit=${itemsPerPage}`,
        searchParams,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setListOffer(response.data.data.items);
      setReRender(!reRender);
    } catch (error) {
      console.error(error);
    }
  };
  const handleCandidateChange = (event) => {
    const selectedId = parseInt(event.target.value);
    const selectedCandidate = listCandidate.find(
      (c) => c.candidateId === selectedId
    );
    handleChange(event);
    getListInterview(selectedCandidate.candidateId);
    setSelectedCandidate(selectedCandidate);
  };
  const handleInterviewChange = (event) => {
    const selectedId = parseInt(event.target.value);
    const selectedInterview = listInterview.find(
      (c) => c.interviewId === selectedId
    );
    handleChange(event);
    setSelectedInterview(selectedInterview);
    setListLevel(selectedInterview.job.levels);

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

  const handleSubmit = async () => {
    var dataToSend = {};
    if (interviewFromInterview !== null) {
      dataToSend = {
        note: formData.note, //note offer
        contractType: formData.contractType, //TRIAL
        department: interviewFromInterview?.job?.department, //IT
        position: interviewFromInterview?.candidate?.position, //BE
        level: formData.level,
        startContract: formatDate(formData.startContract),
        endContract: formatDate(formData.endContract),
        dueDate: formatDate(formData.dueDate),
        basicSalary: parseFloat(formData.basicSalary),
        candidateId: interviewFromInterview?.candidate?.candidateId,
        approverId: parseFloat(formData.approverId),
        recruiterId: interviewFromInterview?.recruit?.userId,
        interviewId: interviewFromInterview?.interviewId,
      };
    } else {
      dataToSend = {
        note: formData.note, //note offer
        contractType: formData.contractType, //TRIAL
        department: selectedInterview.job.department,
        position: formData.position, //BE
        level: formData.level,
        startContract: formatDate(formData.startContract),
        endContract: formatDate(formData.endContract),
        dueDate: formatDate(formData.dueDate),
        basicSalary: parseFloat(formData.basicSalary),
        candidateId: parseFloat(formData.candidateId),
        approverId: parseFloat(formData.approverId),
        recruiterId: selectedInterview.recruit.userId,
        interviewId: selectedInterview.interviewId,
      };
    }

    // validate form
    let isOk = true;
    if (!validateField(dataToSend, 'candidateId')) isOk = false;
    if (!validateField(dataToSend, 'approverId')) isOk = false;
    if (!validateField(dataToSend, 'interviewId')) isOk = false;
    if (!validateField(dataToSend, 'recruiterId')) isOk = false;

    // Validate start date and end date
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const startDate = new Date(
      dataToSend.startContract.split("-").reverse().join("-")
    );
    const endDate = new Date(
      dataToSend.endContract.split("-").reverse().join("-")
    );
    const dueDate = new Date(dataToSend.dueDate.split("-").reverse().join("-"));
    

    if (startDate.toString() === 'Invalid Date') {
      setErrors((prevErrors) => ({ ...prevErrors, ["startContract"]: "Please enter a start date." }));
      isOk = false;
    } else setErrors((prevErrors) => ({ ...prevErrors, ["startContract"]: "" }));
    if (startDate <= yesterday) {
      setErrors((prevErrors) => ({ ...prevErrors, ["startContract"]: "Start date cannot be in the past." }));
      isOk = false;
    }
    if (endDate.toString() === 'Invalid Date') {
      setErrors((prevErrors) => ({ ...prevErrors, ["endContract"]: "Please enter a end date." }));
      isOk = false;
    } else setErrors((prevErrors) => ({ ...prevErrors, ["endContract"]: "" }));
    if (endDate < tomorrow) {
      setErrors((prevErrors) => ({ ...prevErrors, ["endContract"]: "End date must be in the future." }));
      isOk = false;
    }
    if (startDate && endDate && startDate >= endDate) {
      setErrors((prevErrors) => ({ ...prevErrors, ["endContract"]: "End date must be greater than start date." }));
      isOk = false;
    }

    if (!validateField(dataToSend, 'contractType')) isOk = false;
    if (!validateField(dataToSend, 'level')) isOk = false;
    if (!validateField(dataToSend, 'department')) isOk = false;

    // Due date
    if (dueDate.toString() === 'Invalid Date') {
      setErrors((prevErrors) => ({ ...prevErrors, ["dueDate"]: "Please enter a due date." }));
      isOk = false;
    } else setErrors((prevErrors) => ({ ...prevErrors, ["dueDate"]: "" }));
    if (dueDate <= today) {
      setErrors((prevErrors) => ({ ...prevErrors, ["dueDate"]: "Due date cannot be in the past." }));
      isOk = false;
    }

    // Validate salary range
    if (!validateField(dataToSend, 'basicSalary')) isOk = false;

    if (!isOk) return;

    try {
      const response = await api.post("/offer", dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      handleShowToast("success", "Add offer successfully");
      resetForm();
      handleCloseAdd();
      setInterviewFromInterview(null);
      window.history.replaceState(null, '', window.location.pathname);
      setReRender(!reRender);
    } catch (error) {
      console.error("Error:", error);
      if (error.response.data.code === 400) {
        handleShowToast("error", error.response.data.message);
      } else {
        handleShowToast("error", "Error add offer!");
      }
    }
  };

  const handleSubmitEdit = async () => {

    const dataToSend = {
      note: formData.note, //note offer
      contractType: formData.contractType, //TRIAL
      department: selectedInterview?.job.department, //IT
      position: selectedItem.position, //BE
      level: formData.level, //FRESHER
      startContract: ChangeFormateDate(formData.startContract),
      endContract: ChangeFormateDate(formData.endContract),
      dueDate: ChangeFormateDate(formData.dueDate),
      basicSalary: parseFloat(formData.basicSalary),
      candidateId: parseFloat(formData.candidate.candidateId),
      approverId: parseFloat(formData.approverId || selectedItem.approver.userId),
      recruiterId: selectedInterview.recruit.userId,
      interviewId: selectedInterview.interviewId,
    };
   
    // validate form
    let isOk = true;
    if (!validateField(dataToSend, 'candidateId')) isOk = false;
    if (!validateField(dataToSend, 'approverId')) isOk = false;
    if (!validateField(dataToSend, 'interviewId')) isOk = false;
    if (!validateField(dataToSend, 'recruiterId')) isOk = false;

    // Validate start date and end date
    const today = new Date();
    const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000));
    const tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
    const startDate = new Date(dataToSend.startContract.split('-').reverse().join('-'));
    const endDate = new Date(dataToSend.endContract.split('-').reverse().join('-'));
    const dueDate = new Date(dataToSend.dueDate.split('-').reverse().join('-'));


    if (startDate.toString() === 'Invalid Date') {
      setErrors((prevErrors) => ({ ...prevErrors, ["startContract"]: "Please enter a start date." }));
      isOk = false;
    } else setErrors((prevErrors) => ({ ...prevErrors, ["startContract"]: "" }));
    if (startDate <= yesterday) {
      setErrors((prevErrors) => ({ ...prevErrors, ["startContract"]: "Start date cannot be in the past." }));
      isOk = false;
    }
    if (endDate.toString() === 'Invalid Date') {
      setErrors((prevErrors) => ({ ...prevErrors, ["endContract"]: "Please enter a end date." }));
      isOk = false;
    } else setErrors((prevErrors) => ({ ...prevErrors, ["endContract"]: "" }));
    if (endDate < tomorrow) {
      setErrors((prevErrors) => ({ ...prevErrors, ["endContract"]: "End date must be in the future." }));
      isOk = false;
    }
    if (startDate && endDate && startDate >= endDate) {
      setErrors((prevErrors) => ({ ...prevErrors, ["endContract"]: "End date must be greater than start date." }));
      isOk = false;
    }

    if (!validateField(dataToSend, 'contractType')) isOk = false;
    if (!validateField(dataToSend, 'level')) isOk = false;
    if (!validateField(dataToSend, 'department')) isOk = false;

    // Due date
    if (dueDate.toString() === 'Invalid Date') {
      setErrors((prevErrors) => ({ ...prevErrors, ["dueDate"]: "Please enter a due date." }));
      isOk = false;
    } else setErrors((prevErrors) => ({ ...prevErrors, ["dueDate"]: "" }));
    if (dueDate <= today) {
      setErrors((prevErrors) => ({ ...prevErrors, ["dueDate"]: "Due date cannot be in the past." }));
      isOk = false;
    }

    // Validate salary range
    if (!validateField(dataToSend, 'basicSalary')) isOk = false;

    if (!isOk) return;

    try {
      const response = await api.put(
        `/offer/${selectedItem.offerId}`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleShowToast("success", "Edit offer successfully");
      resetForm();
      setReRender(!reRender);
      handleCloseEdit();
      handleCloseDetail();
    } catch (error) {
      console.error("Error:", error);
      handleShowToast("error", "Error edit offer");
    }
  };

  const handleChangeStatusOffer = async () => {
    if (noteOffer == "") {
      handleShowToast("error", "Please enter note.");
      return;
    }
    if (noteOffer.trim() == "") {
      handleShowToast("error", "Please enter note.");
      return;
    }
    try {
      const response = await api.put(
        `/offer/${selectedItem.offerId}/${status}`,
        {
          note: `${noteOffer}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleShowToast("success", "Save the note successfully");
      handleCloseNote();
      setReRender(!reRender);
    } catch (error) {
      console.error("Error:", error);
      handleShowToast("error", "Error save the note");
    } finally {
      setNoteOffer("");
    }
  };
  const sendMailReminderCandidate = async () => {
    sendMailToCandidate();
  };

  const sendMailToManager = async () => {
    try {
      const response = await api.get(
        `/offer/${selectedItem.offerId}/reminder`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      handleShowToast("success", "Send mail to manager successfully");
    } catch (error) {
      console.error("Error:", error);
      handleShowToast("error", "Send mail to manager Error");
    }
  };
  const sendMailToCandidate = async () => {
    try {
      const response = await api.get(
        `/offer/${selectedItem.offerId}/reminder/candidate`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleShowToast("success", "Send mail to candidate successfully");
    } catch (error) {
      console.error("Error:", error);
      handleShowToast("error", "Send mail to candidate error");
    }
  };
  const handleChangeNote = (e) => {
    setNoteOffer(e.target.value);
  };

  let token = localStorage.getItem("token");

  const resetForm = () => {
    setFormData({
      startContract: "",
      endContract: "",
      dueDate: "", //10-08-2024
      basicSalary: "",
      note: "", //note offer
      contractType: "", //TRIAL
      department: "", //IT
      position: "", //BE
      level: "", //FRESHER
      candidateId: "",
      approverId: "",
      recruiterId: "",
      interviewId: "",
    })
    setErrors({});
  }

  const getListCandidate = async () => {
    try {
      const response = await api.get(
        "/candidate/list/passed?search=",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const activeCandidate = response.data.data;
      
      setListCandidate(activeCandidate);
    } catch (error) {
      console.error(error);
    }
  };
  const getListManager = async () => {
    try {
      const response = await api.get(
        "/user/list/2?search=",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setListManager(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const getListContract = async () => {
    try {
      const response = await api.get("/attributes/contract_type", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setListContract(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getListInterview = async (props) => {
    try {
      const response = await api.get(`/interview/list/${props}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const interviews = response.data.data;
      setListInterview(interviews);
    } catch (error) {
      console.error(error);
    }
  };
  const getInterviewDetail = async (props) => {
    try {
      const response = await api.get(`/interview/${props}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const interviews = response.data.data;
      setSelectedInterview(interviews);
    } catch (error) {
      console.error(error);
    }
  };

  const getListLevel = async () => {
    try {
      const response = await api.get("/attributes/level", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setListLevel(response.data.data);
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
  const getListRecuiter = async () => {
    try {
      const response = await api.get("/user/list/3?search=", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setListRecuiter(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getListOffer = async () => {
    try {
      const response = await api.post(
        `/offer/list?page=${currentPage}&limit=${itemsPerPage}`,
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
      setListOffer(response.data.data.items);
      setTotalItems(response.data.data.total);
    } catch (error) {
      console.error(error);
    }
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleExport = async () => {
    if (!startDate) {
      handleShowToast("error", "Please enter a start date.");
      return;
    }

    if (!endDate) {
      handleShowToast("error", "Please enter a end date.");
      return;
    }
    if (startDate && endDate && startDate > endDate) {
      handleShowToast("error", "End date must be greater than start date.");
      return;
    }
    const startDateParams = convertDateApi(startDate);
    const endDateParams = convertDateApi(endDate);

    try {
      const response = await axios.get(
        `http://localhost:8082/api/offer/export?startDate=${startDateParams}&endDate=${endDateParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // This is important to handle the file download
        }
      );

      // Use file-saver to save the blob
      const blob = new Blob([response.data]);
      saveAs(blob, "file.xlsx"); // Specify the filename here
      handleShowToast("success", "Export Successfully");
    } catch (error) {
      console.error("Error downloading the file", error);
      handleShowToast("error", "Error downloading the file");
    }
  };
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxVisiblePages = 3;
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  const shouldShowEditButton =
    roleId == "3" && (status == "REJECTED");
  const shouldShowButtonApproved = roleId == "3" && status == "APPROVED";
  const shouldShowButtonWFR =
    (roleId == "2" || roleId == "3") && status == "WAITING_FOR_RESPONSE";
  const shouldShowButtonAccept =
    roleId == "3" && (status == "ACCEPTED_OFFER" || status == "DECLINED_OFFER");
  const shouldShowButtonWFA = roleId == "2" && status == "WAITING_FOR_APPROVAL";
  useEffect(() => {
    getListOffer();
    getListCandidate();
    getListManager();
    getListContract();
    // getListLevel();
    // getListDepartment();
    // getListRecuiter();
  }, [reRender]);

  const [levelByJob, setLevelByJob] = useState([]);
  const getLevelByJob = async (interviewId) => {
    await axios
      .get(`http://localhost:8082/api/interview/${interviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const levelByJob = response.data.data?.job?.levels;
        setLevelByJob(levelByJob);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Helmet>
        <title>Offer</title>
      </Helmet>
      <Row className="my-3">
        <strong className="text-[16px]">Offer</strong>
        <div className="flex justify-between">
          <div className="shadow-sm py-3 px-3 flex justify-between mb-3 mt-3 bg-white rounded-xl w-[70%]">
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
                {/* <Col lg="2">
          <Form.Select size="sm" aria-label="">
            <option>Department</option>
            <option value="Drafted">Drafted</option>
            <option value="Opened">Opened</option>
            <option value="Closed">Closed</option>
          </Form.Select>
        </Col> */}
                <div>
                  <Form.Select
                    size="sm"
                    aria-label="Select the status of job"
                    name="statusCode"
                    value={searchParams.statusCode}
                    onChange={handleSearchInputChange}
                  >
                    <option value="-1">All</option>
                    <option value="1">WAITING_FOR_APPROVAL</option>
                    <option value="2">WAITING_FOR_RESPONSE</option>
                    <option value="3">APPROVED</option>
                    <option value="4">REJECTED</option>
                    <option value="5">ACCEPTED_OFFER</option>
                    <option value="6">DECLINED_OFFER</option>
                    <option value="7">CANCELLED</option>
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
          <div className="shadow-sm gap-5 py-3 px-3 flex justify-between mb-3 mt-3 bg-white rounded-xl">
            <div className="flex justify-center items-center">
              <Row className="">
                <Col lg="12">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-reset">Export</Tooltip>}
                  >
                    <i
                      onClick={handleShowImport}
                      className="fa-solid fa-file-export fa-xl hover:text-cyan-500 cursor-pointer"
                    ></i>
                  </OverlayTrigger>
                </Col>
              </Row>
            </div>

            {roleId == "3" && (
              <div className="flex justify-center items-center">
                <Row className="">
                  <Col lg="12">
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip-reset">Add new offer</Tooltip>
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
            )}
          </div>
        </div>

        <Col lg="2">
          {/* Modal export offer */}

          <Modal show={showImportModal} onHide={handleCloseImport}>
            <Modal.Header closeButton>
              <Modal.Title>Export Offer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group controlId="formFileSm" className="mb-3">
                <Row className="mb-3">
                  <Form.Label className="fw-semibold">
                    Nhập ngày bắt đầu và kết thúc:
                  </Form.Label>
                  <Col>
                    <Form.Label className="fw-semibold">Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="startContract"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                      }}
                      required
                    />
                  </Col>
                  <Col>
                    <Form.Label className="fw-semibold">End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="endContract"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                      }}
                      required
                    />
                  </Col>
                </Row>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseImport}>
                Close
              </Button>
              <Button variant="primary" onClick={handleExport}>
                Export
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
      {/* Modal add offer */}
      <Modal show={showAddModal} onHide={handleCloseAdd} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Add New Offer </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col className="mb-2" lg="6">
              <Form.Group className="mb-3" controlId="addJobForm.ControlInput1">
                <Form.Label className="fw-semibold">
                  Select Candidate
                </Form.Label>
                {interviewFromInterview !== null ? (
                  <Form.Control
                    aria-label="Default select example"
                    value={interviewFromInterview?.candidate?.fullName}
                    name="candidateId"
                    required
                    disabled={true}
                  ></Form.Control>
                ) : (
                  <Form.Select
                    aria-label="Default select example"
                    onChange={handleCandidateChange}
                    name="candidateId"
                    required
                  >
                    <option value="">Select a candidate</option>
                    {listCandidate.map((candidate) => (
                      <option
                        key={candidate.candidateId}
                        value={candidate.candidateId}
                      >
                        {candidate.fullName}
                      </option>
                    ))}
                  </Form.Select>
                )}
                {errors.candidateId && (
                  <div className="text-red-600">{errors.candidateId}</div>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="addJobForm.ControlInput1">
                <Form.Label className="fw-semibold">
                  Select Position:
                </Form.Label>
                {interviewFromInterview !== null ? (
                  <Form.Control
                    value={interviewFromInterview?.candidate?.position}
                    disabled={true}
                  />
                ) : (
                  <Form.Control value={selectedCandidate?.position} />
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="addJobForm.ControlInput1">
                <Form.Label className="fw-semibold">
                  Select Approver:{" "}
                </Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={handleChange}
                  name="approverId"
                  required
                  isInvalid={!!errors.approverId}
                >
                  <option value="">Select a Approver</option>
                  {listManager.map((item) => (
                    <option key={item.userId} value={item.userId}>
                      {item.fullName} - {item.username}
                    </option>
                  ))}
                </Form.Select>
                {errors.approverId && (
                  <div className="text-red-600">{errors.approverId}</div>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="addJobForm.ControlInput1">
                <Form.Label className="fw-semibold">Interview Info</Form.Label>
                {interviewFromInterview !== null ? (
                  <Form.Control
                    value={interviewFromInterview?.title}
                    disabled={true}
                  />
                ) : (
                  <Form.Select
                    aria-label="Default select example"
                    onChange={handleInterviewChange}
                    name="interviewId"
                    required
                  >
                    <option value="">Select a Interview Info </option>
                    {listInterview.map((item) => (
                      <option key={item.interviewId} value={item.interviewId}>
                        {item.title}
                      </option>
                    ))}
                  </Form.Select>
                )}
                {errors.interviewId && (
                  <div className="text-red-600">{errors.interviewId}</div>
                )}
              </Form.Group>
              <Row className="mb-3">
                <Form.Label className="fw-semibold">Contract Period</Form.Label>
                <Col>
                  <Form.Label className="fw-semibold">Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startContract"
                    value={formData.startContract}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.startContract}
                  />
                  {errors.startContract && (
                    <div className="text-red-600">{errors.startContract}</div>
                  )}
                </Col>
                <Col>
                  <Form.Label className="fw-semibold">End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endContract"
                    value={formData.endContract}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.endContract}
                  />
                  {errors.endContract && (
                    <div className="text-red-600">{errors.endContract}</div>
                  )}
                </Col>
              </Row>
              <Form.Label className="fw-semibold">Interview Note:</Form.Label>
              {interviewFromInterview !== null ? (
                <Form.Control
                  value={interviewFromInterview?.note}
                  disabled={true}
                />
              ) : (
                <Form.Control value={selectedInterview?.note} />
              )}
            </Col>
            <Col className="mb-2" lg="6">
              <Form.Group className="mb-3" controlId="addJobForm.ControlInput1">
                <Form.Label className="fw-semibold">Contract Type</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  name="contractType"
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a Contract Type</option>
                  {listContract.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Form.Select>
                {errors.contractType && (
                  <div className="text-red-600">{errors.contractType}</div>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="addJobForm.ControlInput1">
                <Form.Label className="fw-semibold">Level</Form.Label>
                {interviewFromInterview !== null ? (
                  <Form.Select
                    aria-label="Default select example"
                    name="level"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a Level</option>
                    {interviewFromInterview?.job?.levels.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </Form.Select>
                ) : (
                  <Form.Select
                    aria-label="Default select example"
                    name="level"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a Level</option>
                    {listLevel.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </Form.Select>
                )}
                {errors.level && (
                  <div className="text-red-600">{errors.level}</div>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="addJobForm.ControlInput1">
                <Form.Label className="fw-semibold">Department: </Form.Label>
                {interviewFromInterview !== null ? (
                  <Form.Control
                    value={interviewFromInterview?.job?.department}
                    disabled={true}
                  />
                ) : (
                  <p>{selectedInterview?.job?.department}</p>
                )}
                {errors.department && (
                  <div className="text-red-600">{errors.department}</div>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="addJobForm.ControlInput1">
                <Form.Label className="fw-semibold">Recuiter Owner: </Form.Label>
                {interviewFromInterview !== null ? (
                  <Form.Control
                    value={interviewFromInterview?.recruit?.fullName}
                    disabled={true}
                  />
                ) : (
                  <p>{selectedInterview?.recruit?.fullName}</p>
                )}
                {errors.recruiterId && (
                  <div className="text-red-600">{errors.interviewId}</div>
                )}
              </Form.Group>
              <Form.Label className="fw-semibold">Due Date</Form.Label>
              <Form.Control
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                isInvalid={!!errors.dueDate}
              />
              {errors.dueDate && (
                <div className="text-red-600">{errors.dueDate}</div>
              )}

              <Form.Label className="fw-semibold">Basic Salary</Form.Label>
              <Form.Control
                type="text"
                name="basicSalary"
                value={displayValue}
                onChange={handleChange}
                required
                isInvalid={!!errors.basicSalary}
              />
              {errors.basicSalary && (
                <div className="text-red-600">{errors.basicSalary}</div>
              )}

              <Form.Label className="fw-semibold">Note</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Decription here"
                rows="3"
                name="note"
                value={formData.note}
                onChange={handleChange}
                required
              />
            </Col>
            <Col></Col>
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
            Add New Offer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Table */}

      <div className="shadow-sm px-2 py-2 rounded-xl bg-white">
        {roleId === "1" || roleId === "2" || roleId === "3" ? (
          <>
            <table className="table table-striped ">
              <thead className="table-dark">
                <tr>
                  <th scope="col span-2">Candidate Name</th>
                  <th scope="col">Emails</th>
                  <th scope="col">Approver</th>
                  <th scope="col">Department</th>
                  <th scope="col">Notes</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody className="fs-8">
                {listOffer &&
                  listOffer.map((item) => (
                    <>
                      <tr key={item.offerId}>
                        <td scope="row">{item.candidate.fullName}</td>
                        <td>{item.candidate.email}</td>
                        <td>{item.approver.fullName}</td>
                        <td>{item.department}</td>
                        <td>{item.note}</td>
                        <td>{item.status}</td>
                        <td>
                          <i
                            onClick={() => {
                              setSelectedItem(item);
                              setFormData(item);
                              
                              handleShowDetail();
                              setStatus(item.status);
                              setListInterviewer(item.interview.interviewers);
                              setDisplayValue(numeral(item.basicSalary).format('0,0'));
                              
                            }}
                            className="bi bi-eye p-1"
                          ></i>
                        </td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <h3 className="text-center">Interviewer cannot see offers</h3>
          </>
        )}
        <Row>
          <Col></Col>

          <Col xs="auto" className="d-flex align-items-center">
            <Pagination>
              {currentPage > 1 && (
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                />
              )}
              {Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => startPage + i
              ).map((page) => (
                <Pagination.Item
                  key={page}
                  active={page === currentPage}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Pagination.Item>
              ))}
              {currentPage < totalPages && (
                <Pagination.Next
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              )}
            </Pagination>
          </Col>
        </Row>
      </div>

      {/* Modal details offer */}

      <Modal show={showDetailModal} onHide={handleCloseDetail} size="xl">
        <Modal.Header  >

          <div className=" flex justify-between w-100">
            <div className="">
              <Modal.Title>Detail Offer</Modal.Title>
            </div>
            <div className="flex gap-3 ">
              {shouldShowButtonWFA && (
                <>
                  <Button
                    variant="warning"
                    onClick={() => {
                      setStatus("APPROVED");
                      handleShowNote();
                    }}

                  >
                    Approve Offer
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() => {
                      setStatus("REJECTED");
                      handleShowNote();
                    }}
                  >
                    Reject Offer
                  </Button>
                  {/* <Button variant="warning" onClick={() => {
                  setStatus("CANCELLED");
                  handleShowNote();
                }}>
                  Cancel Offer
                </Button> */}
                </>
              )}

              {roleId == "3" && selectedItem.status === "WAITING_FOR_APPROVAL" && (
                <>
                  <Button
                    variant="warning"
                    onClick={() => {
                      setStatus("CANCELLED");
                      handleShowNote();
                    }}
                  >
                    Cancel Offer
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() => {
                      sendMailToManager();
                    }}
                  >
                    Send mail reminder to Manager
                  </Button>
                </>
              )}

              {/* APPROVED */}
              {shouldShowButtonApproved && (
                <>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setStatus("WAITING_FOR_RESPONSE");
                      sendMailReminderCandidate();
                    }}
                  >
                    Reminder Candidate
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() => {
                      setStatus("CANCELLED");
                      handleShowNote();
                    }}
                  >
                    Cancel Offer
                  </Button>
                </>
              )}

              {/* WAITING_FOR_RESPONSE */}
              {shouldShowButtonWFR && (
                <>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setStatus("ACCEPTED_OFFER");
                      handleShowNote();
                    }}
                  >
                    Accept Offer
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() => {
                      setStatus("DECLINED_OFFER");
                      handleShowNote();
                    }}
                  >
                    Declined Offer
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() => {
                      setStatus("CANCELLED");
                      handleShowNote();
                    }}
                  >
                    Cancel Offer
                  </Button>
                </>
              )}
              {/* Accepted */}
              {shouldShowButtonAccept && (
                <>
                  <Button
                    variant="warning"
                    onClick={() => {
                      setStatus("CANCELLED");
                      handleShowNote();
                    }}
                  >
                    Cancel Offer
                  </Button>
                </>
              )}
            </div>
          </div>

        </Modal.Header>
        <Modal.Body>

          {selectedItem != undefined && (
            <>
              <Row>
                <Col className="mb-2" lg="6">
                  <Form.Group
                    className="mb-3"
                    controlId="addJobForm.ControlInput1"
                  >
                    <Form.Label className="fw-semibold">
                      Candidate Name:{" "}
                    </Form.Label>{" "}
                    {selectedItem.candidate?.fullName}
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="addJobForm.ControlInput1"
                  >
                    <Form.Label className="fw-semibold">Position: </Form.Label>{" "}
                    {selectedItem.position}
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="addJobForm.ControlInput1"
                  >
                    <Form.Label className="fw-semibold">Approver: </Form.Label>{" "}
                    {selectedItem.approver?.fullName}
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="addJobForm.ControlInput1"
                  >
                    <Row className="mb-3">
                      <Form.Label className="fw-semibold">
                        {" "}
                        Contact Period
                      </Form.Label>
                      <Col>
                        <Form.Label className="fw-semibold">From: </Form.Label>{" "}
                        {selectedItem.startContract}
                      </Col>
                      <Col>
                        <Col>
                          <Form.Label className="fw-semibold">To: </Form.Label>{" "}
                          {selectedItem.endContract}
                        </Col>
                      </Col>
                    </Row>

                    <Form.Group
                      className="mb-3"
                      controlId="addJobForm.ControlInput1"
                    >
                      <Form.Label className="fw-semibold">
                        Interview Notes:{" "}
                      </Form.Label>{" "}
                      {selectedItem.interview?.note}
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="addJobForm.ControlInput1"
                    >
                      <Form.Label className="fw-semibold">
                        Interviewer:{" "}
                      </Form.Label>{" "}
                      {listInterviewer &&
                        listInterviewer.map((item, index) => (
                          <span className="p-1" key={item.userId}>
                            {item.fullName}
                            {index < listInterviewer.length - 1 ? ", " : ""}
                          </span>
                        ))}
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="addJobForm.ControlInput1"
                    >
                      <Form.Label className="fw-semibold">
                        File Interview Notes:{" "}
                      </Form.Label>{" "}
                      {selectedItem.interview?.fileNote === null ? (
                        "N/A"
                      ) : (
                        <a className="underline text-blue-500" href={selectedItem.interview?.fileNote || "N/A"}>
                          View file note
                        </a>
                      )}
                    </Form.Group>
                  </Form.Group>
                </Col>
                <Col className="mb-2" lg="6">
                  <Form.Group
                    className="mb-3"
                    controlId="addJobForm.ControlInput1"
                  >
                    <Form.Label className="fw-semibold">
                      Contract Type:{" "}
                    </Form.Label>{" "}
                    {selectedItem.contractType}
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="addJobForm.ControlInput1"
                  >
                    <Form.Label className="fw-semibold">Level: </Form.Label>{" "}
                    {selectedItem.level}
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="addJobForm.ControlInput1"
                  >
                    <Form.Label className="fw-semibold">
                      Department:{" "}
                    </Form.Label>{" "}
                    {selectedItem.department}
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="addJobForm.ControlInput1"
                  >
                    <Form.Label className="fw-semibold">
                      Recuiter Owner:{" "}
                    </Form.Label>{" "}
                    {selectedItem.recruiter?.fullName}
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="addJobForm.ControlInput1"
                  >
                    <Form.Label className="fw-semibold">Due Date: </Form.Label>{" "}
                    {selectedItem.dueDate}
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="addJobForm.ControlInput1"
                  >
                    <Form.Label className="fw-semibold">
                      {" "}
                      Basic Salary:{" "}
                    </Form.Label>{" "}
                    {formatMoney(selectedItem.basicSalary)}
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="addJobForm.ControlInput1"
                  >
                    <Form.Label className="fw-semibold">Note: </Form.Label>{" "}
                    {selectedItem.note}
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="addJobForm.ControlInput1"
                  >
                    <Form.Label className="fw-semibold">Status: </Form.Label>{" "}
                    {selectedItem.status}
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetail}>
            Close
          </Button>

          {/* WAITING_FOR_APPROVAL */}
          {shouldShowEditButton && (
            <Button
              variant="primary"
              onClick={() => {
                setFormData(selectedItem);
                handleShowEdit();
                getLevelByJob(selectedItem?.interview?.interviewId);
              }}
            >
              Edit Offer
            </Button>
          )}



        </Modal.Footer>
      </Modal>

      {/* Modal edit Offer */}
      <Modal show={showEditlModal} onHide={handleCloseEdit} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Edit Offer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col className="mb-2" lg="6">
              <Form.Group className="mb-3" controlId="addJobForm.ControlInput1">
                <Form.Label className="fw-semibold">
                  Select Candidate: {selectedItem?.candidate?.fullName}
                </Form.Label>
              </Form.Group>
              <Form.Group className="mb-2" controlId="addJobForm.ControlInput1">
                <Form.Label className="fw-semibold">
                  Select Position: {selectedItem?.position}
                </Form.Label>
              </Form.Group>
              <Form.Group className="mb-3" controlId="addJobForm.ControlInput1">
                <Form.Label className="fw-semibold">
                  Select Approver:{" "}
                </Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={handleChange}
                  name="approverId"
                  // value={selectedItem?.approver?.userId || ""}
                >
                  <option value={selectedItem?.approver?.userId}>{selectedItem?.approver?.fullName}</option>
                  {listManager.map((item) => (
                    <option key={item.userId} value={item.userId}>
                      {item.fullName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="addJobForm.ControlInput1">
                <Form.Label className="fw-semibold">Interview Info</Form.Label>
                {/* <Form.Control
                  value={selectedItem?.interview?.title}
                  disabled={true}
                /> */}
                <Form.Select
                  aria-label="Default select example"
                  onChange={handleInterviewChange}
                  name="interviewId"
                  required
                  defaultValue={selectedItem?.interview?.title}
                >
                  <option>{selectedItem?.interview?.title}</option>
                  {listInterview.map((item) => (
                    <option key={item.interviewId} value={item.interviewId}>
                      {item.title}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Row className="mb-3">
                <Form.Label className="fw-semibold">Contract Period</Form.Label>
                <Col>
                  <Form.Label className="fw-semibold">Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startContract"
                    value={parseDate(formData.startContract)}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.startContract}
                  />
                  {errors.startContract && (
                    <div className="text-red-600">{errors.startContract}</div>
                  )}
                </Col>
                <Col>
                  <Form.Label className="fw-semibold">End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endContract"
                    value={parseDate(formData.endContract)}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.endContract}
                  />
                  {errors.endContract && (
                    <div className="text-red-600">{errors.endContract}</div>
                  )}
                </Col>
              </Row>
              <Form.Label className="fw-semibold">
                Interview Note: {selectedItem?.interview?.note}
              </Form.Label>
              <Form.Group className="mb-3" controlId="addJobForm.ControlInput1">
                <Form.Label className="fw-semibold">Status: </Form.Label>
                {selectedItem.status}
              </Form.Group>
            </Col>
            <Col className="mb-2" lg="6">
              <Form.Group className="mb-3" controlId="addJobForm.ControlInput1">
                <Form.Label className="fw-semibold">Contract Type</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  name="contractType"
                  onChange={handleChange}
                  required
                  defaultValue={selectedItem?.contractType}
                >

                  {listContract.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="addJobForm.ControlInput1">
                <Form.Label className="fw-semibold">Level</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  name="level"
                  onChange={handleChange}
                  required
                  defaultValue={selectedItem?.level}
                >

                  {levelByJob?.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="addJobForm.ControlInput1">
                <Form.Label className="fw-semibold">Department</Form.Label>
                <Form.Control
                  value={selectedInterview?.job?.department || selectedItem?.department}
                  disabled={true}
                />
                {/* <Form.Select
                  aria-label="Default select example"
                  name="department"
                  onChange={handleChange}
                  required
                >
                  <option value={selectedItem?.department}>
                    {selectedItem?.department}
                  </option>
                  {listDepartment.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Form.Select> */}
              </Form.Group>
              <Form.Group className="mb-3" controlId="addJobForm.ControlInput1">
                <Form.Label className="fw-semibold">Recuiter Owner</Form.Label>
                <Form.Control
                  value={selectedInterview?.recruit?.fullName || selectedItem?.recruiter?.fullName}
                  disabled={true}
                />
                {/* <Form.Select
                  aria-label="Default select example"
                  onChange={handleChange}
                  name="recruiterId"
                  required
                >
                  <option value={selectedItem?.recruiter?.recruiterId}>
                    {selectedItem?.recruiter?.fullName}
                  </option>
                  {listRecuiter.map((item) => (
                    <option key={item.userId} value={item.userId}>
                      {item.fullName}
                    </option>
                  ))}
                </Form.Select> */}
              </Form.Group>
              <Form.Label className="fw-semibold">Due Date</Form.Label>
              <Form.Control
                type="date"
                name="dueDate"
                value={parseDate(formData.dueDate)}
                onChange={handleChange}
                required
                isInvalid={!!errors.dueDate}
              />
              {errors.dueDate && (
                <div className="text-red-600">{errors.dueDate}</div>
              )}

              <Form.Label className="fw-semibold">Basic Salary</Form.Label>
              <Form.Control
                type="text"
                name="basicSalary"
                value={displayValue}
                onChange={handleChange}
                required
                isInvalid={!!errors.basicSalary}
              />
              {errors.basicSalary && (
                <div className="text-red-600">{errors.basicSalary}</div>
              )}

              <Form.Label className="fw-semibold">Note</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Decription here"
                rows="3"
                name="note"
                value={formData.note}
                onChange={handleChange}
                required
              />
            </Col>
            <Col></Col>
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
            Edit Offer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal note offer */}
      <Modal show={showNotelModal} onHide={handleCloseNote}>
        <Modal.Header closeButton>
          <Modal.Title>Note Offer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Note Offer:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Note...."
                onChange={handleChangeNote}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseNote}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleChangeStatusOffer();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Offer;
