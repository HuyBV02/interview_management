import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { Modal } from "react-bootstrap";

const SignIn = ({ setUserDetailLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState();

  console.log(email);

  const handleSubmitMailReset = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8082/api/forgot-password", { email })
      .then((response) => {
        console.log(response);
        if (response.data.data === "SUCCESS") {
          setAlert({
            type: "info",
            title: "Send successed",
            message: "Sent mail for your e-mail ",
          });
          setTimeout(() => setAlert(null), 3000);
          setShowModal(false);
        }
      })
      .catch((error) => {
        setAlert({
          type: "error",
          title: "Sent failed",
          message: "Your mail cann't be found!",
        });
        setTimeout(() => setAlert(null), 3000);
        setShowModal(false);
      });
  };

  // Show modal
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!username) newErrors.username = "User name is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAlertClose = () => {
    setAlert(null);
  };

  const handleLogin = async () => {
    if (!validate()) return;

    await axios
      .post("http://localhost:8082/api/user/login", {
        username,
        password,
      })
      .then((response) => {
        // Store the token in the local storage
        setUserDetailLogin(response.data.data);
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("userId", response.data.data.userId);
        localStorage.setItem("fullName", response.data.data.fullName);
        localStorage.setItem("roleId", response.data.data.role.roleId);
        localStorage.setItem("username", response.data.data.username);
        setAlert({
          type: "success",
          title: "Login successful",
          message: "You have been logged in successfully.",
        });

        // Navigate to home after a delay to show the alert
        setTimeout(() => {
          navigate("/home");
          setAlert(null);
        }, 2000);
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        setAlert({
          type: "error",
          title: "Login failed",
          message: "Incorrect username or password.",
        });
        setTimeout(() => setAlert(null), 3000);
      });

    // Perform login logic here
    console.log("Logging in with", { username, password });
  };

  return (
    <>
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="card text-center">
            <div class="card-body px-5">
              <p class="card-text py-2">
                Enter your email address and we'll send you an email with
                instructions to reset your password.
              </p>
              <form
                data-mdb-input-init
                class="flex gap-3 justify-center items-center"
              >
                <label class="form-label flex" for="typeEmail">
                  Email<span className="text-red-500"> *</span>
                </label>
                <input
                  type="email"
                  id="typeEmail"
                  class="form-control my-3"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </form>
              <Button
                data-mdb-ripple-init
                class="btn btn-primary w-100"
                onClick={handleSubmitMailReset}
              >
                Reset password
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div className="font-[sans-serif] min-h-screen flex flex-col items-center justify-center py-6 px-4">
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
        <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full">
          <div className="border border-gray-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <div className="mb-8">
                <h3 className="text-gray-800 text-3xl font-extrabold">
                  Sign in
                </h3>
                <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                  Sign in to your account and explore a world of possibilities.
                  Your journey begins here.
                </p>
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  User name
                </label>
                <div className="relative flex items-center">
                  <input
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errors.username) {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          username: null,
                        }));
                      }
                    }}
                    className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                    placeholder="Enter user name"
                  />
                  <br />

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-[18px] h-[18px] absolute right-4"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="10" cy="7" r="6" />
                    <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" />
                  </svg>
                </div>

                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          password: null,
                        }));
                      }
                    }}
                    className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                    placeholder="Enter password"
                  />

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-[18px] h-[18px] absolute right-4 cursor-pointer"
                    viewBox="0 0 128 128"
                  >
                    <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" />
                  </svg>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center"></div>
                <div className="text-sm">
                  <a
                    href="javascript:void(0);"
                    className="text-[#22d3ee] hover:underline font-semibold"
                    onClick={handleShowModal}
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>
              <div className="!mt-8">
                <button
                  type="submit"
                  className="w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-[#22d3ee] hover:bg-[#22d3ee] focus:outline-none"
                >
                  Log in
                </button>
              </div>
            </form>
          </div>
          <div className="lg:h-[400px] md:h-[300px] max-md:mt-8">
            <img
              src="https://readymadeui.com/login-image.webp"
              className="w-full h-full max-md:w-4/5 mx-auto block object-cover"
              alt="Dining Experience"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
