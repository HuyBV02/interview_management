import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const notActiveStyle =
        "px-4 py-3 flex items-center space-x-4 rounded-md text-gray-500 group";
    const activeStyle =
        "relative px-4 py-3 flex items-center space-x-4 rounded-lg text-white bg-gradient-to-r from-sky-600 to-cyan-400";
    return (
        <div
            id="sidebar"
            className="lg:block hidden bg-white w-64 h-screen fixed rounded-none border-none"
        >
            <div className="p-4 space-y-4">
                <NavLink
                    to="/home"
                    aria-label="home"
                    className={({ isActive }) =>
                        isActive ? activeStyle : notActiveStyle
                    }
                >
                    <i className="fas fa-home"></i>
                    <span className="-mr-1 font-medium">Home</span>
                </NavLink>
                <NavLink
                    to="/candidate"
                    className={({ isActive }) =>
                        isActive ? activeStyle : notActiveStyle
                    }
                >
                    <i className="fa-solid fa-people-group"></i>
                    <span>Candidate</span>
                </NavLink>
                <NavLink
                    to="/job"
                    className={({ isActive }) =>
                        isActive ? activeStyle : notActiveStyle
                    }
                >
                    <i className="fas fa-store"></i>
                    <span>Job</span>
                </NavLink>
                <NavLink
                    to="/interview"
                    className={({ isActive }) =>
                        isActive ? activeStyle : notActiveStyle
                    }
                >
                    <i className="fa-solid fa-people-arrows"></i>
                    <span>Interview</span>
                </NavLink>
                <NavLink
                    to="/offer"
                    className={({ isActive }) =>
                        isActive ? activeStyle : notActiveStyle
                    }
                >
                    <i className="fa-solid fa-envelope-open-text"></i>
                    <span>Offer</span>
                </NavLink>
                <NavLink
                    to="/user"
                    className={({ isActive }) =>
                        isActive ? activeStyle : notActiveStyle
                    }
                >
                    <i className="fas fa-user"></i>
                    <span>User</span>
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;
