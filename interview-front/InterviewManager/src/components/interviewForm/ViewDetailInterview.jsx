import React from "react";
import { Row, Col } from "react-bootstrap";

const ViewDetailInterview = ({ interviewData }) => {
    return (
        <div className="p-6">
            {interviewData && (
                <div>
                    <Row>
                        <Col lg={6} className="p-4">
                            <p className="mb-3">
                                <strong className="inline-block w-40">
                                    Schedule title:
                                </strong>{" "}
                                {interviewData.title}
                            </p>
                            <p className="mb-3">
                                <strong className="inline-block w-40">
                                    Candidate name:
                                </strong>{" "}
                                {interviewData.candidate?.fullName}
                            </p>
                            <p className="mb-3">
                                <strong className="inline-block w-40">
                                    Schedule Time:
                                </strong>{" "}
                                {"Start"}: {interviewData.startTime} <br />{" "}
                                &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;&ensp;&ensp;
                                {"End: "} {interviewData.endTime}
                            </p>
                            <p className="mb-3">
                                <strong className="inline-block w-40">
                                    Notes:
                                </strong>{" "}
                                {interviewData.note || "N/A"}
                            </p>
                        </Col>
                        <Col lg={6} className="p-4">
                            <p className="mb-3">
                                <strong className="inline-block w-40">
                                    Job:
                                </strong>{" "}
                                {interviewData.job.title}
                            </p>
                            <p className="mb-3">
                                <strong className="inline-block w-40">
                                    Interviewer:
                                </strong>{" "}
                                {interviewData.interviewers
                                    .map((int) => int.fullName)
                                    .join(", ")}
                            </p>
                            <p className="mb-3">
                                <strong className="inline-block w-40">
                                    Location:
                                </strong>{" "}
                                {interviewData.location}
                            </p>
                            <p className="mb-3">
                                <strong className="inline-block w-40">
                                    Recruiter owner:
                                </strong>{" "}
                                {interviewData.recruit?.fullName}
                            </p>
                            <p className="mb-3">
                                <strong className="inline-block w-40">
                                    Meeting ID:
                                </strong>{" "}
                                <a
                                    href={interviewData.meetingId}
                                    className="text-blue-500"
                                >
                                    {interviewData.meetingId}
                                </a>
                            </p>
                            <p className="mb-3">
                                <strong className="inline-block w-40">
                                    Result:
                                </strong>{" "}
                                {interviewData.result || "N/A"}
                            </p>
                            <p className="mb-3">
                                <strong className="inline-block w-40">
                                    Status:
                                </strong>{" "}
                                {interviewData.status}
                            </p>
                        </Col>
                    </Row>
                </div>
            )}
        </div>
    );
};

export default ViewDetailInterview;
