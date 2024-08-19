import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/styles/style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import Home from "./pages/Home";
import Candidate from "./pages/Candidate";
import Job from "./pages/Job";
import Interview from "./pages/Interview";
import Offer from "./pages/Offer";
import User from "./pages/User";
import SignIn from "./pages/SignIn";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function App() {
    const [userDetailLogin, setUserDetailLogin] = React.useState({});
    const location = useLocation();

    const token = localStorage.getItem("token");

    const setAllFieldsToNull = () => {
        localStorage.setItem("token", "null");
        localStorage.setItem("userId", 0);
        localStorage.setItem("roleId", 0);
        localStorage.setItem("fullName", "null");
    };

    const isLoggedIn = token && token !== "null";

    if (!isLoggedIn) {
        setAllFieldsToNull();
    }

    const shouldHideHeaderAndSidebar = location.pathname === "/login";

    const handleLogout = () => {
        setAllFieldsToNull();
        window.location.href = "/login";
    };

    return (
        <>
            <Helmet>
                <title>Interview Management</title>
            </Helmet>
            {!shouldHideHeaderAndSidebar && (
                <div>
                    <Header
                        handleLogout={handleLogout}
                        userDetailLogin={userDetailLogin}
                    />
                </div>
            )}

            <div
                className={
                    shouldHideHeaderAndSidebar ? "" : "flex justify-start"
                }
            >
                {!shouldHideHeaderAndSidebar && (
                    <div className="w-[20%]">
                        <Sidebar />
                    </div>
                )}

                <div
                    className={
                        shouldHideHeaderAndSidebar ? "" : "w-[85%] mr-[30px]"
                    }
                >
                    <Routes>
                        <Route
                            path="/login"
                            element={
                                <SignIn
                                    setUserDetailLogin={setUserDetailLogin}
                                />
                            }
                        />
                        <Route
                            path="/home"
                            element={
                                isLoggedIn ? <Home /> : <Navigate to="/login" />
                            }
                        />
                        <Route
                            path="/candidate"
                            element={
                                isLoggedIn ? (
                                    <Candidate />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/job"
                            element={
                                isLoggedIn ? <Job /> : <Navigate to="/login" />
                            }
                        />
                        <Route
                            path="/interview"
                            element={
                                isLoggedIn ? (
                                    <Interview />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/offer"
                            element={
                                isLoggedIn ? (
                                    <Offer />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/user"
                            element={
                                isLoggedIn ? <User /> : <Navigate to="/login" />
                            }
                        />
                        <Route
                            path="*"
                            element={
                                isLoggedIn ? (
                                    <Navigate to="/home" />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                    </Routes>
                </div>
            </div>
        </>
    );
}

export default App;
