// JobDescription.js
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Modal from "./Modal";

const JobDescription = () => {
    const location = useLocation();
    const { data } = location.state || {};
    const [showModal, setShowModal] = useState(false);

    const formatMoney = (amount) => {
        return amount.toLocaleString("en-US");
    };

    return (
        <div className="container w-[70%] mx-auto py-8">
            <div className="p-4 border rounded shadow-md">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-bold">{data?.title}</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded"
                    >
                        Apply Now
                    </button>
                </div>
                <div>
                    <div className="flex items-center text-yellow-500">
                        {data.skills?.map((tag, index) => (
                            <span
                                key={index}
                                className="bg-gray-200 rounded-full px-2 py-1 text-sm"
                            >
                                {tag}
                            </span>
                        ))}
                        {data.levels.map((level, index) => (
                            <span
                                key={index}
                                className="bg-gray-200 rounded-full px-2 py-1 text-sm"
                            >
                                {level}
                            </span>
                        ))}
                    </div>
                    <div className="mt-2 text-gray-600">
                        <p>
                            From: {data?.startDate} to: {data?.endDate}
                        </p>
                        <p>{data.workingAddress}</p>
                    </div>
                </div>

                <div className="mt-4">
                    <strong>
                        Salary: {formatMoney(data?.salaryFrom)} VND -{" "}
                        {formatMoney(data?.salaryTo) + " VND"}
                    </strong>
                </div>

                <div className="mt-4">
                    <h2 className="text-xl font-bold">Job's description</h2>
                    <p>{data.description}</p>

                    <h3 className="font-semibold mt-5">Benefit</h3>
                    <ul className="list-disc list-inside">
                        {data.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <Modal
                showModal={showModal}
                setShowModal={setShowModal}
                data={data}
            />
        </div>
    );
};

export default JobDescription;
