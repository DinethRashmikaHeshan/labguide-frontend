import React, { useState } from 'react';
import "./style/hintingStyle.css";
import HintManager from './HintManager';
import prof from './photos/prof.jpeg';

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
    <div className="d-flex">
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="profile">
          <img src={prof} alt="Profile" className="profile-pic" />
          <p className="profile-name">Dineth Heshan</p>
        </div>
        <ul className="nav flex-column nav-pills">
          <li className="nav-item" onClick={() => handleNavigation('home')}>
            Home
          </li>
          <li className="nav-item" onClick={() => handleNavigation('hint-management')}>
            Hint Management
          </li>
        </ul>
        <button className="logout-btn" onClick={() => console.log('Logout')}>
          Logout
        </button>
      </div>
      <div className="content">
        {currentPage === 'home' && <Home />}
        {currentPage === 'hint-management' && <HintManager/>}
      </div>
      <button className="sidebar-toggle" onClick={handleMenuToggle}>
        {isSidebarOpen ? '<<' : '>>'}
      </button>
    </div>
  );
};
const Home = () => <div className="page-content">Home Page Content</div>;


export default HintingManagement;
