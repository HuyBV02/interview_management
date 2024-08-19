import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import axios from "axios";
import JobDescription from "./components/JobDescription";
import Footer from "./components/Footer";

function App() {
  const [jobList, setJobList] = React.useState([]);

  const getJobList = async () => {
    await axios
      .get("http://localhost:8082/api/public/job/list/open")
      .then((response) => {
        setJobList(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  console.log(jobList);

  React.useEffect(() => {
    getJobList();
  }, []);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route exact path="/" element={<HomePage jobList={jobList} />} />
        <Route exact path="/job/:id" element={<JobDescription />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
