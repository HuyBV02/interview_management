import React from "react";
import { Row, Col } from "react-bootstrap";

const ViewDetailCandidate = ({ selectedCandidate }) => {
    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <Row>
                <Col lg={6} className="p-4">
                    <p className="mb-3">
                        <strong className="inline-block w-40">Full Name:</strong> {selectedCandidate.fullName}
                    </p>
                    <p className="mb-3">
                        <strong className="inline-block w-40">D.O.B:</strong> {selectedCandidate.dob}
                    </p>
                    <p className="mb-3">
                        <strong className="inline-block w-40">Phone Number:</strong> {selectedCandidate.phoneNumber}
                    </p>
                    <p className="mb-3">
                        <strong className="inline-block w-40">CV Attachment:</strong> <a href={selectedCandidate.cv} className="text-blue-500">Download CV</a>
                    </p>
                    <p className="mb-3">
                        <strong className="inline-block w-40">Position:</strong> {selectedCandidate.position}
                    </p>
                    <p className="mb-3">
                        <strong className="inline-block w-40">Skills:</strong> {selectedCandidate.skills?.join(", ")}
                    </p>
                    <p className="mb-3">
                        <strong className="inline-block w-40">Recruiter:</strong> {selectedCandidate.recruiter?.fullName}
                    </p>
                </Col>
                <Col lg={6} className="p-4">
                    <p className="mb-3">
                        <strong className="inline-block w-40">Email:</strong> {selectedCandidate.email}
                    </p>
                    <p className="mb-3">
                        <strong className="inline-block w-40">Address:</strong> {selectedCandidate.address}
                    </p>
                    <p className="mb-3">
                        <strong className="inline-block w-40">Gender:</strong> {selectedCandidate.gender}
                    </p>
                    <p className="mb-3">
                        <strong className="inline-block w-40">Note:</strong> {selectedCandidate.note}
                    </p>
                    <p className="mb-3">
                        <strong className="inline-block w-40">Year of Experience:</strong> {selectedCandidate.yearOfExp}
                    </p>
                    <p className="mb-3">
                        <strong className="inline-block w-40">Highest Level:</strong> {selectedCandidate.highestLevel}
                    </p>
                    <p className="mb-3">
                        <strong className="inline-block w-40">Status:</strong> {selectedCandidate.status}
                    </p>
                </Col>
            </Row>
        </div>
    );
};

export default ViewDetailCandidate;
