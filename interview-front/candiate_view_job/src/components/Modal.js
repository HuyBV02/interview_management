import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Select from "react-select";
import axios from "axios";
import Alert from "./Alert";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "800px",
    maxHeight: "90vh",
    overflowY: "auto",
  },
};

Modal.setAppElement("#root");

const CandidateModal = ({ showModal, setShowModal, data }) => {
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [highestLevelOptions, setHighestLevelOptions] = useState([]);
  const [positionOptions, setPositionOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [jobOptions, setJobOptions] = useState([]);
  const [recruiters, setRecruiters] = useState([]);

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
    position: "",
    skills: [],
    jobs: [
      {
        jobId: data.jobId,
        cv: "",
      },
    ],
    recruiterId: 1,
  });

  // Alert
  const [alert, setAlert] = useState(null);

  const handleAlertClose = () => {
    setAlert(null);
  };

  /////////

  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("token");
  const fetchOptions = async (endpoint, setState) => {
    try {
      const response = await axios.get(`http://localhost:8082/${endpoint}`);
      setState(response.data.data);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    }
  };

  useEffect(() => {
    fetchOptions("api/public/user/list/3/tempt", setRecruiters);
    fetchOptions("api/attributes/skill", setSkillsOptions);
    fetchOptions("api/attributes/gender", setGenderOptions);
    fetchOptions("api/attributes/highest_level", setHighestLevelOptions);
    fetchOptions("api/attributes/position", setPositionOptions);
  }, []);

  const createSelectOptions = (options) => {
    return options?.map((option) => ({ value: option, label: option }));
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const validateField = (name, value) => {
    let error = "";
    if (name === "email") {
      if (!value) {
        error = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = "Email is invalid";
      }
    } else if (name === "fullName" && !value) {
      error = "Full Name is required";
    } else if (name === "phoneNumber" && !value) {
      error = "Phone Number is required";
    } else if (name === "gender" && !value) {
      error = "Gender is required";
    } else if (name === "position" && !value) {
      error = "Position is required";
    } else if (name === "skills" && value.length === 0) {
      error = "At least one skill is required";
    } else if (name === "highestLevel" && !value) {
      error = "Highest Level is required";
    } else if (name === "dob") {
      const today = new Date();
      const dob = new Date(value);
      if (!value) {
        error = "Date of Birth is required";
      } else if (dob >= today) {
        error = "Date of Birth must be in the past";
      }
    } else if (name === "yearOfExp") {
      if (!value) {
        error = "Years of Experience is required";
      } else if (isNaN(value) || value < 1) {
        error = "Years of Experience must be at least 1";
      }
    }
    return error;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCandidate((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    const error = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleChangeDob = (e) => {
    const { value } = e.target;
    setCandidate((prevState) => ({
      ...prevState,
      dob: value,
    }));
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    const value = selectedOption ? selectedOption.value : "";
    setCandidate((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    const error = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleMultiSelectChange = (selectedOptions, actionMeta) => {
    const { name } = actionMeta;
    const value = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setCandidate((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    const error = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleFileChange = async (e) => {
    const { files } = e.target;
    const file = files[0];

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:8082/api/public/candidate/upload",
        formData
      );

      const cvResponse = response.data.data;

      setCandidate((prevState) => {
        const updatedJobs = prevState.jobs.map((job) =>
          job.jobId === data.jobId ? { ...job, cv: cvResponse } : job
        );

        return {
          ...prevState,
          jobs: updatedJobs,
        };
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const validate = () => {
    const newErrors = {};

    Object.keys(candidate).forEach((key) => {
      const error = validateField(key, candidate[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();

    const dataApply = {
      fullName: candidate.fullName,
      dob: formatDate(candidate.dob),
      phoneNumber: candidate.phoneNumber,
      email: candidate.email,
      address: candidate.address,
      gender: candidate.gender,
      note: candidate.note,
      yearOfExp: candidate.yearOfExp,
      highestLevel: candidate.highestLevel,
      position: candidate.position,
      skills: candidate.skills,
      jobs: candidate.jobs,
      recruiterId: 1,
    };
    if (!validate()) {
      return;
    }
    if (validate()) {
      try {
        const response = await axios.post(
          "http://localhost:8082/api/public/candidate",
          dataApply
        );

        setShowModal(false);
        setAlert({
          type: "success",
          title: "SUCCESS",
          message: "Apply this job successfully",
        });
        setTimeout(() => {
          setAlert(null);
        }, 2000);
      } catch (error) {
        console.error("There was an error adding the candidate!", error);
        if (error.response.data.code === 400) {
          setAlert({
            type: "error",
            title: "FAILED",
            message: "Email already exists",
          });
          setTimeout(() => {
            setAlert(null);
          }, 2000);
        }
      }
    }
  };

  return (
    <>
      {alert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Alert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={handleAlertClose}
          />
        </div>
      )}
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        style={customStyles}
        contentLabel="Add New Candidate"
      >
        <div className="relative p-4">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-0 right-0 m-2 text-gray-500 hover:text-gray-700"
          >
            ✖
          </button>
          <h2 className="text-2xl font-bold mb-4">Apply Job</h2>
          <form onSubmit={handleAddCandidate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Full Name*</label>
                <input
                  type="text"
                  name="fullName"
                  className="border p-2 w-full"
                  value={candidate.fullName}
                  onChange={handleChange}
                />
                {errors.fullName && (
                  <span className="text-red-500">{errors.fullName}</span>
                )}
              </div>
              <div>
                <label>Email*</label>
                <input
                  type="email"
                  name="email"
                  className="border p-2 w-full"
                  value={candidate.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <span className="text-red-500">{errors.email}</span>
                )}
              </div>
              <div>
                <label>D.O.B</label>
                <input
                  type="date"
                  name="dob"
                  className="border p-2 w-full"
                  value={candidate.dob}
                  onChange={handleChangeDob}
                />{" "}
                {errors.dob && (
                  <span className="text-red-500">{errors.dob}</span>
                )}
              </div>
              <div>
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  className="border p-2 w-full"
                  value={candidate.address}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Phone Number*</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  className="border p-2 w-full"
                  value={candidate.phoneNumber}
                  onChange={handleChange}
                />
                {errors.phoneNumber && (
                  <span className="text-red-500">{errors.phoneNumber}</span>
                )}
              </div>
              <div>
                <label>Gender*</label>
                <Select
                  options={createSelectOptions(genderOptions)}
                  className="w-full"
                  name="gender"
                  value={genderOptions.find(
                    (option) => option.value === candidate.gender
                  )}
                  onChange={handleSelectChange}
                />
                {errors.gender && (
                  <span className="text-red-500">{errors.gender}</span>
                )}
              </div>
              <div>
                <label>Position*</label>
                <Select
                  options={createSelectOptions(positionOptions)}
                  className="w-full"
                  name="position"
                  value={positionOptions.find(
                    (option) => option.value === candidate.position
                  )}
                  onChange={handleSelectChange}
                />
                {errors.position && (
                  <span className="text-red-500">{errors.position}</span>
                )}
              </div>
              <div className="">
                <label>Skills*</label>
                <Select
                  options={createSelectOptions(skillsOptions)}
                  isMulti
                  className="w-full"
                  name="skills"
                  value={createSelectOptions(skillsOptions).filter((option) =>
                    candidate.skills.includes(option.value)
                  )}
                  onChange={handleMultiSelectChange}
                />
                {errors.skills && (
                  <span className="text-red-500">{errors.skills}</span>
                )}
              </div>
              <div>
                <label>Year of Experience</label>
                <input
                  type="number"
                  name="yearOfExp"
                  className="border p-2 w-full"
                  min="0"
                  value={candidate.yearOfExp}
                  onChange={handleChange}
                />
                {errors.yearOfExp && (
                  <span className="text-red-500">{errors.yearOfExp}</span>
                )}
              </div>
              <div>
                <label>Highest Level*</label>
                <Select
                  options={createSelectOptions(highestLevelOptions)}
                  className="w-full"
                  name="highestLevel"
                  value={highestLevelOptions.find(
                    (option) => option.value === candidate.highestLevel
                  )}
                  onChange={handleSelectChange}
                />
                {errors.highestLevel && (
                  <span className="text-red-500">{errors.highestLevel}</span>
                )}
              </div>
              <div className="">
                <label>Jobs</label>
                <input
                  type="text"
                  name="jobs"
                  value={data.title}
                  className="w-full"
                  readOnly
                />
              </div>
              <div className="">
                <label>Upload CV</label>
                <input
                  type="file"
                  className="border p-2 w-full"
                  onChange={handleFileChange}
                />
              </div>
              <div className="col-span-2">
                <label>Note</label>
                <textarea
                  name="note"
                  className="border p-2 w-full"
                  value={candidate.note}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
              <button
                type="submit"
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default CandidateModal;
