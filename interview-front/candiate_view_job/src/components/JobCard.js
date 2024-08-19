import React from "react";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
    const navigate = useNavigate();

    const handleView = (job) => {
        navigate(`/job/${job.jobId}`, { state: { data: job } });
    };

    const formatMoney = (amount) => {
        return amount.toLocaleString("en-US");
    };

    return (
        <div className="border rounded-lg p-4 mb-4 shadow-md">
            <div className="flex justify-between">
                <h3 className="font-bold text-lg">{job?.title}</h3>
                <span className="text-blue-600">
                    {formatMoney(job.salaryFrom) + " - " + formatMoney(job.salaryTo)}
                </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
                {job.skills?.map((tag, index) => (
                    <span
                        key={index}
                        className="bg-gray-200 rounded-full px-2 py-1 text-sm"
                    >
                        {tag}
                    </span>
                ))}
                {job.levels.map((level, index) => (
                    <span
                        key={index}
                        className="bg-gray-200 rounded-full px-2 py-1 text-sm"
                    >
                        {level}
                    </span>
                ))}
            </div>
            <div className="mt-4 ">
                <p className="text-blue-600">{job.workingAddress}</p>
            </div>
            <div className="flex justify-between">
                <div className="mt-2 text-gray-500">{job.startDate}</div>
                <div className="mt-2 flex flex-col items-center md:flex-row cursor-pointer hover:text-blue-500">
                    <a
                        onClick={() => handleView(job)}
                        aria-label=""
                        className="group inline-flex items-center font-semibold text-g1"
                    >
                        View more
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml-4 h-6 w-6 transition-transform group-hover:translate-x-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            ></path>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default JobCard;
