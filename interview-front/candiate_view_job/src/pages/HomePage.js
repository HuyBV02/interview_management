import React, { useState } from "react";
import JobCard from "../components/JobCard";
import bannersidebar from "../assets/bannersidebar.jpg";

const HomePage = ({ jobList }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;

  // Filtering jobs based on search query
  const filteredJobs = jobList.filter(
    (job) =>
      job?.title?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      job?.workingAddress?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      job?.salaryFrom.toString()?.includes(searchQuery.trim()) ||
      job?.salaryTo.toString()?.includes(searchQuery.trim()) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase().trim())
      ) ||
      job.levels.some((level) =>
        level.toLowerCase().includes(searchQuery.toLowerCase().trim())
      )
  );

  // Calculate the current jobs to display
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <div className="mx-[180px] gap-5 flex justify-end">
      <div className="mt-[80px] w-[35%]">
        <img src={bannersidebar} />
      </div>
      <div className="w-[65%]">
        <div className="py-6">
          <div className="max-w-4xl mx-auto flex items-center bg-white rounded-full shadow-md overflow-hidden">
            <input
              type="text"
              placeholder="Vị trí tuyển dụng"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow px-4 py-2 text-gray-700 focus:outline-none"
            />
            <button className="bg-yellow-400 text-white px-6 py-2 rounded-r-full focus:outline-none">
              <i className="fas fa-search"></i> Tìm kiếm
            </button>
          </div>
        </div>
        <div className="py-8">
          {currentJobs.map((job, index) => (
            <JobCard key={index} job={job} />
          ))}
        </div>
        <div className="flex justify-center mt-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-3 py-1 border rounded ${
                currentPage === index + 1
                  ? "bg-yellow-400 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
