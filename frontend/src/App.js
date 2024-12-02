//App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import Landing_Page from "./Landing_Page";
import Login_Page from "./Login_Page";
import Create_Account from "./Create_Account";
import Main_Page from "./Main_Page";
import headerImage from './header.png';
import './index.css';

function App() {
  return (
    <Router>
      <div class="header">
          <img src={headerImage} alt="Header" class="header" />
          <div class="header-text">Welcome to My Website</div>
      </div>
      <div class="half-background"></div>
      <div class="content">
        <Routes>
          <Route path="/" element={<Landing_Page />} />
          <Route path="/Login_Page" element={<Login_Page />} />
          <Route path="/Create_Account" element={<Create_Account />} />
          <Route path="/Main_Page" element={<Main_Page />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;