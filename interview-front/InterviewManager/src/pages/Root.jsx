import { Outlet } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Home from "./Home";
import Navbar from "../components/Navbar";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const Root = () => {
    return (
        <>
            <Container fluid className="flex-row text-center">
                <ToastContainer />
                <Row>
                    <Col lg="1">
                        <Navbar />
                    </Col>
                    <Col lg="11" className="p-5 bg-content-color">
                        <Home />
                        <Outlet></Outlet>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Root;
