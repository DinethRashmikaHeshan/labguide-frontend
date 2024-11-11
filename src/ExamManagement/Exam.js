import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ClipboardDocumentListIcon,
  ChartBarIcon,
  DocumentTextIcon,
  LightBulbIcon,
  LifebuoyIcon,
} from "@heroicons/react/24/outline"; // Importing Icons

function Exam() {
  const [exams, setExam] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null); // State to track the active accordion index

  useEffect(() => {
    getExams();
  }, []);

  const getExams = async () => {
    try {
      const res = await axios.get("http://localhost:3000/exam/exam");
      setExam(res.data);
    } catch (error) {
      alert("Error: " + error.response.data);
    }
  };

  const deleteExam = async (examID) => {
    try {
      await axios.delete(`http://localhost:3000/exam/exam/${examID}`);
      alert(`Exam Deleted`);
      getExams();
    } catch (error) {
      alert("Error: " + error.response.data);
    }
  };

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index); // Toggle active index
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-[#6482AD] to-[#7FA1C3]">
      {/* Navigation - Fixed Position */}
      <nav className="bg-white p-6 shadow-lg rounded-lg w-64 h-screen fixed top-0 left-0 overflow-y-auto">
        <h1 className="text-2xl font-bold text-[#6482AD] mb-6">
          Instructor Dashboard
        </h1>
        <div className="flex flex-col">
          <Link
            to="/exams"
            className="flex items-center text-lg text-[#6482AD] font-bold py-3 px-4 rounded-md mb-2 hover:bg-[#7FA1C3] hover:text-white transition duration-300"
          >
            <ClipboardDocumentListIcon className="h-6 w-6 mr-2" />{" "}
            {/* Exam Icon */}
            Exams
          </Link>
          <Link
            to="/results"
            className="flex items-center text-lg text-[#6482AD] font-bold py-3 px-4 rounded-md hover:bg-[#7FA1C3] hover:text-white transition duration-300"
          >
            <ChartBarIcon className="h-6 w-6 mr-2" /> {/* Results Icon */}
            Attendance
          </Link>
          <Link
            to="/all-students-reports"
            className="flex items-center text-lg text-[#6482AD] font-bold py-3 px-4 rounded-md hover:bg-[#7FA1C3] hover:text-white transition duration-300"
          >
            <DocumentTextIcon className="h-6 w-6 mr-2" /> {/* Results Icon */}
            Student Reports
          </Link>
          <Link
            to="/suggestions"
            className="flex items-center text-lg text-[#6482AD] font-bold py-3 px-4 rounded-md hover:bg-[#7FA1C3] hover:text-white transition duration-300"
          >
            <LightBulbIcon className="h-6 w-6 mr-2" /> {/* Results Icon */}
            Suggestion links
          </Link>
          <Link
            to="/hint"
            className="flex items-center text-lg text-[#6482AD] font-bold py-3 px-4 rounded-md hover:bg-[#7FA1C3] hover:text-white transition duration-300"
          >
            <LifebuoyIcon className="h-7 w-7 mr-2" /> {/* Results Icon */}
            Hinting Management
          </Link>
        </div>
      </nav>

      {/* Scrollable Exam Content */}
      <div
        className="ml-64 p-8 w-full overflow-y-auto"
        style={{ maxHeight: "100vh" }}
      >
        <div className="bg-[#F5EDED] p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-[#6482AD] mb-6">Exams</h1>
          <Link to={`/createExam`}>
            <button className="bg-[#6482AD] text-white py-3 px-6 rounded-md mb-4 hover:bg-[#7FA1C3] focus:outline-none focus:ring-2 focus:ring-[#7FA1C3]">
              Create a new EXAM
            </button>
          </Link>
          <div className="space-y-4">
            {" "}
            {/* Added spacing between exam cards */}
            {exams.map((exam, index) => {
              // Alternate between light and dark colors
              const cardClass =
                index % 2 === 0
                  ? "bg-[#E2DAD6] text-[#6482AD]"
                  : "bg-[#6482AD] text-[#F5EDED]";

              return (
                <div
                  key={index}
                  className={`rounded-lg shadow-md overflow-hidden`}
                >
                  <div
                    className={`${cardClass} p-4 cursor-pointer hover:bg-opacity-90 transition-all duration-300`}
                    onClick={() => toggleAccordion(index)}
                  >
                    <h2 className="text-lg font-semibold">
                      {exam.examDetails}
                    </h2>
                    <p className="text-md">
                      Date: {exam.eDate.split("T")[0]} | Time: {exam.eTime}
                    </p>
                  </div>
                  <div
                    className={`${cardClass} overflow-hidden transition-all duration-500`} // Increased duration
                    style={{
                      maxHeight: activeIndex === index ? "200px" : "0", // Set a fixed height for transition
                      opacity: activeIndex === index ? 1 : 0,
                      transition: "max-height 0.5s ease, opacity 0.5s ease", // Adjusted timing
                    }}
                  >
                    <div className={`p-4 border-t-2 border-[#7FA1C3]`}>
                      <div className="mb-4">
                        <label className="block text-lg font-semibold">
                          Exam Duration:
                        </label>
                        <p className="text-md">{exam.duration} min</p>
                      </div>
                      <div className="flex justify-between">
                        <button
                          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                          onClick={() => deleteExam(exam._id)}
                        >
                          DELETE
                        </button>
                        <Link to={`/question/${exam._id}`}>
                          <button className="bg-[#7FA1C3] text-white py-2 px-4 rounded-md hover:bg-[#6482AD] focus:outline-none focus:ring-2 focus:ring-[#6482AD]">
                            See More
                          </button>
                        </Link>
                        {/* Update Button */}
                        <Link to={`/updateExam/${exam._id}`}>
                          <button className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                            UPDATE
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Exam;
