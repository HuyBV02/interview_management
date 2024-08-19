import Image from "react-bootstrap/Image";
import LOGO from "../assets/images/LOGO.jpg";
import { NavLink } from "react-router-dom";

const notActiveStyle =
    "text-black text-sm flex items-center hover:text-[#007bff] hover:border-r-[5px] border-[#077bff] hover:bg-gray-100 px-8 py-4 transition-all";
const activeStyle =
    "text-sm flex items-center text-[#007bff] border-r-[5px] border-[#077bff] bg-gray-100 px-8 py-4 transition-all";

const Navbar = () => {
    return (
        <nav className="bg-white shadow-xl h-screen fixed top-0 left-0 min-w-[250px] py-6 font-[sans-serif] overflow-auto">
            <div className="relative flex flex-col h-full">
                <NavLink to="/home" className="text-center">
                    <img
                        src="https://readymadeui.com/readymadeui.svg"
                        alt="logo"
                        className="w-[160px] inline"
                    />
                </NavLink>

                <ul className="space-y-3 my-8 flex-1">
                    <li>
                        <NavLink
                            to="/home"
                            className={({ isActive }) =>
                                isActive ? activeStyle : notActiveStyle
                            }
                        >
                            <i className="bi bi-house navbar-icon-size mr-3"></i>
                            <span className="text-[16px]">Home</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/candidate"
                            className={({ isActive }) =>
                                isActive ? activeStyle : notActiveStyle
                            }
                        ><i className="bi bi-people navbar-icon-size mr-3"></i>
                            <span className="text-[16px]">Candidate</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/job"
                            className={({ isActive }) =>
                                isActive ? activeStyle : notActiveStyle
                            }
                        >
                            <i className="bi-suitcase-lg navbar-icon-size mr-3"></i>
                            <span className="text-[16px]">Job</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/interview"
                            className={({ isActive }) =>
                                isActive ? activeStyle : notActiveStyle
                            }
                        >
                           <i className="bi bi-chat navbar-icon-size mr-3"></i>
                            <span className="text-[16px]">Interview</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/offer"
                            className={({ isActive }) =>
                                isActive ? activeStyle : notActiveStyle
                            }
                        >
                            <i className="bi bi-file-earmark-text navbar-icon-size mr-3"></i>
                            <span className="text-[16px]">Offer</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/user"
                            className={({ isActive }) =>
                                isActive ? activeStyle : notActiveStyle
                            }
                        >
                            <i className="bi bi-person-circle navbar-icon-size mr-3"></i>
                            <span className="text-[16px]">User</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
