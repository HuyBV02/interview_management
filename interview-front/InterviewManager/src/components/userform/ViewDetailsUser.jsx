import React from "react";
import { Row, Col, Form, InputGroup, Button, Modal } from "react-bootstrap";

const ViewDetailUser = ({ selectedUser }) => {
  return (
    <div>
      <Row>
        <Col lg={6}>
          <p>
            <strong>Full Name:</strong> {selectedUser.fullName}
          </p>
          <p>
            <strong>D.O.B:</strong> {selectedUser.dob}
            value={formatDateForInput(users.dob)}
          </p>
          <p>
            <strong>Phone Number:</strong> {selectedUser.phone}
          </p>
          <p>
            <strong>Role:</strong> {selectedUser.role?.roleName}
          </p>
          <p>
            <strong>Status:</strong> {selectedUser.status}
          </p>
          <p>
            <strong>Skills:</strong> {selectedUser.skills}
          </p>
        </Col>
        <Col lg={6}>
          <p>
            <strong>Email:</strong> {selectedUser.email}
          </p>
          <p>
            <strong>Address:</strong> {selectedUser.address}
          </p>
          <p>
            <strong>Gender:</strong> {selectedUser.gender}
          </p>
          <p>
            <strong>Department:</strong> {selectedUser.department}
          </p>
          <p>
            <strong>Note:</strong> {selectedUser.note}
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default ViewDetailUser;
