import React, { useState } from 'react';
import "./style/hintingStyle.css";
import HintManager from './HintManager';
import { Link } from 'react-router-dom';
import { ClipboardDocumentListIcon, ChartBarIcon, DocumentTextIcon, LightBulbIcon ,LifebuoyIcon} from '@heroicons/react/24/outline'; // Importing Icons



const HintingManagement = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

  const handleMenuToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  return (
    // <div className="d-flex">
    //   <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
    //     <div className="profile">
    //       <img src={prof} alt="Profile" className="profile-pic" />
    //       <p className="profile-name">Dineth Heshan</p>
    //     </div>
    //     <ul className="nav flex-column nav-pills">
    //       <li className="nav-item" onClick={() => handleNavigation('home')}>
    //         Home
    //       </li>
    //       <li className="nav-item" onClick={() => handleNavigation('hint-management')}>
    //         Hint Management
    //       </li>
    //     </ul>
    //     <button className="logout-btn" onClick={() => console.log('Logout')}>
    //       Logout
    //     </button>
    //   </div>
    //   <div className="content">
    //     {currentPage === 'home' && <Home />}
    //     {currentPage === 'hint-management' && <HintManager/>}
    //   </div>
    //   <button className="sidebar-toggle" onClick={handleMenuToggle}>
    //     {isSidebarOpen ? '<<' : '>>'}
    //   </button>
    // </div>
    <div className="min-h-screen flex bg-gradient-to-r from-[#6482AD] to-[#7FA1C3]">


    {/* Fixed Vertical Navigation Bar */}
    <nav className="bg-white p-6 shadow-lg rounded-lg w-64 h-screen fixed top-0 left-0 overflow-y-auto">
        <h1 className="text-2xl font-bold text-[#6482AD] mb-6">Instructor Dashboard</h1>
        <div className="flex flex-col">
            <Link 
                to="/exams" 
                className="flex items-center text-lg text-[#6482AD] font-bold py-3 px-4 rounded-md mb-2 hover:bg-[#7FA1C3] hover:text-white transition duration-300"
            >
                <ClipboardDocumentListIcon className="h-6 w-6 mr-2" /> {/* Exam Icon */}
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
    <div className="ml-64 p-8 w-full overflow-y-auto" style={{ maxHeight: '100vh' }}>
    <div className="bg-[#F5EDED] p-8 rounded-lg shadow-lg max-w-3xl mx-auto">

    <h1 className="text-3xl font-bold text-[#6482AD] mb-6">Hinting Management</h1>


    <HintManager  />

</div>
</div>
</div>

  );
};
const Home = () => <div className="page-content">Home Page Content</div>;


export default HintingManagement;
