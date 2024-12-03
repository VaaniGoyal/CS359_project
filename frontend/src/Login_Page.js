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
      localStorage.setItem("token", response.data.access_token);
      navigate("/Main_Page"); 
    } catch (error) {
      setError("Sign-in failed. Please try again.");
    }
  };

  return (
    <div className="Login_Page">
      <div class="box">
        <h4 className="head">LOGIN<br/><br/></h4>
        <span>Email Address</span>
        <input type="text" class="textbox" placeholder="enter email..." value={email} onChange={(e) => setEmail(e.target.value)} />
        <span>Password</span>
        <input type="password" class="textbox" placeholder="enter password..." value={password} onChange={(e) => setPassword(e.target.value)} />
        <br/>
        <button className="btn" onClick={handleLoginClick}>Login</button>
        {error && <div style={{ color: "red", marginTop: "-25px" }}>{error}</div>}
      </div>
    </div>
  );
}

export default Login_Page;