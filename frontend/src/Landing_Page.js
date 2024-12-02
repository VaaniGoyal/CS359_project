//Login_Page.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import computer from './comp.png';

function Login_Page() {
    const navigate = useNavigate();
    const handleLoginClick = async () => {
        navigate("/Login_Page"); 
    };
    const handleCreateClick = async () => {
        navigate("/Create_Account");
    };
  return (
    <div className="Landing_Page">
        <h1 className="landHead">Welcome to the Peer-to-Peer<br/>file sharing system</h1>
        <p className="landContent">The easiest way to share, download your files<br/>and connect to peers.<br/><br/>By: Vaani and Vaishika</p>
        <button class="login" onClick={handleLoginClick}>Login</button>
        <button class="create" onClick={handleCreateClick}>Sign Up</button>
        <div class="comp">
          <img src={computer} alt="comp" class="comp" />
        </div>
    </div>
  );
}

export default Login_Page;