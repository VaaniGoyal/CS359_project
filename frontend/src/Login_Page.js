//Login_Page.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login_Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const handleLoginClick = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/user/login", {
        email: email,
        password: password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/Main_Page"); 
    } catch (error) {
      setError("Sign-in failed. Please try again.");
    }
  };

  return (
    <div className="Login_Page">
      <br />
      <br />
      <h3>Welcome to P2P file distribution systems</h3>
      <div>
        <div>
            <h3><strong><u>LOGIN HERE</u></strong></h3><br />
            <span>Email Address</span>
            <input
              type="text"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <br />
            <span>Password</span>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <br />
            <div>
              <button
                onClick={handleLoginClick}
                type="submit"
              > Login </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Login_Page;